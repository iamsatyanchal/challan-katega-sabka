// /challan-katega-sabka/app/api/all-challans/route.ts

import { NextResponse } from "next/server";
import { getAllChallans } from "../../services/db-service"; // Adjust path if necessary

export async function GET() {
  try {
    const allChallans = await getAllChallans();

    // JSONBin.io response includes 'record' field for the actual data
    // Ensure we handle the structure returned by getAllChallans
    // Based on db-service.ts, getAllChallans already returns data.record or localCache
    // So we can return it directly.

    return NextResponse.json(allChallans);
  } catch (error) {
    console.error("Error fetching all challans:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching all challans" },
      { status: 500 }
    );
  }
}