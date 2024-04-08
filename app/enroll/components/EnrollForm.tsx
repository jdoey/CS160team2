'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from "yup";
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
  InputGroup,
  InputRightElement,
  useColorModeValue,
  FormErrorMessage,
  useToast
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'

const form1ValidationSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Required'),
  username: Yup.string()
    .min(6, 'Too Short: Must be 6 to 20 characters')
    .max(20, 'Too Long: Must be 6 to 20 characters')
    .required('Required'),
  password: Yup.string()
    .min(6, 'Too Short: Must be 6 to 20 characters')
    .max(20, 'Too Long: Must be 6 to 20 characters')
    .required('Required'),
})

const form2ValidationSchema = Yup.object({
  firstName: Yup.string().required('Required'),
  lastName: Yup.string().required('Required'),
  dob: Yup.string()
    .matches(
      /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d{2}$/,
      'Date of birth must be in the format MM/DD/YYYY'
    )
    .required('Required')
})

const form3ValidationSchema = Yup.object({
  country: Yup.string().required('Required'),
  street: Yup.string().required('Required'),
  city: Yup.string().required('Required'),
  state: Yup.string().required('Required'),
  zip: Yup.string().required('Required'),
})

const Form1 = (props : any) => {
  const [showPassword, setShowPassword] = useState(false)
  
  const handleSubmit = (values : any) => {
    props.next(values)
  }

  return (
    <>
      <Heading w="100%" textAlign={'center'} mb="5%" fontSize={"3xl"}>
        Let's set up your online access
      </Heading>
      <Formik
        initialValues={{
          email: props.data.email,
          username: props.data.username,
          password: props.data.password
        }}
        validationSchema={form1ValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            <FormControl mt="5%" isRequired isInvalid={!!errors.email && !!touched.email}>
              <FormLabel htmlFor="email" fontWeight={'normal'}>Email address</FormLabel>
              <Field as={Input} id='email' name='email' type='email' placeholder='maze@mazebank.com' />
              <ErrorMessage name="email" component={FormErrorMessage} />
            </FormControl>
            <FormControl mt="4%" isRequired isInvalid={!!errors.username && !!touched.username}>
              <FormLabel htmlFor="username" fontWeight={'normal'} mt="2%">Username</FormLabel>
              <Field as={Input} id='username' name='username' type='username' placeholder='Enter username'/>
              <ErrorMessage name="username" component={FormErrorMessage} />
            </FormControl>
            <FormControl isRequired isInvalid={!!errors.password && !!touched.password}>
              <FormLabel htmlFor="password" fontWeight={'normal'} mt="2%">Password</FormLabel>
              <InputGroup size="md">
                <Field
                  as={Input}
                  id="password"
                  name="password"
                  pr="4.5rem"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                />
                <InputRightElement width="4.5rem">
                  <Button
                      variant={'ghost'}
                      onClick={() => setShowPassword((showPassword) => !showPassword)}>
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <ErrorMessage name="password" component={FormErrorMessage} />
            </FormControl>
            <ButtonGroup mt="5%" w="100%">
              <Flex w="100%" justifyContent="space-between">
                <Flex>
                  <Button
                    isDisabled
                    colorScheme="blackAlpha"
                    variant="solid"
                    w="7rem"
                    mr="5%">
                    Back
                  </Button>
                  <Button
                    type='submit'
                    w="7rem"
                    colorScheme="red"
                    variant="outline">
                    Next
                  </Button>
                </Flex>
              </Flex>
            </ButtonGroup>
          </Form>
        )}
      </Formik>
    </>
  )
}

