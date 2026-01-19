import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Paul Falor | Technology Executive & Security Leader',
  description: 'Technology executive with 20+ years of experience leading digital transformation, cybersecurity, and AI initiatives across global enterprises.',
  keywords: ['CIO', 'CISO', 'Technology Executive', 'Cybersecurity', 'Digital Transformation', 'AI'],
  authors: [{ name: 'Paul Falor' }],
  openGraph: {
    title: 'Paul Falor | Technology Executive & Security Leader',
    description: 'Technology executive with 20+ years of experience leading digital transformation, cybersecurity, and AI initiatives.',
    url: 'https://paulfalor.com',
    siteName: 'Paul Falor',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Paul Falor | Technology Executive & Security Leader',
    description: 'Technology executive with 20+ years of experience leading digital transformation, cybersecurity, and AI initiatives.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
