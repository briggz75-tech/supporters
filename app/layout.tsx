import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ToastProvider, ToastContainer } from '@/components/Toast'

export const metadata: Metadata = {
  title: 'Supporter Management Dashboard',
  description: 'Manage campaign supporters efficiently with our modern dashboard',
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">👥</text></svg>',
        type: 'image/svg+xml',
      },
    ],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ToastProvider>
          {children}
          <ToastContainer />
        </ToastProvider>
      </body>
    </html>
  )
}
