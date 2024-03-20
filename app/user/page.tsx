'use client'
import {
    Box,
    Flex,
    Button,
    Heading
  } from '@chakra-ui/react'

import Sidebar from '../components/Sidebar'
import AccountCard from '../components/AccountCard'
import TransactionHistory from '../components/TransactionHistory'


export default function Page() {
  return (
    <>
      <Sidebar/>
      <Box ml={{ base: 0, md: 60 }} p="4">
        <Flex>
          <Flex flexDirection={'column'}>
            <AccountCard/>
            <AccountCard/>
            <Button width='500' alignContent={'center'}>Add Account</Button>
          </Flex>
          <Flex flexDirection={'column'}>
            <Heading paddingTop={2} paddingLeft={8}>Transaction History</Heading>
            <Flex paddingTop={4} paddingLeft={6}>
              <TransactionHistory/>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </>
  )
}
