// api/issue-challan/route.ts
import { NextResponse } from "next/server"
import { addChallan } from "@/services/db-service"
import type { ChallanDetails } from "@/types"

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
    
    // Add challan to database
    const newChallan = await addChallan(challanData)
    
    return NextResponse.json(
      { success: true, message: "Challan issued successfully", challan: newChallan },
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
