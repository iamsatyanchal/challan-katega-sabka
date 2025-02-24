import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ChallanDetails } from "./types"

interface UserDetailsModalProps {
  details: ChallanDetails
}

export function UserDetailsModal({ details }: UserDetailsModalProps) {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Challan Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex gap-2">
              <span className="text-gray-400">Name:</span>
              <span className="text-white">{details.name}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-400">Vehicle Number:</span>
              <span className="text-white">{details.plateNumber}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-400">Vehicle Type:</span>
              <span className="text-white">{details.vehicleType}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex gap-2">
              <span className="text-gray-400">Violation:</span>
              <span className="text-white">{details.violation}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-400">Fine Amount:</span>
              <span className="text-white">₹{details.fineAmount}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-400">Date:</span>
              <span className="text-white">{details.date}</span>
            </div>
          </div>
        </div>
        {details.image && (
          <div className="mt-4">
            <img src={details.image} alt="Challan" className="w-full h-auto rounded-lg" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

