'use client'

import { useState } from 'react'
import {
  Progress,
  Box,
  ButtonGroup,
  Button,
  Heading,
  Flex,
  FormControl,
  GridItem,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
  InputLeftAddon,
  InputGroup,
  Textarea,
  FormHelperText,
  InputRightElement,
  Menu, MenuButton, MenuList, MenuItem, MenuGroup, MenuDivider
} from '@chakra-ui/react'

import { useToast } from '@chakra-ui/react'

const Form1 = () => {
  return (
    <>
      <Heading w="100%" textAlign={'center'} fontWeight="normal" mb="2%" padding={10}>
        Transfer to an External Account
      </Heading>
      <Flex>
        <FormControl mr="5%">
          <FormLabel htmlFor="account-name" fontWeight={'normal'}>
            Recipient Account Name
          </FormLabel>
          <Input id="account-name" placeholder="Account Name" />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="account-number" fontWeight={'normal'}>
            Recipient Account Number
          </FormLabel>
          <Input id="account-number" placeholder="Account Number" />
        </FormControl>
      </Flex>
    </>
  )
}

const Form2 = () => {
  return (
    <>
      <Heading w="100%" textAlign={'center'} fontWeight="normal" mb="2%" padding={10}>
        Recipient Information
      </Heading>
      <Flex>
        <FormControl mr="5%">
          {/* <FormLabel htmlFor="first-name" fontWeight={'normal'}>
            
          </FormLabel>
          <Input id="first-name" placeholder="First name" /> */}
        <Menu>
        <MenuButton as={Button} colorScheme='red.500' color='black'>
    Choose Account
  </MenuButton>
  <MenuList>
      <MenuItem>Checking Account</MenuItem>
      <MenuItem>Savings Account</MenuItem>
  </MenuList>
        </Menu>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="transfer-amount" fontWeight={'normal'}>
            Transfer amount
          </FormLabel>
          <Input id="transfer-amount" placeholder="0.00" />
        </FormControl>
      </Flex>
    </>
  )
}

const Form3 = () => {
    const [show, setShow] = useState(false)
  const handleClick = () => setShow(!show)
  return (
    <><Heading w="100%" textAlign={'center'} fontWeight="normal" mb="2%" padding={10}>
    Confirm your password
  </Heading>
  <Flex>
  <FormControl>
        <FormLabel htmlFor="password" fontWeight={'normal'} mt="2%">
          Password
        </FormLabel>
        <InputGroup size="md">
          <Input
            pr="4.5rem"
            type={show ? 'text' : 'password'}
            placeholder="Enter password"
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
  </Flex></>
  )
}

export default function Multistep() {
  const toast = useToast()
  const [step, setStep] = useState(1)
  const [progress, setProgress] = useState(33.33)

  return (
    <>
      <Box
        borderWidth="1px"
        rounded="lg"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
        maxWidth={800}
        p={6}
        m="10px auto"
        as="form">
        <Progress hasStripe value={progress} mb="5%" mx="5%" isAnimated></Progress>
        {step === 1 ? <Form1 /> : step === 2 ? <Form2 /> : <Form3 />}
        <ButtonGroup mt="5%" w="100%">
          <Flex w="100%" justifyContent="space-between">
            <Flex>
              <Button
                onClick={() => {
                  setStep(step - 1)
                  setProgress(progress - 33.33)
                }}
                isDisabled={step === 1}
                colorScheme="red"
                variant="solid"
                w="7rem"
                mr="5%">
                Back
              </Button>
              <Button
                w="7rem"
                isDisabled={step === 3}
                onClick={() => {
                  setStep(step + 1)
                  if (step === 3) {
                    setProgress(100)
                  } else {
                    setProgress(progress + 33.33)
                  }
                }}
                colorScheme="red"
                variant="outline">
                Next
              </Button>
            </Flex>
            {step === 3 ? (
              <Button
                w="7rem"
                colorScheme="red"
                variant="solid"
                onClick={() => {
                  toast({
                    title: 'Success',
                    description: "Your payment has been transferred.",
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                  })
                }}>
                Submit
              </Button>
            ) : null}
          </Flex>
        </ButtonGroup>
      </Box>
    </>
  )
}