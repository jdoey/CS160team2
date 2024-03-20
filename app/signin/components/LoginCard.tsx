'use client'

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'

export default function SimpleCard() {
  return (
    
    <Flex
      minH={'100vh'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={10} px={6}>
        <Stack align={'center'}>
          {/* <Heading fontSize={'4xl'}>Sign in to your account</Heading> */}
          {/* <Text fontSize={'lg'} color={'gray.600'}></Text> */}
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          borderWidth="1px"
          shadow="1px 1px 3px rgba(0,0,0,0.3)"
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={5}>
          <Heading fontSize={'4xl'} mb={"5%"}>Sign in to your account</Heading>
            <FormControl id="username">
              <FormLabel>Username</FormLabel>
              <Input type="username" />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input type="password" />
            </FormControl>
            <Stack spacing={10}>
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'space-between'}>
                {/* <Checkbox>Remember me</Checkbox> */}
                <Text color={'blue.400'}>Forgot password?</Text>
              </Stack>
              <Stack spacing={2}>
                <Button
                    bg={'#E1090A'}
                    color={'white'}
                    _hover={{
                    bg: '#88090A',
                    }}>
                    Sign in
                </Button>
                <Button
                    as={'a'}
                    variant={'ghost'}
                    fontWeight={400}
                    href={'/enroll'}
                    >
                    Enroll
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}