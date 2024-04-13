"use client";

import { Box, Flex, Button, Heading, Stack, Text } from "@chakra-ui/react";

import { useState, useEffect } from "react";
import AccountCard from "./components/AccountCard";
import TransactionHistory from "./components/TransactionHistory";
import OpenNewAccount from "./components/OpenNewAccount";

export default function Page() {
  const [accountsData, setAccountsData] = useState(null);
  const [transactionsData, setTransactionsData] = useState(null);
  const [selectedAccount, selectAccount] = useState({ selected: 0 });
  const [reload, setReload] = useState(0);

  const handleAccountSelect = (accountNumber: number) => {
    selectAccount({ selected: accountNumber });
  };

  const handleReload = () => {
    setReload((prevCount) => prevCount + 1);
  };

  useEffect(() => {
    console.log("rerender accountcards");
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
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [reload]);

  useEffect(() => {
    console.log(selectedAccount.selected);
    const accountNumber = selectedAccount.selected;
    if (accountNumber > 0) {
      fetch(`/api/customer/${accountNumber}/transactionHistory`, {
        method: "GET",
        credentials: "include",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch transaction history");
          }
          return response.json();
        })
        .then((data) => {
          setTransactionsData(data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [selectedAccount.selected]);

  return (
    <>
      <Box ml={{ base: 0, md: 60 }} p="4" pt={0}>
        <Flex flexDirection={{ base: "column", md: "row" }}>
          <Flex flexDirection={"column"} paddingLeft={{ base: 0, md: 4 }}>
            <Heading paddingBottom={5}>Bank Accounts</Heading>
            <Stack>
              <Box maxHeight="60vh" overflowY="auto" pr={"15px"}>
                <AccountCard
                  accounts={accountsData}
                  selectedAccount={selectedAccount}
                  handleAccountSelect={handleAccountSelect}
                />
              </Box>
              <OpenNewAccount handleReload={handleReload} />
            </Stack>
          </Flex>
          <Flex
            paddingTop={{ base: 5, md: 0 }}
            paddingLeft={{ base: 0, md: 5 }}
            flexDirection={"column"}
          >
            {transactionsData ? (
              <Heading paddingBottom={5}>Transactions</Heading>
            ) : (
              <Text></Text>
            )}
            <Flex width={"100%"}>
              <TransactionHistory transactions={transactionsData} />
            </Flex>
          </Flex>
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
