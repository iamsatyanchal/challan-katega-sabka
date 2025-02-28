// challan-history.tsx
import { useState } from "react"
import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserDetailsModal } from "./user-details-modal"
import type { ChallanDetails } from "./types"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface ChallanHistoryProps {
  challans: ChallanDetails[]
}

export function ChallanHistory({ challans }: ChallanHistoryProps) {
  const [selectedChallan, setSelectedChallan] = useState<ChallanDetails | null>(null)

  const sortedChallans = [...challans].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Challan History</h2>
      
      {sortedChallans.length === 0 ? (
        <div className="text-center py-8 text-gray-400">No challan history found</div>
      ) : (
        <div className="rounded-md border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-900">
                <TableRow>
                  <TableHead className="text-gray-300">Date</TableHead>
                  <TableHead className="text-gray-300">Violation</TableHead>
                  <TableHead className="text-gray-300 text-right">Amount (₹)</TableHead>
                  <TableHead className="text-gray-300 text-right">Status</TableHead>
                  <TableHead className="text-gray-300 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedChallans.map((challan, index) => (
                  <TableRow key={index} className="border-t border-gray-700">
                    <TableCell className="font-medium">{formatDate(challan.date)}</TableCell>
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
  )
}
