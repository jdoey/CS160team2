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
  FormLabel,
  Input,
  FormHelperText,
  Spinner,
  Stack,
  Divider
} from '@chakra-ui/react'

import { useToast } from '@chakra-ui/react'

const Form1 = () => {
  return (
    <>
      <Heading w="100%" textAlign={'center'} fontWeight="normal" mb="2%" padding={10}>
        Adding an External Account
      </Heading>
      <FormControl>
        <FormLabel>Choose Financial Institution</FormLabel>
        <Input type='bank'/>
        <FormHelperText>Sign into the financial institution you would like to link to your MazeBank Account.</FormHelperText>
      </FormControl>
    </>
  )
}

const Form2 = () => {
  return (
    <>
    <Stack>
      <Heading w="100%" textAlign={'center'} fontWeight="normal" mb="2%" padding={10}>
          Connecting you to your External Financial Institution
        </Heading>
        <Spinner
          thickness='4px'
          speed='0.65s'
          emptyColor='gray.200'
          color='red.500'
          size='xl'
        />
    </Stack>
    </>
  )
}

const Form3 = () => {
    const [show, setShow] = useState(false)
  const handleClick = () => setShow(!show)
  return (
    <>
      <Heading w="100%" textAlign={'center'} fontWeight="normal" mb="2%" padding={10}>
        Confirmation
      </Heading>
      <Stack>
      <a>Your accounts:</a>
      <Divider/>
      <a> Savings Account (...1827)</a>
      <a> Checking Account (...9382)</a>
      </Stack>
    </>
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
                    description: "Your external accounts have been added.",
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                  })
                }}>
                Connect
              </Button>
            ) : null}
          </Flex>
        </ButtonGroup>
      </Box>
    </>
  )
}
