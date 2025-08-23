import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'UI-TARS Workflow Hub',
  description: 'AI-Powered Workflow Automation Hub using UI-TARS',
  keywords: ['AI', 'automation', 'workflow', 'UI-TARS', 'desktop-automation'],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  openGraph: {
    title: 'UI-TARS Workflow Hub',
    description: 'AI-Powered Workflow Automation Hub using UI-TARS',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          {children}
        </div>
      </body>
    </html>
  )
}
