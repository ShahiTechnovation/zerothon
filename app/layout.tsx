import type React from "react"
import type { Metadata } from "next"
import { Suspense } from "react"
import { Inter } from "next/font/google"
import { JetBrains_Mono } from "next/font/google"
import { Fira_Code } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AppWrapper } from "@/components/app-wrapper"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
})

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
  display: "swap",
})

export const metadata: Metadata = {
  title: "zerothon - Python to EVM Smart Contract Development",
  description:
    "Bridge the gap between Web2 and Web3 with zerothon - the ultimate Python-to-EVM smart contract development tool for Avalanche blockchain.",
  generator: "v0.app",
  keywords: ["Python", "Smart Contracts", "Avalanche", "EVM", "Web3", "Blockchain", "Development"],
  authors: [{ name: "zerothon Team" }],
  openGraph: {
    title: "zerothon - Python to EVM Smart Contract Development",
    description: "Bridge the gap between Web2 and Web3 with zerothon",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`font-sans ${inter.variable} ${jetbrainsMono.variable} ${firaCode.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AppWrapper>
            <Suspense fallback={null}>{children}</Suspense>
          </AppWrapper>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
