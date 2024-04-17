"use client";
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
  Tr,
  Th,
  Td,
  Thead,
  Tbody,
  Stack,
  HStack,
  NumberInput,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";

import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from "@chakra-ui/react";

import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "../../components/Sidebar";
import ExternalTransferForm from "./components/ExternalTransferForm";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  fromAccount: Yup.string().required("Required"),
  toAccount: Yup.string().required("Required"),
  amount: Yup.string().required("Required"),
});

export default function Page() {
  const toast = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [accountsData, setAccountsData] = useState([]);
  const [transferData, setTransferData] = useState({
    fromAccount: "",
    toAccount: "",
    amount: "",
  });

  const format = (val: string) => `$` + val;
  const parse = (val: string) => val.replace(/^\$/, "");

  const handleSubmit = (values: any) => {
    setLoading(true);
    console.log(values);
    makeTransferRequest(values);
  };

  const makeTransferRequest = async (values: any) => {
    try {
      const response = await fetch("/api/transaction/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fromAccountNumber: values.fromAccount,
          toAccountNumber: values.toAccount,
          amount: values.amount,
        }),
      });
      const data = await response.json();
      if (data.isSuccess) {
        setLoading(false);
        router.push("/user");
        toast({
          title: data.message,
          description: `Transfer from Account#${values.fromAccount} to Account#${values.toAccount} successful!`,
          status: "success",
          duration: 10000,
          isClosable: true,
        });
      } else {
        toast({
          title: data.message,
          description: `Error: Transfer from Account#${values.fromAccount} to Account#${values.toAccount} failed. Please try again`,
          status: "error",
          duration: 10000,
          isClosable: true,
        });
      }
      setLoading(false);
    } catch (error) {
      console.error("Error making transfer", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch("/api/customer/getActiveAccounts", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch active accounts");
        }
        return response.json();
      })
      .then((data) => {
        setAccountsData(data.accounts);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  return (
    <>
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
              <Tabs variant="enclosed" colorScheme="red">
                <TabList>
                  <Tab>Pay</Tab>
                  <Tab>Payment History</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <FormControl>
                      <FormLabel>Enter a recipient</FormLabel>
                      <Input type="Recipient" />
                    </FormControl>
                  </TabPanel>

                  <TabPanel>
                    <TableContainer>
                      <Table size="sm">
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
              <Tabs variant="enclosed" colorScheme="red">
                <TabList>
                  <Tab>Internal Transfer</Tab>
                  <Tab>External Transfer</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel>
                    <Formik
                      initialValues={transferData}
                      validationSchema={validationSchema}
                      onSubmit={handleSubmit}
                    >
                      {({ values, errors, touched }) => (
                        <Form>
                          <Stack>
                            <HStack>
                              <FormControl isRequired id="fromAccount">
                                <FormLabel width={"100%"}>
                                  Transfer from:
                                </FormLabel>
                                <Field
                                  as={Select}
                                  id="fromAccount"
                                  name="fromAccount"
                                  width={"80%"}
                                  placeholder="From:"
                                >
                                  {accountsData?.map((item: any) => (
                                    <option
                                      key={item.accountNumber}
                                      value={item.accountNumber}
                                    >
                                      Maze Bank {item.accountType}{" "}
                                      {item.accountNumber}
                                    </option>
                                  ))}
                                </Field>
                              </FormControl>
                              <FormControl isRequired id="toAccount">
                                <FormLabel width={"100%"}>
                                  Transfer to:
                                </FormLabel>
                                <Field
                                  as={Select}
                                  id="toAccount"
                                  name="toAccount"
                                  width={"80%"}
                                  placeholder="To:"
                                >
                                  {accountsData?.map((item: any) => (
                                    <option
                                      key={item.accountNumber}
                                      value={item.accountNumber}
                                    >
                                      Maze Bank {item.accountType}{" "}
                                      {item.accountNumber}
                                    </option>
                                  ))}
                                </Field>
                              </FormControl>
                            </HStack>

                            <Field name="amount">
                              {({ field, form }: any) => (
                                <FormControl
                                  isRequired
                                  id="amount"
                                  width={"100%"}
                                  pt={2}
                                  pb={4}
                                >
                                  <FormLabel htmlFor="amount">Amount</FormLabel>
                                  <NumberInput
                                    id="amount"
                                    {...field}
                                    onChange={(valueString) =>
                                      form.setFieldValue(
                                        field.name,
                                        parse(valueString)
                                      )
                                    }
                                    value={format(field.value)}
                                    min={1}
                                  >
                                    <NumberInputField />
                                    <NumberInputStepper>
                                      <NumberIncrementStepper />
                                      <NumberDecrementStepper />
                                    </NumberInputStepper>
                                  </NumberInput>
                                </FormControl>
                              )}
                            </Field>

                            <Button
                              colorScheme="red"
                              color="white"
                              type="submit"
                              isLoading={loading}
                            >
                              Transfer
                            </Button>
                          </Stack>
                        </Form>
                      )}
                    </Formik>
                  </TabPanel>

                  <TabPanel>
                    <Formik
                      initialValues={transferData}
                      validationSchema={validationSchema}
                      onSubmit={handleSubmit}
                    >
                      {({ values, errors, touched }) => (
                        <Form>
                          <Stack>
                            <HStack>
                              <FormControl isRequired id="fromAccount">
                                <FormLabel width={"100%"}>
                                  Transfer from:
                                </FormLabel>
                                <Field
                                  as={Select}
                                  id="fromAccount"
                                  name="fromAccount"
                                  width={"80%"}
                                  placeholder="From:"
                                >
                                  {accountsData?.map((item: any) => (
                                    <option
                                      key={item.accountNumber}
                                      value={item.accountNumber}
                                    >
                                      Maze Bank {item.accountType}{" "}
                                      {item.accountNumber}
                                    </option>
                                  ))}
                                </Field>
                              </FormControl>
                              <Field name="toAccount">
                                {({ field, form }: any) => (
                                  <FormControl isRequired id="toAccount">
                                    <FormLabel htmlFor="toAccount">
                                      Transfer to:
                                    </FormLabel>
                                    <NumberInput
                                      id="amount"
                                      width={"80%"}
                                      {...field}
                                      onChange={(valueString) =>
                                        form.setFieldValue(
                                          field.name,
                                          valueString
                                        )
                                      }
                                      value={field.value}
                                    >
                                      <NumberInputField placeholder="To: AccountNumber" />
                                    </NumberInput>
                                  </FormControl>
                                )}
                              </Field>
                            </HStack>

                            <Field name="amount">
                              {({ field, form }: any) => (
                                <FormControl
                                  isRequired
                                  id="amount"
                                  width={"100%"}
                                  pt={2}
                                  pb={4}
                                >
                                  <FormLabel htmlFor="amount">Amount</FormLabel>
                                  <NumberInput
                                    id="amount"
                                    {...field}
                                    onChange={(valueString) =>
                                      form.setFieldValue(
                                        field.name,
                                        parse(valueString)
                                      )
                                    }
                                    value={format(field.value)}
                                    min={1}
                                  >
                                    <NumberInputField />
                                    <NumberInputStepper>
                                      <NumberIncrementStepper />
                                      <NumberDecrementStepper />
                                    </NumberInputStepper>
                                  </NumberInput>
                                </FormControl>
                              )}
                            </Field>

                            <Button
                              colorScheme="red"
                              color="white"
                              type="submit"
                              isLoading={loading}
                            >
                              Transfer
                            </Button>
                          </Stack>
                        </Form>
                      )}
                    </Formik>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </>
  );
}
