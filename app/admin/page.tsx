// /challan-katega-sabka/app/admin/page.tsx

import { AdminChallanTable } from "../AdminChallanTable"; // Adjust path
import { Card, CardContent } from "@/components/ui/card"; // Import Card components for error message

// This is a Server Component, ideal for data fetching
async function fetchAllChallans() {
  // Call your new API route
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/all-challans`, {
    cache: 'no-store' // Ensure data is always fresh
  });

  if (!res.ok) {
    console.error("Failed to fetch all challans:", res.status, await res.text());
    throw new Error('Failed to fetch all challans');
  }

  return res.json();
}

export default async function AdminPage() {
  let challans = [];
  let error = null;

  try {
    challans = await fetchAllChallans();
  } catch (err: any) {
    console.error("Error in AdminPage fetch:", err);
    error = err.message || "An error occurred while loading challans.";
  }

  return (
    <div className= "container mx-auto p-4 max-w-6xl" > {/* Increased max-width */ }
    < header className = "mb-8" >
      <h1 className="text-2xl font-bold" > Admin Dashboard < /h1>
        < p className = "text-gray-400" > View and manage all issued traffic challans < /p>
          < /header>

  {
    error ? (
      <Card className= "bg-gray-700 border-red-500" >
      <CardContent className="p-4" >
        <p className="text-red-400" > Error loading challan data: { error } </p>
          < /CardContent>
          < /Card>
      ) : (
      // Pass the fetched challans to the AdminChallanTable component
      <AdminChallanTable challans= { challans } />
      )
  }
  </div>
  );
}