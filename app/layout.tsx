import type { Metadata } from 'next'
import './globals.css'
import { Web3Provider } from '@/providers/Web3Provider'

export const metadata: Metadata = {
  title: 'Lido Earn | Cross-Chain Deposits via Across',
  description: 'Deposit into Lido Earn vaults from any chain, any asset. Powered by Across Protocol.',
  openGraph: {
    title: 'Lido Earn x Across Protocol',
    description: 'One-click cross-chain deposits into EarnETH and EarnUSD vaults from 22 chains.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  )
}
