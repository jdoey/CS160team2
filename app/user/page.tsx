'use client'

import {
    Box,
    Flex,
    Button,
    Heading,
    Stack
  } from '@chakra-ui/react'


import Sidebar from '../components/Sidebar'
import AccountCard from './components/AccountCard'
import TransactionHistory from './components/TransactionHistory'
import Navbar from '../components/Navbar'


export default function Page() {
  return (
    <>
      <Navbar/>
      <Sidebar/>
      <Box ml={{ base: 0, md: 60 }} p="4">
        <Flex>
          <Flex flexDirection={'column'} paddingLeft={4} >
            <Heading paddingBottom={5}>Bank Accounts</Heading>
            <Stack>
            <AccountCard/>
            <AccountCard/>
            </Stack>
            <Button colorScheme='red'>Add Account</Button>
          </Flex>
          <Flex paddingLeft={10} flexDirection={'column'}>
            <Heading paddingBottom={5} >Recent Transaction History</Heading>
            <Flex>
              <TransactionHistory/>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </>
  )
}
