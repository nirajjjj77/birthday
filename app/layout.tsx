import type React from "react"
import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Happy Birthday Wish",
  description: "A special birthday surprise",
}

import { Analytics } from '@vercel/analytics/next';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body style={{ minHeight: '100vh', paddingTop: 'env(safe-area-inset-top)' }}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

