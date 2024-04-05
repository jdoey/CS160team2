'use client'
import {
    Box, 
    Flex, 
    Button,
    Tab, 
    TabIndicator, 
    TabList,
    Tabs, 
    TabPanels, 
    TabPanel,
    Select,
    FormControl, 
    FormLabel, 
    Input,
    useToast,
    Table, 
    TableContainer, 
    Tr, Th, Td, 
    Thead, 
    Tbody,
    Stack
  } from '@chakra-ui/react'

import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure
  } from '@chakra-ui/react'

import React from 'react'

import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import ExternalTransferForm from './components/ExternalTransferForm'


export default function Page() {
  const toast = useToast()
  return (
    <>
      <Navbar/>
      <Sidebar/>
      <Box ml={{ base: 0, md: 60 }} paddingTop={0} paddingLeft={8}>
        <Tabs position="relative" variant="unstyled">
          <TabList>
            <Tab>Payments</Tab>
            <Tab>Transfer Money</Tab>
          </TabList>
          <TabIndicator
            mt="-1.5px"
            height="2px"
            bg="red.500"
            borderRadius="1px"
          />
          <TabPanels>

            <TabPanel>
              <Tabs variant='enclosed' colorScheme='red'>
                <TabList>
                  <Tab>Pay</Tab>
                  <Tab>Payment History</Tab>
                </TabList>
                <TabPanels>

                  <TabPanel>
                    <FormControl>
                      <FormLabel>Search for a recipient</FormLabel>
                      <Input type='Recipient'/>
                    </FormControl>

                  </TabPanel>

                  <TabPanel>
                    <TableContainer>
                      <Table size='sm'>
                        <Thead>
                          <Tr>
                            <Th>From</Th>
                            <Th>Recipient</Th>
                            <Th>Date</Th>
                            <Th isNumeric>Amount</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          <Tr>
                            <Td>Checking Account</Td>
                            <Td>Bank</Td>
                            <Td>March 12, 2024</Td>
                            <Td isNumeric>$25.46</Td>
                          </Tr>
                          <Tr>
                            <Td>Savings Account</Td>
                            <Td>External Bank Account</Td>
                            <Td>March 8, 2024</Td>
                            <Td isNumeric>$90.00</Td>
                          </Tr>
                          <Tr>
                            <Td>Checking Account</Td>
                            <Td>Bank</Td>
                            <Td>February 28, 2024</Td>
                            <Td isNumeric>$167.12</Td>
                          </Tr>
                          <Tr>
                            <Td>Checking Account</Td>
                            <Td>Bank</Td>
                            <Td>February 19, 2024</Td>
                            <Td isNumeric>$58.91</Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </TabPanel>

                </TabPanels>
              </Tabs>
              
            </TabPanel>

            <TabPanel>
              <Tabs variant='enclosed' colorScheme='red'>
                <TabList>
                  <Tab>Transfer</Tab>
                  <Tab>Add External Account</Tab>
                </TabList>
                  
                <TabPanels>
                  <TabPanel>
                    <Stack>
                      <Flex>
                        <Select placeholder='Transfer from:' padding='1' paddingTop='5'>
                          <option value='option1'>Option 1</option>
                          <option value='option2'>Option 2</option>
                          <option value='option3'>Option 3</option>
                        </Select>
                        <Select placeholder='Transfer to:'padding='1' paddingTop='5'>
                          <option value='option1'>Option 1</option>
                          <option value='option2'>Option 2</option>
                          <option value='option3'>Option 3</option>
                        </Select>
                      </Flex>

                      <FormControl isRequired padding='1' paddingTop='5' paddingBottom={5}>
                        <FormLabel>Amount</FormLabel>
                        <Input placeholder='$0.00' />
                      </FormControl>

                      <Button background='red.500' color='white'
                        onClick={() => {
                        toast({
                          title: 'Success',
                          description: "Your payment has been transferred.",
                          status: 'success',
                          duration: 3000,
                          isClosable: true,
                        })
                      }}>Transfer</Button>
                    </Stack>
                  </TabPanel>

                  <TabPanel>
                    <ExternalTransferForm/>
                  </TabPanel>


                </TabPanels>
              </Tabs>
            </TabPanel>

          </TabPanels>
      </Tabs>
      </Box>
    </>
  )
}

