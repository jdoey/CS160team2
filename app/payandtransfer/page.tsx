'use client'
import {
    Box,
    Flex,
    Button,
    Menu, 
    MenuButton, 
    MenuItem,
    MenuList,
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
    Stack
  } from '@chakra-ui/react'

import EmployeeSidebar from '../components/EmployeeSidebar'
import ExternalTransferForm from '../components/ExternalTransferForm'


export default function Page() {
  const toast = useToast()
  return (
    <>
      <EmployeeSidebar/>
      <Box ml={{ base: 0, md: 60 }} paddingTop={0} paddingLeft={4}>
        <Tabs position="relative" variant="unstyled">
          <TabList>
            <Tab>Internal</Tab>
            <Tab>External</Tab>
            <Tab>Recipients</Tab>
          </TabList>
          <TabIndicator
            mt="-1.5px"
            height="2px"
            bg="red.500"
            borderRadius="1px"
          />
          <TabPanels>

            <TabPanel>
              <Flex>
                <Select placeholder='Transfer from:' padding='1'>
                  <option value='option1'>Option 1</option>
                  <option value='option2'>Option 2</option>
                  <option value='option3'>Option 3</option>
                </Select>
                <Select placeholder='Transfer to:'padding='1'>
                  <option value='option1'>Option 1</option>
                  <option value='option2'>Option 2</option>
                  <option value='option3'>Option 3</option>
                </Select>
              </Flex>

              <FormControl isRequired padding='1' paddingTop='5'>
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
              
            </TabPanel>

            <TabPanel>
              <ExternalTransferForm/>
            </TabPanel>

            <TabPanel>
              
              <Flex>
                <Select placeholder='Transfer from:' padding='1'>
                  <option value='option1'>Option 1</option>
                  <option value='option2'>Option 2</option>
                  <option value='option3'>Option 3</option>
                </Select>
              </Flex>

              <Stack padding='1'>
                <Select variant='filled' placeholder='Choose recipient:'>
                  <option value='option1'>Option 1</option>
                  <option value='option2'>Option 2</option>
                  <option value='option3'>Option 3</option>
                  <option value='option1'>Option 4</option>
                  <option value='option2'>Option 5</option>
                  <option value='option3'>Option 6</option>
                  <option value='option1'>Option 7</option>
                  <option value='option2'>Option 8</option>
                  <option value='option3'>Option 9</option>
                  <option value='option3'>Option 10</option>
                </Select>
              </Stack>

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
              
            </TabPanel>
          </TabPanels>
      </Tabs>
      </Box>
      
      {/* <Box ml={{ base: 0, md: 60 }} p="4">
        <Flex>
          <Flex flexDirection={'column'}>
            
            <Menu>
              <MenuButton minH='5' minW='10' as={Button} background='red.400' color='white'>
                To:
              </MenuButton>
              <MenuList>
                <MenuItem>Checking Account</MenuItem>
                <MenuItem>Savings Account</MenuItem>
                <MenuItem>Account 1</MenuItem>
                <MenuItem>Account 2</MenuItem>
              </MenuList>
            </Menu>
            
            <Menu>
              <MenuButton as={Button} background='red.400' color='white'>
                From:
              </MenuButton>
              <MenuList>
                  <MenuItem>Checking Account</MenuItem>
                  <MenuItem>Savings Account</MenuItem>
                  <MenuItem>Account 1</MenuItem>
                  <MenuItem>Account 2</MenuItem>
              </MenuList>
            </Menu>



          </Flex>
        
          <Flex flexDirection={'column'}>
            <Flex paddingTop={4} paddingLeft={6}>
                <ExternalTransferForm/>
            </Flex>
          </Flex>

        </Flex>
      </Box> */}
    </>
  )
}