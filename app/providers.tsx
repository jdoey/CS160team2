'use client'

import { ChakraProvider } from '@chakra-ui/react'
import Navbar from './components/Navbar'

export function Providers({ children }: { children: React.ReactNode }) {
  return <ChakraProvider>
        <Navbar/>
        {children}
    </ChakraProvider>
}