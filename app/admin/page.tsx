// /challan-katega-sabka/app/admin/page.tsx

import { AdminChallanTable } from "../AdminChallanTable"; // Adjust path
// No need to import Card components here anymore, AdminChallanTable will handle the error display

// This is a Server Component, ideal for data fetching
async function fetchAllChallans() {
  // Call your new API route
  // Ensure NEXT_PUBLIC_BASE_URL is set in your .env.local file
  // e.g., NEXT_PUBLIC_BASE_URL=http://localhost:3000 for local dev
  // or the deployed URL for production
  const res = await fetch('https://challan-katega-sabka.vercel.app/api/all-challans', {
     cache: 'no-store' // Ensure data is always fresh
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Failed to fetch all challans:", res.status, errorText);
    // Throw an error with the status and response text for better debugging
    throw new Error(`Failed to fetch all challans: ${res.status} - ${errorText}`);
  }

  return res.json();
}

export default async function AdminPage() {
  let challans = [];
  let error: string | null = null; // Explicitly type error as string or null

  try {
    challans = await fetchAllChallans();
  } catch (err: any) {
    console.error("Error in AdminPage fetch:", err);
    error = err.message || "An unknown error occurred while loading challans.";
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl"> {/* Increased max-width */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-400">View and manage all issued traffic challans</p>
      </header>

      {/* Always render the client component and pass data/error as props */}
      <AdminChallanTable challans={challans} error={error} />

    </div>
  );
}
