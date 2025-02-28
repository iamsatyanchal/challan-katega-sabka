// api/pay-challan/route.ts
import { NextResponse } from "next/server"
import { updateChallanStatus } from "@/services/db-service"

export async function POST(request: Request) {
  try {
    const { challanId } = await request.json()
    
    if (!challanId) {
      return NextResponse.json(
        { error: "Challan ID is required" },
        { status: 400 }
      )
    }
    
    // Update challan status to paid
    const updatedChallan = await updateChallanStatus(challanId, "Paid")
    
    if (!updatedChallan) {
      return NextResponse.json(
        { error: "Challan not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { success: true, message: "Payment processed successfully", challan: updatedChallan },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error processing payment:", error)
    return NextResponse.json(
      { error: "Failed to process payment" },
      { status: 500 }
    )
  }
}
