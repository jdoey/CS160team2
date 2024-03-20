'use client'

import React from 'react'
import { Stack, Text, Button } from '@chakra-ui/react'
import { FcLock } from 'react-icons/fc'

export default function AccountCard() {
  return (

    <Stack p="4" boxShadow="lg" m="4" borderRadius="sm" width={500} height={130}>
      <Stack direction="row" alignItems="center">
        <Text fontWeight="semibold">Acount Name</Text>
      </Stack>
      <Stack direction={{ base: 'column', md: 'row' }} justifyContent="space-between">
        <Text fontSize={{ base: 'sm' }} textAlign={'left'} maxW={'4xl'}>
          Account Number
        </Text>
        <Stack>
          <Button colorScheme="red">View Details</Button>
        </Stack>
      </Stack>
    </Stack>
  )
}