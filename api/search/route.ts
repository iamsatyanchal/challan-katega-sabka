import { NextResponse } from "next/server"
import type { ChallanDetails } from "../../types"

// Demo database
const demoDatabase: ChallanDetails[] = [
  {
    name: "Rahul Kumar BKL",
    plateNumber: "ABC",
    vehicleType: "Car",
    violation: "Overspeeding",
    fineAmount: 1000,
    date: "2024-02-24",
    image: "https://xsgames.co/randomusers/avatar.php?g=male",
  },
  {
    name: "Priya Singh LAUDIYA",
    plateNumber: "MH02CD5678",
    vehicleType: "Car",
    violation: "Red Light Violation",
    fineAmount: 500,
    date: "2024-02-24",
    image: "https://xsgames.co/randomusers/avatar.php?g=female",
  },
  {
    name: "Amit Patel MUTTHIWALA",
    plateNumber: "GJ03EF9012",
    vehicleType: "Bike",
    violation: "No Helmet",
    fineAmount: 300,
    date: "2024-02-24",
    image: "https://xsgames.co/randomusers/avatar.php?g=male",
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const plate = searchParams.get("plate")

  if (!plate) {
    return NextResponse.json({ error: "Plate number is required" }, { status: 400 })
  }

  // Search for the plate number in the demo database
  const challanDetails = demoDatabase.find(
    (entry) => entry.plateNumber.toLowerCase() === plate.toLowerCase()
  )

  if (!challanDetails) {
    return NextResponse.json({ error: "No challan found for this plate number" }, { status: 404 })
  }

  return NextResponse.json(challanDetails)
}
