'use client'

import {
  Box,
  Flex,
  Heading,
  Text,
  Stack,
  Container,
  Avatar,
  useColorModeValue,
} from '@chakra-ui/react'

interface Props {
  children: React.ReactNode
}

const Testimonial = (props: Props) => {
  const { children } = props

  return <Box>{children}</Box>
}

const TestimonialContent = (props: Props) => {
  const { children } = props

  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      boxShadow={'lg'}
      p={8}
      rounded={'xl'}
      align={'center'}
      pos={'relative'}
      _after={{
        content: `""`,
        w: 0,
        h: 0,
        borderLeft: 'solid transparent',
        borderLeftWidth: 16,
        borderRight: 'solid transparent',
        borderRightWidth: 16,
        borderTop: 'solid',
        borderTopWidth: 16,
        borderTopColor: useColorModeValue('white', 'gray.800'),
        pos: 'absolute',
        bottom: '-16px',
        left: '50%',
        transform: 'translateX(-50%)',
      }}>
      {children}
    </Stack>
  )
}

const TestimonialHeading = (props: Props) => {
  const { children } = props

  return (
    <Heading as={'h3'} fontSize={'xl'}>
      {children}
    </Heading>
  )
}

const TestimonialText = (props: Props) => {
  const { children } = props

  return (
    <Text
      textAlign={'center'}
      color={useColorModeValue('gray.600', 'gray.400')}
      fontSize={'sm'}>
      {children}
    </Text>
  )
}

const TestimonialAvatar = ({
  src,
  name,
  title,
}: {
  src: string
  name: string
  title: string
}) => {
  return (
    <Flex align={'center'} mt={8} direction={'column'}>
      <Avatar src={src} mb={2} />
      <Stack spacing={-1} align={'center'}>
        <Text fontWeight={600}>{name}</Text>
        <Text fontSize={'sm'} color={useColorModeValue('gray.600', 'gray.400')}>
          {title}
        </Text>
      </Stack>
    </Flex>
  )
}

export default function TestimonialsSection() {
  return (
    <Box bg={useColorModeValue('white.100', 'gray.700')}>
      <Container maxW={'7xl'} py={4} as={Stack} spacing={12}>
        <Stack spacing={0} align={'center'}>
          <Heading>Hear from our Customers</Heading>
        </Stack>
        <Stack
          direction={{ base: 'column', md: 'row' }}
          spacing={{ base: 10, md: 4, lg: 10 }}>
          <Testimonial>
            <TestimonialContent>
              <TestimonialHeading>Fees</TestimonialHeading>
              <TestimonialText>
                I can't believe how much I've been nickel and dimed by this bank. Every 
                time I turn around, there's another fee waiting for me. It's like they're 
                playing a game to see how much money they can take from me without me noticing. Shameful!
              </TestimonialText>
            </TestimonialContent>
            <TestimonialAvatar
              src={
                'https://static.wikia.nocookie.net/gtawiki/images/a/a8/MichaelDeSanta-GTAVee.png'
              }
              name={'Michael De Santa'}
              title={'Former Bank Robber'}
            />
          </Testimonial>
          <Testimonial>
            <TestimonialContent>
              <TestimonialHeading>Intuitive Design</TestimonialHeading>
              <TestimonialText>
                I can't say enough about the seamless experience I've had using the banking app from Maze Bank.
                It's truly a game-changer in teh world of mobile banking. From the moment I began using it, I was
                impressed by its intuitive design and user-friendly interface.
              </TestimonialText>
            </TestimonialContent>
            <TestimonialAvatar
              src={
                'https://static.wikia.nocookie.net/gtawiki/images/d/d8/FranklinClinton-GTAVee.png'
              }
              name={'Franklin Clinton'}
              title={'Repossession Agent'}
            />
          </Testimonial>
          <Testimonial>
            <TestimonialContent>
              <TestimonialHeading>Customer Service</TestimonialHeading>
              <TestimonialText>
              "If you enjoy spending hours on hold waiting to speak to a representative who can't actually help you,
              then by all means, bank with this institution. Otherwise, do yourself a favor and find a bank that values
               your time and treats you like a human being."
              </TestimonialText>
            </TestimonialContent>
            <TestimonialAvatar
              src={'https://static.wikia.nocookie.net/gtawiki/images/1/1b/TrevorPhilips-GTAVe-InGame.png'}
              name={'Trevor Phillips'}
              title={'CEO of Trevor Phillips Industries'}
            />
          </Testimonial>
        </Stack>
      </Container>
    </Box>
  )
}