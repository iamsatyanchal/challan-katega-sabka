// api/issue-challan/route.ts
import { NextResponse } from "next/server"
import type { ChallanDetails } from "../../types"

// In a real app, this would connect to a database
export async function POST(request: Request) {
  try {
    const challanData = await request.json()
    
    // Validate required fields
    const requiredFields = ['plateNumber', 'name', 'vehicleType', 'violation', 'fineAmount']
    for (const field of requiredFields) {
      if (!challanData[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }
    
    // In a real app, this would save to a database
    // For demo, we'll just return success
    
    // Add default status
    challanData.status = "Unpaid"
    
    return NextResponse.json({ 
      success: true,
      message: "Challan issued successfully",
      data: challanData
    })
  } catch (error) {
    console.error("Error issuing challan:", error)
    return NextResponse.json({ error: "Failed to issue challan" }, { status: 500 })
  }
}
