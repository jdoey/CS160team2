import Head from 'next/head'
import React from 'react';
import {
  Box,
  Heading,
  Text,
  Stack,
  Flex,
} from '@chakra-ui/react'

export default function AtmLoc() {
    return (
      <>
      <Flex
        w={'full'}
        h={'65vh'} 
        backgroundSize={'cover'}
        backgroundRepeat={'no-repeat'}
        backgroundPosition={'center'}
        backgroundImage={'url(https://www.hustlermoneyblog.com/wp-content/uploads/2019/05/Chase-ATMs.jpg)'}
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
            color={'#E1090A'}
            fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
            lineHeight={'90%'}>
            Atm Locations <br />
            <Text as={'span'} color={'#E1090A'} fontSize={{base: '2xs', sm: 'sm', md: 'xl'}}>
              Partnered with chase
            </Text>
            
          </Heading>
        </Stack>
      </Flex>
    </>
    )
  }