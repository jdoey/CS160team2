'use client'

import Head from 'next/head'
import React, { useEffect } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
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
        backgroundSize={'cover'}
        backgroundPosition={'center'}
        bg={'D3D3D3'}>
        <Stack
          as={Box}
          w={'full'}
          align={'center'}
          textAlign={'center'}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 20, md: 36 }}>
          <Heading
            fontWeight={600}
            color={'#E1090A'}
            fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
            lineHeight={'110%'}>
            Atm Locations
          </Heading>
        </Stack>
      </Flex>
    </>
    )
  }