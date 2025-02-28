// user-details-modal.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ChallanDetails } from "./types"

interface UserDetailsModalProps {
  details: ChallanDetails
}

export function UserDetailsModal({ details }: UserDetailsModalProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex justify-between items-center">
          <span>Challan Details</span>
          {details.status && (
            <span className={`px-3 py-1 rounded-full text-sm ${
              details.status === "Paid" 
                ? "bg-green-900 text-green-300"
                : "bg-red-900 text-red-300"
            }`}>
              {details.status}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <span className="text-gray-400 block text-sm">Name:</span>
              <span className="text-white">{details.name}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-sm">Vehicle Number:</span>
              <span className="text-white font-medium">{details.plateNumber}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-sm">Vehicle Type:</span>
              <span className="text-white">{details.vehicleType}</span>
            </div>
            {details.location && (
              <div>
                <span className="text-gray-400 block text-sm">Location:</span>
                <span className="text-white">{details.location}</span>
              </div>
            )}
          </div>
          <div className="space-y-3">
            <div>
              <span className="text-gray-400 block text-sm">Violation:</span>
              <span className="text-white">{details.violation}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-sm">Fine Amount:</span>
              <span className="text-white font-medium">₹{details.fineAmount}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-sm">Date:</span>
              <span className="text-white">{formatDate(details.date)}</span>
            </div>
            {details.remarks && (
              <div>
                <span className="text-gray-400 block text-sm">Remarks:</span>
                <span className="text-white">{details.remarks}</span>
              </div>
            )}
          </div>
        </div>
        {details.image && (
          <div className="mt-4">
            <span className="text-gray-400 block text-sm mb-2">Evidence Photo:</span>
            <img src={details.image} alt="Challan Evidence" className="w-full h-auto rounded-lg" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
