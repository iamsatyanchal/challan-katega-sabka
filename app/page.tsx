// page.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import { Camera, Search, Upload, History, FileText } from "lucide-react"
import Webcam from "react-webcam"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserDetailsModal } from "./user-details-modal"
import { NewChallanForm } from "./new-challan-form"
import { ChallanHistory } from "./challan-history"
import type { ChallanDetails } from "./types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAllChallans, getChallansByPlate } from "./services/db-service"

export default function ChallanSystem() {
  const [mode, setMode] = useState<"camera" | "search" | "upload" | "issue" | "history">("search")
  const [searchPlate, setSearchPlate] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [challanDetails, setChallanDetails] = useState<ChallanDetails | null>(null)
  const [historyData, setHistoryData] = useState<ChallanDetails[]>([])
  const [error, setError] = useState<string | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const webcamRef = useRef<Webcam>(null)

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await getAllChallans()
      } catch (error) {
        console.error("Failed to initialize data:", error)
      }
    }
    
    fetchInitialData()
  }, [])

  const handleSearch = async (plateNumber: string) => {
    if (!plateNumber.trim()) {
      setError("Please enter a vehicle number plate")
      return
    }
    
    setIsProcessing(true)
    setError(null)
    try {
      const challans = await getChallansByPlate(plateNumber)
      
      if (challans.length > 0) {
        // Find the most recent unpaid challan
        const unpaidChallans = challans.filter(c => c.status === "Unpaid")
        
        if (unpaidChallans.length > 0) {
          // Sort by date, most recent first
          const sortedUnpaid = unpaidChallans.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          
          setChallanDetails(sortedUnpaid[0])
        } else {
          // If no unpaid challans, show the most recent one
          const sortedChallans = challans.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          
          setChallanDetails(sortedChallans[0])
        }
      } else {
        setError("No challan found for this vehicle")
      }
    } catch (error) {
      setError("Error fetching data")
      console.error("Error fetching data:", error)
    }
    setIsProcessing(false)
  }

  const handleFetchHistory = async (plateNumber: string) => {
    if (!plateNumber.trim()) {
      setError("Please enter a vehicle number plate")
      return
    }
    
    setIsProcessing(true)
    setError(null)
    try {
      const challans = await getChallansByPlate(plateNumber)
      
      if (challans.length > 0) {
        setHistoryData(challans)
      } else {
        setHistoryData([])
        setError("No challan history found for this vehicle")
      }
    } catch (error) {
      setError("Error fetching history")
      console.error("Error fetching history:", error)
    }
    setIsProcessing(false)
  }

  const handlePaymentComplete = async (challanId: string) => {
    try {
      const response = await fetch("/api/pay-challan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ challanId }),
      })

      if (response.ok) {
        // Refresh the history data
        if (searchPlate) {
          await handleFetchHistory(searchPlate)
        }
      } else {
        console.error("Payment update failed")
      }
    } catch (error) {
      console.error("Payment update error:", error)
    }
  }

  const processImage = async (imageData: string) => {
    setIsProcessing(true)
    setError(null)
    setCapturedImage(imageData)
    
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
      if (ocrData.result && ocrData.result[0] && ocrData.result[0].text) {
        if (mode === "camera" || mode === "upload") {
          await handleSearch(ocrData.result[0].text)
        } else if (mode === "issue") {
          // Switch to issue tab with the detected plate number
          setMode("issue")
          return ocrData.result[0].text
        }
      } else {
        setError("No license plate detected in image")
      }
    } catch (error) {
      setError("Error processing image")
      console.error("Error processing image:", error)
    }
    setIsProcessing(false)
    return null
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

  const handleChallanCreated = async () => {
    // Reset the captured image
    setCapturedImage(null)
    // If we have a search plate, refresh the history
    if (searchPlate) {
      await handleFetchHistory(searchPlate)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Traffic Challan Management System</h1>
        <p className="text-gray-400">Search, view, and pay traffic challans</p>
      </header>

      <div className="mb-6">
        <Tabs defaultValue="search" value={mode} onValueChange={(val: any) => setMode(val)}>
          <TabsList className="mb-4">
            <TabsTrigger value="search" className="flex items-center">
              <Search className="mr-2 h-4 w-4" />
              Search
            </TabsTrigger>
            <TabsTrigger value="camera" className="flex items-center">
              <Camera className="mr-2 h-4 w-4" />
              Camera
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center">
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="issue" className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Issue Challan
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center">
              <History className="mr-2 h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search">
            <div className="mb-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter vehicle number plate"
                  value={searchPlate}
                  onChange={(e) => setSearchPlate(e.target.value)}
                  className="bg-gray-800 border-gray-700"
                />
                <Button 
                  onClick={() => handleSearch(searchPlate)} 
                  disabled={isProcessing || !searchPlate}
                >
                  {isProcessing ? 'Searching...' : 'Search'}
                </Button>
              </div>
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>

            {challanDetails && (
              <UserDetailsModal details={challanDetails} />
            )}
          </TabsContent>

          <TabsContent value="camera">
            <div className="space-y-4">
              {!capturedImage ? (
                <>
                  <div className="rounded-lg overflow-hidden border border-gray-700">
                    <Webcam
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      videoConstraints={{
                        facingMode: "environment"
                      }}
                      className="w-full"
                    />
                  </div>
                  <Button onClick={handleCapture} disabled={isProcessing}>
                    {isProcessing ? 'Processing...' : 'Capture Plate'}
                  </Button>
                </>
              ) : (
                <>
                  <div className="rounded-lg overflow-hidden border border-gray-700">
                    <img src={capturedImage} alt="Captured" className="w-full" />
                  </div>
                  <Button onClick={() => setCapturedImage(null)}>Capture Again</Button>
                </>
              )}
              {error && <p className="text-red-500">{error}</p>}
              {challanDetails && (
                <UserDetailsModal details={challanDetails} />
              )}
            </div>
          </TabsContent>

          <TabsContent value="upload">
            <div className="space-y-4">
              <div 
                className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center cursor-pointer hover:border-gray-500 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                <p>Click to upload or drag and drop</p>
                <p className="text-sm text-gray-400">PNG, JPG or JPEG</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*"
                />
              </div>
              
              {capturedImage && (
                <div className="rounded-lg overflow-hidden border border-gray-700 mt-4">
                  <img src={capturedImage} alt="Uploaded" className="w-full" />
                </div>
              )}
              
              {error && <p className="text-red-500">{error}</p>}
              
              {challanDetails && (
                <UserDetailsModal details={challanDetails} />
              )}
            </div>
          </TabsContent>

          <TabsContent value="issue">
            <NewChallanForm 
              initialPlate={searchPlate} 
              capturedImage={capturedImage}
              onChallanCreated={handleChallanCreated}
            />
          </TabsContent>

          <TabsContent value="history">
            <div className="mb-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter vehicle number plate"
                  value={searchPlate}
                  onChange={(e) => setSearchPlate(e.target.value)}
                  className="bg-gray-800 border-gray-700"
                />
                <Button 
                  onClick={() => handleFetchHistory(searchPlate)} 
                  disabled={isProcessing || !searchPlate}
                >
                  {isProcessing ? 'Fetching...' : 'Fetch History'}
                </Button>
              </div>
              
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>

            {historyData.length > 0 && (
              <ChallanHistory 
                challans={historyData} 
                onPaymentComplete={handlePaymentComplete}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
