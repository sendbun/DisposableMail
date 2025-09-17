import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
// Moved providers and layout content into locale layout

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TempMail - Temporary Email Service",
  description: "Generate temporary email addresses for privacy and security",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  )
}