'use client'

import Head from 'next/head'
import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
  Flex,
  Icon,
  useColorModeValue,
  createIcon,
} from '@chakra-ui/react'

export default function AtmLoc() {
    return (
      <>
        <Flex
          w={'full'}
          h={'60vh'} 
          >
          <Stack
            as={Box}
            w={'full'}
            align={'center'}
            textAlign={'center'}
            spacing={{ base: 8, md: 14 }}
            py={{ base: 20, md: 36 }}>
            <Heading
              fontWeight={600}
              color={'#FFFFFF'}
              fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
              lineHeight={'110%'}>
              Atm Locations 
            </Heading>
          </Stack>
        </Flex>
      </>
    )
  }