const Form2 = (props : any) => {

  const handleSubmit = (values : any) => {
    props.next(values)
  }

  return (
    <>
      <Heading w="100%" textAlign={'center'} fontWeight="normal" fontSize={"3xl"} mb="5%">
        Personal Information
      </Heading>

    <Formik
      initialValues={props.data}
      validationSchema={form2ValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched }) => (
        <Form>
          <Flex>
            <FormControl mr="5%" isRequired isInvalid={!!errors.firstName && !!touched.firstName}>
              <FormLabel htmlFor="firstName" fontWeight={'normal'}>First name</FormLabel>
              <Field as={Input} id='firstName' name='firstName' type='firstName' placeholder='First Name'/>
              <ErrorMessage name="firstName" component={FormErrorMessage} />
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.lastName && !!touched.lastName}>
              <FormLabel htmlFor="lastName" fontWeight={'normal'}>Last name</FormLabel>
              <Field as={Input} id='lastName' name='lastName' type='lastName' placeholder='Last Name'/>
              <ErrorMessage name="lastName" component={FormErrorMessage} />
            </FormControl>
          </Flex>
          
          <FormControl mt="4%" isRequired isInvalid={!!errors.dob && !!touched.dob}>
            <FormLabel htmlFor="dob" fontWeight={'normal'}>Date of Birth</FormLabel>
            <Field as={Input} id='dob' name='dob' type='dob' placeholder='MM/DD/YYYY'/>
            <ErrorMessage name="dob" component={FormErrorMessage} />
          </FormControl>
          <ButtonGroup mt="5%" w="100%">
            <Flex w="100%" justifyContent="space-between">
              <Flex>
                <Button
                  onClick={() => props.prev(values)}
                  type="button"
                  colorScheme="blackAlpha"
                  variant="solid"
                  w="7rem"
                  mr="5%">
                  Back
                </Button>
                <Button
                  type='submit'
                  w="7rem"
                  colorScheme="red"
                  variant="outline">
                  Next
                </Button>
              </Flex>
            </Flex>
          </ButtonGroup>
        </Form>
      )}
      </Formik>
    </>
  )
}

const Form3 = (props : any) => {
  const handleSubmit = async (values : any) => {
    props.next(values, true)
  }

  return (
    <>
      <Heading w="100%" textAlign={'center'} fontWeight="normal" fontSize={"3xl"} mb="5%">
        Address
      </Heading>
      <Formik
        initialValues={props.data}
        validationSchema={form3ValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched }) => (
          <Form>
            <FormControl isRequired as={GridItem} colSpan={[6, 3]} isInvalid={!!errors.country && !!touched.country}>
              <FormLabel
                htmlFor="country"
                fontSize="sm"
                fontWeight="md"
                color="gray.700"
                _dark={{
                  color: 'gray.50',
                }}>
                Country / Region
              </FormLabel>
              <Field
                as={Select}
                id="country"
                name="country"
                autoComplete="country"
                placeholder="Select option"
                focusBorderColor="brand.400"
                shadow="sm"
                size="sm"
                w="full"
                rounded="md">
                <option>United States</option>
                <option>Canada</option>
                <option>Mexico</option>
              </Field>
              <ErrorMessage name="country" component={FormErrorMessage} />
            </FormControl>
            <FormControl isRequired as={GridItem} colSpan={6} isInvalid={!!errors.street && !!touched.street}>
              <FormLabel
                htmlFor="street"
                fontSize="sm"
                fontWeight="md"
                color="gray.700"
                _dark={{
                  color: 'gray.50',
                }}
                mt="2%">
                Street address
              </FormLabel>
              <Field
                as={Input}
                type="text"
                name="street"
                id="street"
                autoComplete="street"
                focusBorderColor="brand.400"
                shadow="sm"
                size="sm"
                w="full"
                rounded="md"
              />
              <ErrorMessage name="street" component={FormErrorMessage} />
            </FormControl>
            <FormControl isRequired as={GridItem} colSpan={[6, 6, null, 2]} isInvalid={!!errors.city && !!touched.city}>
              <FormLabel
                htmlFor="city"
                fontSize="sm"
                fontWeight="md"
                color="gray.700"
                _dark={{
                  color: 'gray.50',
                }}
                mt="2%">
                City
              </FormLabel>
              <Field
                as={Input}
                type="text"
                name="city"
                id="city"
                autoComplete="city"
                focusBorderColor="brand.400"
                shadow="sm"
                size="sm"
                w="full"
                rounded="md"
              />
              <ErrorMessage name="city" component={FormErrorMessage} />
            </FormControl>
            <FormControl isRequired as={GridItem} colSpan={[6, 3, null, 2]} isInvalid={!!errors.state && !!touched.state}>
              <FormLabel
                htmlFor="state"
                fontSize="sm"
                fontWeight="md"
                color="gray.700"
                _dark={{
                  color: 'gray.50',
                }}
                mt="2%">
                State / Province
              </FormLabel>
              <Field
                as={Input}
                type="text"
                name="state"
                id="state"
                autoComplete="state"
                focusBorderColor="brand.400"
                shadow="sm"
                size="sm"
                w="full"
                rounded="md"
              />
              <ErrorMessage name="state" component={FormErrorMessage} />
            </FormControl>
            <FormControl isRequired  as={GridItem} colSpan={[6, 3, null, 2]} isInvalid={!!errors.zip && !!touched.zip}>
              <FormLabel
                htmlFor="zip"
                fontSize="sm"
                fontWeight="md"
                color="gray.700"
                _dark={{
                  color: 'gray.50',
                }}
                mt="2%">
                ZIP / Postal
              </FormLabel>
              <Field
                as={Input}
                type="text"
                name="zip"
                id="zip"
                autoComplete="zip"
                focusBorderColor="brand.400"
                shadow="sm"
                size="sm"
                w="full"
                rounded="md"
              />
              <ErrorMessage name="zip" component={FormErrorMessage} />
            </FormControl>
            <ButtonGroup mt="5%" w="100%">
              <Flex w="100%" justifyContent="space-between">
                <Flex>
                  <Button
                    onClick={() => props.prev(values)}
                    type="button"
                    colorScheme="blackAlpha"
                    variant="solid"
                    w="7rem"
                    mr="5%">
                    Back
                  </Button>
                </Flex>
                <Button
                  type='submit'
                  w="7rem"
                  colorScheme="red"
                  variant="solid"
                  isLoading={props.loading}
                >
                  Submit
                </Button>
              </Flex>
            </ButtonGroup>
          </Form>
        )}
      </Formik>
    </>
  )
}

