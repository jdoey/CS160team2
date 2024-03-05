'use client'

import { ReactElement } from 'react'
import { Box, Center, SimpleGrid, Icon, Text, Stack, Flex, Heading, useColorModeValue } from '@chakra-ui/react'

import { 
    FaPiggyBank,
    FaMoneyCheck
} from "react-icons/fa";

interface FeatureProps {
  title: string
  icon: ReactElement
}

const Feature = ({ title, icon }: FeatureProps) => {
  return (
    <Stack align={'center'}>
      <Flex
        w={16}
        h={16}
        align={'center'}
        justify={'center'}
        color={'white'}
        rounded={'full'}
        bg={'gray.500'}
        mb={0}>
        {icon}
      </Flex>
      <Text fontWeight={600} fontSize={'xl'} color={'#E1090A'}>{title}</Text>
    </Stack>
  )
}

export default function Features() {
  return (
    <Center bg={useColorModeValue('white.100', 'gray.700')}>
    <Box p={8} bg={useColorModeValue('white.100', 'gray.700')} w={'50%'}>
        <Heading fontSize={{ base: '2xl', sm: '4xl' }} fontWeight={'bold'} textAlign={'center'} paddingBottom={6}>
            Choose what's right for you
        </Heading>
        <SimpleGrid textAlign={'center'} alignContent={'center'} columns={{ base: 1, md: 2 }} spacing={10}>
            <Feature
            icon={<Icon as={FaMoneyCheck} w={10} h={10} color={'white'}/>}
            title={'Checking'}
            />
            <Feature
            icon={<Icon as={FaPiggyBank} w={10} h={10} color={'white'}/>}
            title={'Savings'}
            />
        </SimpleGrid>
    </Box>
    </Center>
  )
}

