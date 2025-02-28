// services/db-service.ts
import { v4 as uuidv4 } from 'uuid'
import type { ChallanDetails } from '../types'

// Using JSONBin.io as our storage service
const JSON_BIN_URL = "https://api.jsonbin.io/v3/b"
const JSON_BIN_SECRET = "$2a$10$HvH52PJhc/NaOFzIp7tMn.2arKlpjRfFwFzJou5DvGmm3v3hCDe7W" // Set this in your .env
const BIN_ID = "67c1ca0ae41b4d34e49e5c94 " // Set this in your .env or create one

// Initial data with sample records
const initialData: ChallanDetails[] = [
  {
    id: "c1",
    name: "Rahul Kumar",
    plateNumber: "MH01AB1234",
    vehicleType: "Car",
    violation: "Overspeeding",
    fineAmount: 1000,
    date: "2024-02-24",
    location: "Western Express Highway",
    status: "Unpaid"
  },
  {
    id: "c2",
    name: "Rahul Kumar",
    plateNumber: "MH01AB1234",
    vehicleType: "Car",
    violation: "Illegal Parking",
    fineAmount: 500,
    date: "2024-02-15",
    location: "Andheri East",
    status: "Paid"
  },
  {
    id: "c3",
    name: "Rahul Kumar",
    plateNumber: "MH01AB1234",
    vehicleType: "Car",
    violation: "Red Light Violation",
    fineAmount: 700,
    date: "2024-01-28",
    location: "Dadar Signal",
    status: "Paid"
  },
  {
    id: "c4",
    name: "Priya Singh",
    plateNumber: "MH02CD5678",
    vehicleType: "Car",
    violation: "Red Light Violation",
    fineAmount: 500,
    date: "2024-02-24",
    location: "Juhu Circle",
    status: "Unpaid"
  }
]

// Fallback to local storage if JSONBin cannot be accessed
let localCache: ChallanDetails[] = [...initialData]

// Initialize database
export async function initializeDb() {
  try {
    // Try to fetch the existing data first
    const response = await fetch(`${JSON_BIN_URL}/${BIN_ID}/latest`, {
      headers: {
        'X-Master-Key': JSON_BIN_SECRET
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      return data.record
    }
    
    // If bin doesn't exist or is empty, create a new one with initial data
    const createResponse = await fetch(JSON_BIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSON_BIN_SECRET,
        'X-Bin-Private': 'false'
      },
      body: JSON.stringify(initialData)
    })
    
    if (createResponse.ok) {
      const createData = await createResponse.json()
      console.log('Created new JSONBin:', createData)
      return initialData
    }
    
    throw new Error('Failed to initialize database')
  } catch (error) {
    console.error('Error initializing database:', error)
    return localCache
  }
}

// Get all challans
export async function getAllChallans(): Promise<ChallanDetails[]> {
  try {
    const response = await fetch(`${JSON_BIN_URL}/${BIN_ID}/latest`, {
      headers: {
        'X-Master-Key': JSON_BIN_SECRET
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      localCache = data.record
      return data.record
    }
    
    throw new Error('Failed to fetch challans')
  } catch (error) {
    console.error('Error fetching challans:', error)
    return localCache
  }
}

// Get challans by plate number
export async function getChallansByPlate(plateNumber: string): Promise<ChallanDetails[]> {
  try {
    const allChallans = await getAllChallans()
    return allChallans.filter(challan => 
      challan.plateNumber.toLowerCase() === plateNumber.toLowerCase()
    )
  } catch (error) {
    console.error('Error fetching challans by plate:', error)
    return localCache.filter(challan => 
      challan.plateNumber.toLowerCase() === plateNumber.toLowerCase()
    )
  }
}

// Add new challan
export async function addChallan(challan: ChallanDetails): Promise<ChallanDetails> {
  try {
    // Get current data
    const allChallans = await getAllChallans()
    
    // Add new challan with unique ID
    const newChallan: ChallanDetails = {
      ...challan,
      id: uuidv4(),
      status: "Unpaid"
    }
    
    const updatedChallans = [...allChallans, newChallan]
    
    // Update the database
    const response = await fetch(`${JSON_BIN_URL}/${BIN_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSON_BIN_SECRET
      },
      body: JSON.stringify(updatedChallans)
    })
    
    if (response.ok) {
      localCache = updatedChallans
      return newChallan
    }
    
    throw new Error('Failed to add challan')
  } catch (error) {
    console.error('Error adding challan:', error)
    
    // Fallback to local cache if API fails
    const newChallan: ChallanDetails = {
      ...challan,
      id: uuidv4(),
      status: "Unpaid"
    }
    
    localCache = [...localCache, newChallan]
    return newChallan
  }
}

// Update challan status
export async function updateChallanStatus(challanId: string, status: "Paid" | "Unpaid"): Promise<ChallanDetails | null> {
  try {
    // Get current data
    const allChallans = await getAllChallans()
    
    // Find and update the specific challan
    const updatedChallans = allChallans.map(challan => {
      if (challan.id === challanId) {
        return { ...challan, status }
      }
      return challan
    })
    
    // Update the database
    const response = await fetch(`${JSON_BIN_URL}/${BIN_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSON_BIN_SECRET
      },
      body: JSON.stringify(updatedChallans)
    })
    
    if (response.ok) {
      localCache = updatedChallans
      return updatedChallans.find(challan => challan.id === challanId) || null
    }
    
    throw new Error('Failed to update challan status')
  } catch (error) {
    console.error('Error updating challan:', error)
    
    // Fallback to local cache if API fails
    localCache = localCache.map(challan => {
      if (challan.id === challanId) {
        return { ...challan, status }
      }
      return challan
    })
    
    return localCache.find(challan => challan.id === challanId) || null
  }
}
