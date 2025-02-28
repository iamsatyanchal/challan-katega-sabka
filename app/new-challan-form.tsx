import { useState, useRef } from "react"
import { Camera } from "lucide-react"
import Webcam from "react-webcam"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

interface NewChallanFormProps {
  capturedImage: string | null
}

export function NewChallanForm({ capturedImage }: NewChallanFormProps) {
  const [plateNumber, setPlateNumber] = useState("")
  const [name, setName] = useState("")
  const [vehicleType, setVehicleType] = useState("")
  const [violation, setViolation] = useState("")
  const [fineAmount, setFineAmount] = useState("")
  const [location, setLocation] = useState("")
  const [remarks, setRemarks] = useState("")
  const [image, setImage] = useState<string | null>(capturedImage)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const webcamRef = useRef<Webcam>(null)

  const handleCapture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot()
      if (imageSrc) {
        setImage(imageSrc)
        setShowCamera(false)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch("/api/issue-challan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plateNumber,
          name,
          vehicleType,
          violation,
          fineAmount: Number(fineAmount),
          location,
          remarks,
          image,
          date: new Date().toISOString().split('T')[0],
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        // Reset form
        setPlateNumber("")
        setName("")
        setVehicleType("")
        setViolation("")
        setFineAmount("")
        setLocation("")
        setRemarks("")
        setImage(null)
      } else {
        setError(data.error || "Failed to issue challan")
      }
    } catch (error) {
      setError("Error issuing challan. Please try again.")
      console.error("Error issuing challan:", error)
    }

    setIsSubmitting(false)
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Issue New Challan</h2>
      
      {success && (
        <Card className="bg-gray-700 border-green-500 mb-6">
          <CardContent className="p-4">
            <p className="text-green-400">Challan has been successfully issued!</p>
          </CardContent>
        </Card>
      )}
      
      {error && (
        <Card className="bg-gray-700 border-red-500 mb-6">
          <CardContent className="p-4">
            <p className="text-red-400">{error}</p>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Vehicle Number Plate*
            </label>
            <Input 
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value)}
              className="bg-gray-700 text-white border-gray-600"
              placeholder="e.g. MH02AB1234"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Owner/Driver Name*
            </label>
            <Input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-700 text-white border-gray-600"
              placeholder="Full Name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Vehicle Type*
            </label>
            <Select value={vehicleType} onValueChange={setVehicleType} required>
              <SelectTrigger className="bg-gray-700 text-white border-gray-600">
                <SelectValue placeholder="Select vehicle type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 text-white border-gray-600">
                <SelectItem value="Car">Car</SelectItem>
                <SelectItem value="Bike">Bike</SelectItem>
                <SelectItem value="Truck">Truck</SelectItem>
                <SelectItem value="Bus">Bus</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Violation Type*
            </label>
            <Select value={violation} onValueChange={setViolation} required>
              <SelectTrigger className="bg-gray-700 text-white border-gray-600">
                <SelectValue placeholder="Select violation" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 text-white border-gray-600">
                <SelectItem value="Overspeeding">Overspeeding</SelectItem>
                <SelectItem value="Red Light Violation">Red Light Violation</SelectItem>
                <SelectItem value="No Helmet">No Helmet</SelectItem>
                <SelectItem value="Illegal Parking">Illegal Parking</SelectItem>
                <SelectItem value="Wrong Side Driving">Wrong Side Driving</SelectItem>
                <SelectItem value="No Seatbelt">No Seatbelt</SelectItem>
                <SelectItem value="Driving Without License">Driving Without License</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Fine Amount (₹)*
            </label>
            <Input 
              type="number"
              value={fineAmount}
              onChange={(e) => setFineAmount(e.target.value)}
              className="bg-gray-700 text-white border-gray-600"
              placeholder="e.g. 500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Location
            </label>
            <Input 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-gray-700 text-white border-gray-600"
              placeholder="e.g. MG Road, Junction"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Remarks
          </label>
          <Textarea 
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="bg-gray-700 text-white border-gray-600"
            placeholder="Additional details about the violation"
            rows={3}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Vehicle Image*
          </label>
          
          {showCamera ? (
            <div className="relative mb-4">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full rounded-lg"
                videoConstraints={{
                  width: 1280,
                  height: 720,
                  facingMode: "environment",
                }}
              />
              <div className="absolute bottom-4 right-4 flex gap-2">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setShowCamera(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleCapture}
                >
                  Capture
                </Button>
              </div>
            </div>
          ) : (
            <div className="mb-4">
              {image ? (
                <div className="relative">
                  <img 
                    src={image} 
                    alt="Vehicle" 
                    className="w-full max-h-64 object-contain rounded-lg mb-2" 
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setImage(null)}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <Button 
                  type="button"
                  onClick={() => setShowCamera(true)}
                  className="w-full h-32 flex flex-col items-center justify-center gap-2"
                  variant="secondary"
                >
                  <Camera className="h-8 w-8" />
                  <span>Take Vehicle Photo</span>
                </Button>
              )}
            </div>
          )}
        </div>
        
        <div className="flex justify-end">
          <Button 
            type="submit"
            disabled={isSubmitting || !plateNumber || !name || !vehicleType || !violation || !fineAmount}
            className="px-6"
          >
            {isSubmitting ? "Processing..." : "Issue Challan"}
          </Button>
        </div>
      </form>
    </div>
  )
}
