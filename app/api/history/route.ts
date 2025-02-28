import { NextResponse } from "next/server"
import type { ChallanDetails } from "../../types"

// JSONBin.io configuration
const JSON_BIN_URL = "https://api.jsonbin.io/v3/b"
const JSON_BIN_SECRET = "$2b$10$TURjBht56uajdznniz5hReUlkI5R1CxD1rOOatKvrffurL6Jf3gkS" // Set this in your .env
const BIN_ID = "67c1ca0ae41b4d34e49e5c94" // Set this in your .env

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const plate = searchParams.get("plate")

  if (!plate) {
    return NextResponse.json({ error: "Plate number is required" }, { status: 400 })
  }

  try {
    // Fetch all challans from JSONBin.io
    const response = await fetch(`${JSON_BIN_URL}/${BIN_ID}/latest`, {
      headers: {
        'X-Master-Key': JSON_BIN_SECRET,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch challan data from JSONBin.io")
    }

    const data = await response.json()
    const challans: ChallanDetails[] = data.record

    // Filter challans by the given plate number
    const challanHistory = challans.filter(
      (entry) => entry.plateNumber.toLowerCase() === plate.toLowerCase()
    )

    if (challanHistory.length === 0) {
      return NextResponse.json(
        { error: "No challan history found for this plate number" },
        { status: 404 }
      )
    }

    return NextResponse.json(challanHistory)
  } catch (error) {
    console.error("Error fetching challan history:", error)
    return NextResponse.json(
      { error: "An error occurred while fetching challan history" },
      { status: 500 }
    )
  }
}
