import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { image } = await request.json()
    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 })
    }


    const base64Data = image.replace(/^data:image\/\w+;base64,/, "")
    
    const buffer = Buffer.from(base64Data, "base64")


    const blob = new Blob([buffer], { type: "image/jpeg" })


    const formData = new FormData()
    formData.append("file", blob, "upload.jpg")

    const response = await fetch("https://jaided.ai/api/ocr", {
      method: "POST",
      headers: {
        "username": "huehue",
        "apikey": "nDNf4RfrwvgG1pb4q5EmgQWjvyigR41T",
      },
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("OCR API error:", errorData)
      return NextResponse.json({ error: "Failed to process image" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("OCR Error:", error)
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 })
  }
}
