import { useState } from "react"
import { CreditCard, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ChallanDetails } from "./types"

interface PaymentModalProps {
  challan: ChallanDetails
  onClose: () => void
  onPaymentComplete: (challanId: string) => void
  isProcessing: boolean
}

export function PaymentModal({ challan, onClose, onPaymentComplete, isProcessing }: PaymentModalProps) {
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [cardName, setCardName] = useState("")
  const [paymentStep, setPaymentStep] = useState<"details" | "processing" | "success">("details")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Simulate payment processing
    setPaymentStep("processing")
    
    // Simulate network delay
    setTimeout(() => {
      setPaymentStep("success")
      // Wait a moment before calling onPaymentComplete
      setTimeout(() => {
        if (challan.id) {
          onPaymentComplete(challan.id)
        }
      }, 1500)
    }, 2000)
  }

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }
    
    return v
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-white border-gray-700 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            Pay Challan
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Complete your payment of ₹{challan.fineAmount} for challan #{challan.id}
          </DialogDescription>
        </DialogHeader>

        {paymentStep === "details" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="cardName">Cardholder Name</Label>
              <Input
                id="cardName"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="John Doe"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="MM/YY"
                  maxLength={5}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  type="password"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ""))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="123"
                  maxLength={3}
                  required
                />
              </div>
            </div>
            
            <DialogFooter className="pt-4">
              <Button variant="outline" type="button" onClick={onClose} className="border-gray-600">
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              
              <Button type="submit" disabled={isProcessing}>
                <CreditCard className="mr-2 h-4 w-4" />
                Pay ₹{challan.fineAmount}
              </Button>
            </DialogFooter>
          </form>
        )}

        {paymentStep === "processing" && (
          <div className="py-8 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
            <p>Processing your payment...</p>
            <p className="text-gray-400 text-sm mt-2">Please do not close this window</p>
          </div>
        )}

        {paymentStep === "success" && (
          <div className="py-8 flex flex-col items-center justify-center">
            <div className="bg-green-900 p-4 rounded-full mb-4">
              <svg className="h-8 w-8 text-green-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-green-400">Payment Successful!</h3>
            <p className="text-gray-400 text-center mt-2">
              Your payment of ₹{challan.fineAmount} has been processed.
              <br />A receipt has been sent to your email.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
