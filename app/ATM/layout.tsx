import { Providers } from '../ATM/providers'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    
        <Providers>{children}</Providers>
     
  )
}