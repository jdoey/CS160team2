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
  IconButton,
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
  Checkbox,
  FormErrorMessage,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
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

const payValidationSchema = Yup.object({
  fromAccount: Yup.string().required("Required"),
  recipient: Yup.string().required("Required"),
  amount: Yup.string().required("Required"),
});

const autoPayValidationSchema = Yup.object({
  fromAccount: Yup.string().required("Required"),
  recipient: Yup.string().required("Required"),
  amount: Yup.string().required("Required"),
  frequency: Yup.string().required("Required"),
  payDate: Yup.string()
    .matches(
      /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/,
      "Pay date must be in the format MM/DD/YYYY and valid"
    )
    .required("Required"),
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
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [autoPayments, setAutoPayments] = useState([]);

  const format = (val: string) => `$` + val;
  const parse = (val: string) => val.replace(/^\$/, "");

  const handleSubmit = (values: any) => {
    setLoading(true);
    makeTransferRequest(values);
  };

  const handlePaySubmit = (values: any) => {
    setLoading(true);
    makePaymentRequest(values);
  };

  const handleAutoPaySubmit = (values: any) => {
    console.log(values);
    setLoading(true);
    makeAutoPaymentRequest(values);
  };

  const deleteAutoPaymentRequest = async (autoId: any) => {
    try {
      const response = await fetch("/api/transaction/deleteRecurringPayment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          autoId: autoId,
        }),
      });
      const data = await response.json();
      if (data.isSuccess) {
        makeGetAutoPaymentsRequest();
        setLoading(false);
        toast({
          title: data.message,
          description: `Automated Payment ID:${autoId} successfully deleted!`,
          status: "success",
          duration: 10000,
          isClosable: true,
        });
      } else {
        toast({
          title: data.message,
          description: `Error: Automated Payment ID:${autoId} failed to delete. Please try again`,
          status: "error",
          duration: 10000,
          isClosable: true,
        });
      }
      setLoading(false);
    } catch (error) {
      console.error("Error deleting automated payment", error);
      setLoading(false);
    }
  };

  const makeAutoPaymentRequest = async (values: any) => {
    try {
      const response = await fetch("/api/transaction/recurringPayment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountNumber: values.fromAccount,
          amount: values.amount,
          recipient: values.recipient,
          transactionType: "Payment-",
          paymentDate: values.payDate,
          frequency: values.frequency,
        }),
      });
      const data = await response.json();
      if (data.isSuccess) {
        setLoading(false);
        router.push("/user");
        toast({
          title: data.message,
          description: `Automated Payment from Account#${values.fromAccount} to ${values.recipient} successfully created!`,
          status: "success",
          duration: 10000,
          isClosable: true,
        });
      } else {
        toast({
          title: data.message,
          description: `Error: Automated Payment from Account#${values.fromAccount} to ${values.recipient} failed to setup. Please try again`,
          status: "error",
          duration: 10000,
          isClosable: true,
        });
      }
      setLoading(false);
    } catch (error) {
      console.error("Error creating automated payment", error);
      setLoading(false);
    }
  };

  const makePaymentRequest = async (values: any) => {
    try {
      const response = await fetch("/api/transaction/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountNumber: values.fromAccount,
          amount: values.amount,
          recipient: values.recipient,
        }),
      });
      const data = await response.json();
      if (data.isSuccess) {
        setLoading(false);
        router.push("/user");
        toast({
          title: data.message,
          description: `Payment from Account#${values.fromAccount} to ${values.recipient} successful!`,
          status: "success",
          duration: 10000,
          isClosable: true,
        });
      } else {
        toast({
          title: data.message,
          description: `Error: Payment from Account#${values.fromAccount} to ${values.recipient} failed. Please try again`,
          status: "error",
          duration: 10000,
          isClosable: true,
        });
      }
      setLoading(false);
    } catch (error) {
      console.error("Error making payment", error);
      setLoading(false);
    }
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

  const makeGetAutoPaymentsRequest = async () => {
    fetch("/api/customer/getAccountsAutoPaymentHistory", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch automated payments");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.autoPayments);
        setAutoPayments(data.autoPayments);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
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

  useEffect(() => {
    fetch("/api/customer/getAccountsPaymentHistory", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch payment history");
        }
        return response.json();
      })
      .then((data) => {
        setPaymentHistory(data.payments);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  useEffect(() => {
    makeGetAutoPaymentsRequest();
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
                  <Tab>Setup Automated Payments</Tab>
                  <Tab>Automated Payments</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <Formik
                      initialValues={{
                        fromAccount: "",
                        amount: "",
                        recipient: "",
                      }}
                      validationSchema={payValidationSchema}
                      onSubmit={handlePaySubmit}
                    >
                      {({ values, errors, touched }) => (
                        <Form>
                          <Stack>
                            <FormControl isRequired pb={2}>
                              <FormLabel>Enter recipient name:</FormLabel>
                              <Field
                                as={Input}
                                id="recipient"
                                name="recipient"
                              />
                            </FormControl>
                            <FormControl isRequired id="fromAccount">
                              <FormLabel width={"100%"}>
                                Source Account:
                              </FormLabel>
                              <Field
                                as={Select}
                                id="fromAccount"
                                name="fromAccount"
                                width={"100%"}
                                placeholder="Source bank account:"
                              >
                                {accountsData?.map((item: any) => (
                                  <option
                                    key={item.accountNumber}
                                    value={item.accountNumber}
                                  >
                                    Maze Bank {item.accountType}{" "}
                                    {item.accountNumber}: ${item.balance}
                                  </option>
                                ))}
                              </Field>
                            </FormControl>

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
                              Pay
                            </Button>
                          </Stack>
                        </Form>
                      )}
                    </Formik>
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
                        <Tbody maxHeight="68vh" overflowY="auto">
                          {paymentHistory?.map((item: any) => (
                            <Tr key={item.transactionId}>
                              <Td>
                                Maze Bank {item.accountType}{" "}
                                {item.accountNumber}
                              </Td>
                              <Td>{item.recipient}</Td>
                              <Td>
                                {new Date(item.date).toLocaleString("en-US")}
                              </Td>
                              <Td isNumeric>
                                $
                                {item.amount.toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                })}
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </TabPanel>

                  <TabPanel>
                    <Formik
                      initialValues={{
                        fromAccount: "",
                        amount: "",
                        recipient: "",
                        payDate: "",
                        frequency: "",
                      }}
                      validationSchema={autoPayValidationSchema}
                      onSubmit={handleAutoPaySubmit}
                    >
                      {({ values, errors, touched }) => (
                        <Form>
                          <Stack>
                            <FormControl isRequired pb={2}>
                              <FormLabel>Enter recipient name:</FormLabel>
                              <Field
                                as={Input}
                                id="recipient"
                                name="recipient"
                              />
                            </FormControl>
                            <FormControl isRequired id="fromAccount">
                              <FormLabel width={"100%"}>
                                Source Account:
                              </FormLabel>
                              <Field
                                as={Select}
                                id="fromAccount"
                                name="fromAccount"
                                width={"100%"}
                                placeholder="Source bank account:"
                              >
                                {accountsData?.map((item: any) => (
                                  <option
                                    key={item.accountNumber}
                                    value={item.accountNumber}
                                  >
                                    Maze Bank {item.accountType}{" "}
                                    {item.accountNumber}: ${item.balance}
                                  </option>
                                ))}
                              </Field>
                            </FormControl>

                            <Field name="amount">
                              {({ field, form }: any) => (
                                <FormControl
                                  isRequired
                                  id="amount"
                                  width={"100%"}
                                  pt={2}
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

                            <FormControl isRequired pt={2}>
                              <FormLabel>Frequency:</FormLabel>
                              <Field
                                as={Select}
                                id="frequency"
                                name="frequency"
                                placeholder="Frequency:"
                              >
                                <option>Daily</option>
                                <option>Weekly</option>
                                <option>Monthly</option>
                              </Field>
                            </FormControl>

                            <FormControl
                              pt={2}
                              pb={4}
                              isRequired
                              isInvalid={!!errors.payDate && !!touched.payDate}
                            >
                              <FormLabel htmlFor="payDate">
                                Date of payment:
                              </FormLabel>
                              <Field
                                as={Input}
                                id="payDate"
                                name="payDate"
                                type="payDate"
                                placeholder="MM/DD/YYYY"
                              />
                              <ErrorMessage
                                name="payDate"
                                component={FormErrorMessage}
                              />
                            </FormControl>

                            <Button
                              colorScheme="red"
                              color="white"
                              type="submit"
                              isLoading={loading}
                            >
                              Create Automated Payment
                            </Button>
                          </Stack>
                        </Form>
                      )}
                    </Formik>
                  </TabPanel>

                  <TabPanel>
                    <TableContainer>
                      <Table size="sm">
                        <Thead>
                          <Tr>
                            <Th>From</Th>
                            <Th>Transaction Type</Th>
                            <Th>Recipient</Th>
                            <Th>Frequency</Th>
                            <Th>Date of Payment</Th>
                            <Th isNumeric>Amount</Th>
                          </Tr>
                        </Thead>
                        <Tbody maxHeight="68vh" overflowY="auto">
                          {autoPayments?.map((item: any) => (
                            <Tr key={item.autoId}>
                              <Td>
                                Maze Bank {item.accountType}{" "}
                                {item.accountNumber}
                              </Td>
                              <Td>{item.transactionType}</Td>
                              <Td>{item.recipient}</Td>
                              <Td>{item.frequency}</Td>
                              <Td>
                                {new Date(item.paymentDate).toLocaleString(
                                  "en-US"
                                )}
                              </Td>
                              <Td isNumeric>
                                $
                                {item.amount.toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                })}
                              </Td>
                              <Td>
                                <IconButton
                                  size={"sm"}
                                  variant="outline"
                                  colorScheme="red"
                                  aria-label="Delete"
                                  onClick={() =>
                                    deleteAutoPaymentRequest(item.autoId)
                                  }
                                  isLoading={loading}
                                  icon={<DeleteIcon />}
                                />
                              </Td>
                            </Tr>
                          ))}
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
                                  {accountsData?.map((item: any) =>
                                    item.accountNumber !==
                                    values.fromAccount ? (
                                      <option
                                        key={item.accountNumber}
                                        value={item.accountNumber}
                                      >
                                        Maze Bank {item.accountType}{" "}
                                        {item.accountNumber}: ${item.balance}
                                      </option>
                                    ) : null
                                  )}
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
                                      {item.accountNumber}: ${item.balance}
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
                                      {item.accountNumber}: ${item.balance}
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
                                      <NumberInputField placeholder="To: External AccountNumber" />
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
