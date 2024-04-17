"use client";

import {
  Box,
  Flex,
  Button,
  Heading,
  Stack,
  Text,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
} from "@chakra-ui/react";

import { useState, useEffect } from "react";
import AccountCard from "./components/AccountCard";
import TransactionHistory from "./components/TransactionHistory";
import OpenNewAccount from "./components/OpenNewAccount";

export default function Page() {
  const [accountsData, setAccountsData] = useState([]);
  const [transactionsData, setTransactionsData] = useState([]);
  const [selectedAccount, selectAccount] = useState({ selected: 0 });
  const [reload, setReload] = useState(0);

  const handleAccountSelect = (accountNumber: number) => {
    selectAccount({ selected: accountNumber });
  };

  const handleReload = () => {
    setReload((prevCount) => prevCount + 1);
  };

  const makeGetAccountsTransactionHistory = async () => {
    try {
      const response = await fetch(
        "/api/customer/getAccountsTransactionHistory",
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.isSuccess) {
        setTransactionsData(data.transactions);
      } else {
        console.log("Failed to fetch transaction history");
      }
    } catch (error) {
      console.error("Error fetching transaction history", error);
    }
  };

  useEffect(() => {
    fetch("/api/customer/getAccounts", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch accounts");
        }
        return response.json();
      })
      .then((data) => {
        setAccountsData(data.accounts);
        makeGetAccountsTransactionHistory();
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [reload]);

  return (
    <>
      <Box ml={{ base: 0, md: 60 }} p="4" pt={0}>
        <Flex flexDirection={{ base: "column", md: "row" }} gap={"30px"}>
          <Flex flexDirection={"column"} paddingLeft={{ base: 0, md: 5 }}>
            <Stack>
              <Card bg={"gray.40"} variant={"outline"}>
                <CardHeader>
                  <Heading size={"lg"}>Bank Accounts</Heading>
                </CardHeader>
                <Tabs isFitted variant="enclosed" colorScheme="red">
                  <TabList>
                    <Tab>Active</Tab>
                    <Tab>Inactive</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <CardBody maxHeight="52vh" overflowY="auto">
                        <AccountCard
                          handleReload={handleReload}
                          accounts={(accountsData as [])?.filter(
                            (account: any) => account.accountStatus === "Active"
                          )}
                          selectedAccount={selectedAccount}
                          handleAccountSelect={handleAccountSelect}
                        />
                      </CardBody>
                    </TabPanel>
                    <TabPanel>
                      <CardBody maxHeight="52vh" overflowY="auto">
                        <AccountCard
                          handleReload={handleReload}
                          accounts={(accountsData as [])?.filter(
                            (account: any) =>
                              account.accountStatus === "Inactive"
                          )}
                          selectedAccount={selectedAccount}
                          handleAccountSelect={handleAccountSelect}
                        />
                      </CardBody>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
                <CardFooter>
                  <OpenNewAccount handleReload={handleReload} />
                </CardFooter>
              </Card>
            </Stack>
          </Flex>

          {transactionsData.length > 0 && selectedAccount.selected > 0 ? (
            <Card width={"100%"} bg={"gray.40"} variant={"outline"}>
              <Flex paddingTop={{ base: 0, md: 0 }} flexDirection={"column"}>
                <CardHeader>
                  <Heading size={"lg"}>
                    Transactions for {selectedAccount.selected}
                  </Heading>
                </CardHeader>
                <Flex width={"100%"}>
                  <CardBody maxWidth={"100%"}>
                    <TransactionHistory
                      transactions={(transactionsData as [])?.filter(
                        (transaction: any) =>
                          transaction.accountNumber === selectedAccount.selected
                      )}
                    />
                  </CardBody>
                </Flex>
              </Flex>
            </Card>
          ) : (
            <Text></Text>
          )}
        </Flex>
      </Box>
      {/* <Box ml={{ base: 50, md: 60 }} p="4" pt={0} width={["100%"]}>
        <Flex paddingLeft={10} flexDirection={'column'}>
              <Heading paddingBottom={5} >Transactions</Heading>
              <Flex>
                <TransactionHistory/>
              </Flex>
        </Flex>
      </Box> */}
    </>
  );
}