export default function Multistep() {
  const router = useRouter();
  const toast = useToast()
  const [step, setStep] = useState(0)
  const [progress, setProgress] = useState(33.33)
  const [loading, setLoading] = useState(false);
  
  const [data, setData] = useState({
    email: 'email@email.com',
    username: '',
    password: '123456',
    firstName: 'firstname',
    lastName: 'lastname',
    dob: '02/02/2002',
    country: 'United States',
    street: '1000 Ok Drive',
    city: 'San Jose',
    state: 'California',
    zip: '95035',
  })

  const makeRequest = async (formData : any) => {
    setLoading(true);
    // console.log("Form submitted", formData)

    try {
      const response = await fetch('/api/customer/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
      });
      const data = await response.json();
      
      if (data.isSuccess == true) {
        setLoading(false);
        toast({
          title: data.message,
          description: "Please sign in.",
          status: 'success',
          duration: 2000,
          isClosable: true,
        })
        
        setTimeout(() => {
          router.push('/');
        }, 500);

      } else {
        setLoading(false);
        toast({
          title: data.message,
          description: "Please try again.",
          status: 'error',
          duration: 2000,
          isClosable: true,
        })
      }

    } catch (error) {
      setLoading(false);
      console.error('Error creating account:', error);

      toast({
        title: 'User account creation failed!',
        description: "Please try again later.",
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
    }
  }

  const handleNextStep = (newData : any, final = false) => {
    setData((prev) => ({...prev, ...newData}))

    if (final) {
      makeRequest(newData);
      return
    }

    setStep((prev) => prev + 1)
    if (step === 3) {
      setProgress(100)
    } else {
      setProgress((prev) => prev + 33.33)
    }
  }

  const handlePrevStep = (newData : any) => {
    setData((prev) => ({...prev, ...newData}))
    setStep((prev) => prev - 1)
    setProgress((prev) => prev - 33.33)
  }

  const steps = [
    <Form1 next={handleNextStep} data={data}/>,
    <Form2 next={handleNextStep} prev={handlePrevStep} data={data}/>,
    <Form3 prev={handlePrevStep} next={handleNextStep} data={data} loading={loading}/>
  ]

  console.log("data", data);

  return (
    <>
      <Box
        bg={useColorModeValue('gray.50', 'gray.800')}
        py={10}
        minH={'100vh'}
        >
        <Box
          bg={"#FFFFFF"}
          borderWidth="1px"
          rounded="lg"
          shadow="1px 1px 3px rgba(0,0,0,0.3)"
          maxWidth={500}
          p={6}
          m="10px auto">
          <Progress hasStripe value={progress} colorScheme='red' mb="5%" mx="5%" isAnimated></Progress>
          {steps[step]}
        </Box>
      </Box>
    </>
  )
}