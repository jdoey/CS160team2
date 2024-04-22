"use client";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Text,
  Button,
  Box,
  Flex,
  Stack,
  StackDivider,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useToast,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EmployeeSidebar from "../components/EmployeeSidebar";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  accountNumber: Yup.string().required("Required"),
});

interface TransactionProps {
  amount: number;
  date: string;
  transactionId: string;
  transactionType: string;
}

export default function Page() {
  const toast = useToast();
  const [accountData, setAccountData] = useState<any>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (values: any) => {
    setLoading(true);
    makeGetCustomerAccountRequest(values);
  };

  const makeGetCustomerAccountRequest = async (values: any) => {
    try {
      const response = await fetch("/api/employee/customerAccount", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      setAccountData(data);
      if (data.isSuccess == false) {
        toast({
          title: "Account not found",
          description: "The account number inputted could not be found",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching account", error);
      setLoading(false);
    }
  };

  const [auth, setAuth] = useState(false);
  useEffect(() => {
    const fetchUserAuth = async () => {
      try {
        const response = await fetch("/api/employee/authorization", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        if (data.isSuccess) {
          setAuth(true);
        } else {
          setAuth(false);
          router.push("/signin");
        }
      } catch (error) {
        console.error("Error fetching user auth: ", error);
      }
    };
    fetchUserAuth();
  }, []);

  return (
    <>
      {auth ? (
        <Box>
          <EmployeeSidebar />
          <Box ml={{ base: 0, md: 60 }} p="4" pt={0}>
            <Formik
              initialValues={{ accountNumber: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched }) => (
                <Form>
                  <Card width={["100%", "80%"]}>
                    <CardHeader>
                      <Heading size="lg">Generate Report</Heading>
                    </CardHeader>
                    <CardBody>
                      <Field
                        as={Input}
                        id="accountNumber"
                        name="accountNumber"
                        placeholder="Account number"
                      ></Field>
                    </CardBody>
                    <CardBody pt={0}>
                      <Button
                        type="submit"
                        isLoading={loading}
                        colorScheme="red"
                        width="100%"
                      >
                        Generate Report
                      </Button>
                    </CardBody>
                  </Card>
                </Form>
              )}
            </Formik>
            <Box pt={"30px"}></Box>
            {accountData?.isSuccess ? (
              <Card width={["100%", "80%"]}>
                <CardHeader>
                  <Heading size="lg">
                    Report for {accountData?.accountNumber}
                  </Heading>
                </CardHeader>
                <CardBody>
                  <Stack divider={<StackDivider />} spacing="4">
                    <Box>
                      <Heading size="xs" textTransform="uppercase">
                        Personal Information
                      </Heading>
                      <Text pt="2" fontSize="sm">
                        Name: {accountData?.name}
                        <br></br>
                        Address: {accountData?.address.streetNum}{" "}
                        {accountData.address?.street}{" "}
                        {accountData?.address.city},{" "}
                        {accountData?.address.state}{" "}
                        {accountData?.address.zipcode}
                        <br></br>
                        Date of Birth:{" "}
                        {new Date(accountData?.dob).toLocaleDateString()}
                      </Text>
                    </Box>
                    <Box>
                      <Heading size="xs" textTransform="uppercase">
                        Account Information
                      </Heading>
                      <Text pt="2" fontSize="sm">
                        Account #: {accountData?.accountNumber}
                        <br></br>
                        Account Type: {accountData?.accountType}
                        <br></br>
                        Available Balance: $
                        {accountData.balance.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </Text>
                    </Box>
                    <Box>
                      <Heading size="xs" textTransform="uppercase">
                        Transaction History
                      </Heading>
                      <Card>
                        <CardBody p={2}>
                          <TableContainer maxHeight="50vh" overflowY={"auto"}>
                            <Table size="sm">
                              <Thead>
                                <Tr>
                                  <Th>Transactions</Th>
                                  <Th isNumeric>Amount</Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {accountData?.transactions.map(
                                  (item: TransactionProps) => (
                                    <Tr key={item.transactionId}>
                                      <Td>
                                        {item.transactionType.toUpperCase()}
                                        {" ON "}
                                        {new Date(item.date)
                                          .toLocaleDateString("en-US", {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric",
                                            hour: "numeric",
                                            minute: "numeric",
                                            hour12: true,
                                          })
                                          .toUpperCase()}{" "}
                                        {item.transactionId}
                                      </Td>
                                      <Td isNumeric>
                                        $
                                        {item.amount.toLocaleString("en-US", {
                                          minimumFractionDigits: 2,
                                        })}
                                      </Td>
                                    </Tr>
                                  )
                                )}
                              </Tbody>
                            </Table>
                          </TableContainer>
                        </CardBody>
                      </Card>
                    </Box>
                  </Stack>
                </CardBody>
              </Card>
            ) : (
              <Box></Box>
            )}
          </Box>{" "}
        </Box>
      ) : (
        <Box></Box>
      )}
    </>
  );
}
