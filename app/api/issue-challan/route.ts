// api/issue-challan/route.ts
import { NextResponse } from "next/server"
import type { ChallanDetails } from "../../types"

// Mock database - in a real app, this would be persisted to a database
const challans: ChallanDetails[] = []

export async function POST(request: Request) {
  try {
    const challanData = await request.json()
    
    // Validate required fields
    if (!challanData.plateNumber || !challanData.name || !challanData.violation || !challanData.fineAmount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }
    
    // Create new challan with unpaid status
    const newChallan: ChallanDetails = {
      ...challanData,
      status: "Unpaid"
    }
    
    // Save to database (mock)
    challans.push(newChallan)
    
    return NextResponse.json(
      { success: true, message: "Challan issued successfully", challanId: challans.length },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error processing challan:", error)
    return NextResponse.json(
      { error: "Failed to process challan" },
      { status: 500 }
    )
  }
}
