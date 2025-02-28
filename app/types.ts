export interface ChallanDetails {
  name: string
  plateNumber: string
  vehicleType: string
  violation: string
  fineAmount: number
  date: string
  image?: string
  location?: string
  remarks?: string
  status?: "Paid" | "Unpaid"
}
