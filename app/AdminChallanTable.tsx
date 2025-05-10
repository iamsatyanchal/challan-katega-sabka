// /challan-katega-sabka/app/AdminChallanTable.tsx

"use client"; // This component uses client-side state (for modal)

import { useState, useMemo } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserDetailsModal } from "./user-details-modal";
import type { ChallanDetails } from "./types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Keep Card imports here

interface AdminChallanTableProps {
  challans: ChallanDetails[];
  error: string | null; // Add the error prop
}

export function AdminChallanTable({ challans, error }: AdminChallanTableProps) {
  const [selectedChallan, setSelectedChallan] = useState<ChallanDetails | null>(null);

  // Calculate summary statistics - only if challans data is available
  const stats = useMemo(() => {
    const total = challans.length;
    const paid = challans.filter(c => c.status === "Paid").length;
    const unpaid = total - paid;
    return { total, paid, unpaid };
  }, [challans]); // Recalculate when challans prop changes

  // Sort challans by date, most recent first - only if challans data is available
  const sortedChallans = useMemo(() => {
    if (!challans || challans.length === 0) return [];
    return [...challans].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [challans]); // Recalculate when challans prop changes


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Handle the error display within the client component
  if (error) {
    return (
      <Card className="bg-gray-700 border-red-500">
        <CardContent className="p-4">
          <p className="text-red-400">Error loading challan data: {error}</p>
        </CardContent>
      </Card>
    );
  }

  // Render the table and stats if no error and challans are available
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">All Challans</h2>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-gray-300">Total Challans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-gray-300">Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">{stats.paid}</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-gray-300">Unpaid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">{stats.unpaid}</div>
          </CardContent>
        </Card>
      </div>

      {/* Challan Table */}
      {sortedChallans.length === 0 ? (
        <div className="text-center py-8 text-gray-400">No challans found in the system</div>
      ) : (
        <div className="rounded-md border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-900">
                <TableRow>
                  <TableHead className="text-gray-300">ID</TableHead>
                  <TableHead className="text-gray-300">Date</TableHead>
                  <TableHead className="text-gray-300">Plate No.</TableHead>
                  <TableHead className="text-gray-300">Name</TableHead>
                  <TableHead className="text-gray-300">Violation</TableHead>
                  <TableHead className="text-gray-300 text-right">Amount (₹)</TableHead>
                  <TableHead className="text-gray-300 text-right">Status</TableHead>
                  <TableHead className="text-gray-300 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedChallans.map((challan) => (
                  <TableRow key={challan.id || challans.indexOf(challan)} className="border-t border-gray-700">
                    <TableCell className="font-medium text-xs">{challan.id?.substring(0, 6) || 'N/A'}</TableCell>
                    <TableCell>{formatDate(challan.date)}</TableCell>
                    <TableCell>{challan.plateNumber}</TableCell>
                    <TableCell>{challan.name}</TableCell>
                    <TableCell>{challan.violation}</TableCell>
                    <TableCell className="text-right">₹{challan.fineAmount}</TableCell>
                    <TableCell className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        challan.status === "Paid"
                          ? "bg-green-900 text-green-300"
                          : "bg-red-900 text-red-300"
                      }`}>
                        {challan.status || "Unpaid"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedChallan(challan)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {selectedChallan && (
        <div className="mt-6">
          <UserDetailsModal details={selectedChallan} />
          <div className="flex justify-end mt-4">
             <Button
              variant="outline"
              onClick={() => setSelectedChallan(null)}
              className="border-gray-600 text-gray-300"
            >
              Close Details
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
