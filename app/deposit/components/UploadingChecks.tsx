'use client'

import { useState } from 'react'
import {
  Box,
  ButtonGroup,
  Button,
  Heading,
  Flex,
  FormControl,
  Stack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react'

import { useToast } from '@chakra-ui/react'

const Form1 = () => {
  return (
    <>
      <Heading w="100%" textAlign={'center'} fontWeight="semibold" mb="2%" padding={10}>
        Deposit a check
      </Heading>
      <FormControl>
        {/* <FormLabel>Choose an account</FormLabel> */}
        <Menu>
          <MenuButton as={Button}>
            Select account to deposit check to
          </MenuButton>
          <MenuList>
            <MenuItem>Savings Account (...1827)</MenuItem>
            <MenuItem>Checking Account (...9382)</MenuItem>
          </MenuList>
        </Menu>
      </FormControl>
    </>
  )
}

const Form2 = () => {
  return (
    <>
    <Stack>
      <Heading w="100%" textAlign={'center'} fontWeight="semibold" mb="2%" padding={10}>
        Enter deposit amount
      </Heading>
      <NumberInput 
        defaultValue={0.00} 
        precision={2} 
        step={0.2}
        max={1000.00}
        keepWithinRange={false}
        clampValueOnBlur={false}>
        <NumberInputField />
      </NumberInput>
    </Stack>
    </>
  )
}

const Form3 = () => {
  const [show, setShow] = useState(false)
  // const handleClick = () => setShow(!show)
  return (
    <>
      <Heading w="100%" textAlign={'center'} fontWeight="semibold" mb="2%" padding={10}>
        Upload photos
      </Heading>
      <Box flexDirection={'row'}>
        <Box padding={'5'}>
          <p>Front of check:</p>
          <form action="action_page.php">
            <input type="file" id="checkPhoto" name="checkPhotoName"/>
          </form>
        </Box>
        <Box padding={'5'}>
        <p>Back of check:</p>
          <form action="action_page.php">
            <input type="file" id="checkPhoto" name="checkPhotoName"/>
            {/* <Button>
              <input type="submit"/>
            </Button> */}
          </form>
        </Box>
      </Box>
    </>
  )
}

export default function Multistep() {
  const toast = useToast()
  const [step, setStep] = useState(1)


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
        {step === 1 ? <Form1 /> : step === 2 ? <Form2 /> : <Form3 />}
        <ButtonGroup mt="5%" w="100%">
          <Flex w="100%" justifyContent="space-between">
            <Flex>
              <Button
                onClick={() => {
                  setStep(step - 1)
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
                    description: "Your check has been deposited.",
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                  })
                }}>
                Upload
              </Button>
            ) : null}
          </Flex>
        </ButtonGroup>
      </Box>
    </>
  )
}
