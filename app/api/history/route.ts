// api/history/route.ts
import { NextResponse } from "next/server"
import type { ChallanDetails } from "../../types"

// Demo database with history records
const demoDatabase: ChallanDetails[] = [
  {
    name: "Rahul Kumar",
    plateNumber: "MH01AB1234",
    vehicleType: "Car",
    violation: "Overspeeding",
    fineAmount: 1000,
    date: "2024-02-24",
    image: "https://xsgames.co/randomusers/avatar.php?g=male",
    location: "Western Express Highway",
    status: "Unpaid"
  },
  {
    name: "Rahul Kumar",
    plateNumber: "MH01AB1234",
    vehicleType: "Car",
    violation: "Illegal Parking",
    fineAmount: 500,
    date: "2024-02-15",
    image: "https://xsgames.co/randomusers/avatar.php?g=male",
    location: "Andheri East",
    status: "Paid"
  },
  {
    name: "Rahul Kumar",
    plateNumber: "MH01AB1234",
    vehicleType: "Car",
    violation: "Red Light Violation",
    fineAmount: 700,
    date: "2024-01-28",
    image: "https://xsgames.co/randomusers/avatar.php?g=male",
    location: "Dadar Signal",
    status: "Paid"
  },
  {
    name: "Priya Singh",
    plateNumber: "MH02CD5678",
    vehicleType: "Car",
    violation: "Red Light Violation",
    fineAmount: 500,
    date: "2024-02-24",
    image: "https://xsgames.co/randomusers/avatar.php?g=female",
    location: "Juhu Circle",
    status: "Unpaid"
  },
  {
    name: "Priya Singh",
    plateNumber: "MH02CD5678",
    vehicleType: "Car",
    violation: "No Seatbelt",
    fineAmount: 300,
    date: "2024-01-10",
    image: "https://xsgames.co/randomusers/avatar.php?g=female",
    location: "Marine Drive",
    status: "Paid"
  },
  {
    name: "Amit Patel",
    plateNumber: "GJ03EF9012",
    vehicleType: "Bike",
    violation: "No Helmet",
    fineAmount: 300,
    date: "2024-02-24",
    image: "https://xsgames.co/randomusers/avatar.php?g=male",
    location: "SG Highway",
    status: "Unpaid"
  }
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const plate = searchParams.get("plate")

  if (!plate) {
    return NextResponse.json({ error: "Plate number is required" }, { status: 400 })
  }

  // Search for all challans with the given plate number
  const challanHistory = demoDatabase.filter(
    (entry) => entry.plateNumber.toLowerCase() === plate.toLowerCase()
  )

  if (challanHistory.length === 0) {
    return NextResponse.json({ error: "No challan history found for this plate number" }, { status: 404 })
  }

  return NextResponse.json(challanHistory)
}
