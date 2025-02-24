"use client"

import { useState, useRef } from "react"
import { Camera, Search, Upload } from "lucide-react"
import Webcam from "react-webcam"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserDetailsModal } from "./user-details-modal"
import type { ChallanDetails } from "./types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ChallanSystem() {
  const [mode, setMode] = useState<"camera" | "search" | "upload">("search")
  const [searchPlate, setSearchPlate] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [challanDetails, setChallanDetails] = useState<ChallanDetails | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const webcamRef = useRef<Webcam>(null)

  const handleSearch = async (plateNumber: string) => {
    setIsProcessing(true)
    setError(null)
    try {
      const response = await fetch(`/api/search?plate=${plateNumber}`)
      const data = await response.json()

      if (response.ok) {
        setChallanDetails(data)
      } else {
        setError(data.error || "No challan found")
      }
    } catch (error) {
      setError("Error fetching data")
      console.error("Error fetching data:", error)
    }
    setIsProcessing(false)
  }

  const processImage = async (imageData: string) => {
    setIsProcessing(true)
    setError(null)
    try {
      // First, send the image to our OCR API
      const ocrResponse = await fetch("/api/ocr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageData }),
      })

      const ocrData = await ocrResponse.json()

      if (ocrData.error) {
        setError("Could not detect license plate")
        return
      }

      // If we successfully detected text, search for the plate number
      if (ocrData.result[0].text) {
        await handleSearch(ocrData.result[0].text)
      } else {
        setError("No license plate detected for:" + ocrData.result[0].text)
      }
    } catch (error) {
      setError("Error processing image")
      console.error("Error processing image:", error)
    }
    setIsProcessing(false)
  }

  const handleCapture = async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot()
      if (imageSrc) {
        await processImage(imageSrc)
      }
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file")
      return
    }

    // Convert file to base64
    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64String = reader.result as string
      await processImage(base64String)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Traffic Challan System</h1>
          <p className="text-gray-400">
            Search or capture vehicle number plates to check challan details
          </p>
        </div>

        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="search" onClick={() => setMode("search")}>
              <Search className="mr-2 h-4 w-4" />
              Search
            </TabsTrigger>
            <TabsTrigger value="camera" onClick={() => setMode("camera")}>
              <Camera className="mr-2 h-4 w-4" />
              Camera
            </TabsTrigger>
            <TabsTrigger value="upload" onClick={() => setMode("upload")}>
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </TabsTrigger>
          </TabsList>

          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <TabsContent value="search">
              <div className="flex gap-4">
                <Input
                  type="text"
                  placeholder="Enter vehicle number plate..."
                  value={searchPlate}
                  onChange={(e) => setSearchPlate(e.target.value)}
                  className="bg-gray-700 text-white border-gray-600"
                />
                <Button onClick={() => handleSearch(searchPlate)} disabled={isProcessing}>
                  Search
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="camera">
              <div className="relative">
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
                <Button
                  className="absolute bottom-4 right-4"
                  onClick={handleCapture}
                  disabled={isProcessing}
                >
                  Capture Plate
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="upload">
              <div className="text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  ref={fileInputRef}
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  variant="secondary"
                  className="w-full h-32 flex flex-col items-center justify-center gap-2"
                >
                  <Upload className="h-8 w-8" />
                  <span>Click to upload image</span>
                  <span className="text-sm text-gray-400">Supports: JPG, PNG</span>
                </Button>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {isProcessing && (
          <div className="text-center text-gray-400 my-4">
            Processing... Please wait.
          </div>
        )}

        {error && <div className="text-center text-red-400 my-4">{error}</div>}

        {challanDetails && <UserDetailsModal details={challanDetails} />}
      </div>
    </div>
  )
}
