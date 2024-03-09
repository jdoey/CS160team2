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

export default function HeroSection() {
  return (
    <>
      <Flex
        w={'full'}
        h={'55vh'} 
        backgroundImage={'url(https://media-rockstargames-com.akamaized.net/tina-uploads/posts/ak73k92o47ko75/5de9d8bc4ffeabb209ec67ab3721ea281da5cd05.jpg)'}
        backgroundSize={'cover'}
        backgroundPosition={'center'}>
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
            We'll keep your money safe <br />
            <Text as={'span'} color={'#E1090A'}>
              ... probably.
            </Text>
          </Heading>
          {/* <Text color={'gray.500'}>
            Monetize your content by charging your most loyal readers and reward them
            loyalty points. Give back to your loyal readers by granting them access to
            your pre-releases and sneak-peaks.
          </Text> */}
          <Stack
            direction={'column'}
            spacing={3}
            align={'center'}
            alignSelf={'center'}
            position={'relative'}>
            <Button
              as={'a'}
              colorScheme={'red'}
              bg={'#E1090A'}
              rounded={'full'}
              px={6}
              href={'/enroll'}
              _hover={{
                bg: '#88090A',
              }}>
              Enroll Now
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </>
  )
}