import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'challan kategaa sabka',
  description: 'sabki kategi very soon',
  generator: 'satyanchal',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
