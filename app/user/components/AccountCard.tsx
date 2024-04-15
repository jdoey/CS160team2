"use client";

import { useState, useEffect, useRef } from "react";
import {
  Stack,
  StackDivider,
  Text,
  Button,
  Flex,
  Center,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Box,
  Spinner,
  Card,
  CardBody,
  Heading,
} from "@chakra-ui/react";

import { SettingsIcon } from "@chakra-ui/icons";

import ContextMenu from "./ContextMenu";

interface AccountProps {
  accountNumber: number;
  accountType: string;
  balance: number;
  accountStatus: string;
}

interface AccountsArray {
  handleReload: any;
  accounts: AccountProps[] | null;
  selectedAccount: { selected: number };
  handleAccountSelect: (value: number) => void;
}

export default function AccountCard({
  handleReload,
  accounts,
  selectedAccount,
  handleAccountSelect,
}: AccountsArray) {
  const didMount = useRef(false);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
    } else {
      if (accounts) handleAccountSelect(accounts[0]?.accountNumber);
    }
  }, []);

  return (
    <Stack divider={<StackDivider />} spacing="4">
      {!accounts ? (
        <Center pb={5} width={["100%", "30vw"]}>
          <Spinner color="red.500" size="lg" />
        </Center>
      ) : accounts.length > 0 ? (
        accounts?.map((item: AccountProps) => (
          <Box
            key={item.accountNumber}
            onClick={() => handleAccountSelect(item.accountNumber)}
            style={{ textAlign: "left", width: "100%" }}
          >
            <Stat
              p="4"
              boxShadow={"lg"}
              width={["100%", "30vw"]}
              marginBottom={0}
              borderRadius={10}
              borderWidth="1px"
              bg={
                selectedAccount.selected === item.accountNumber
                  ? "red.500"
                  : "white"
              }
            >
              <Flex alignItems="center">
                <StatLabel
                  color={
                    selectedAccount.selected === item.accountNumber
                      ? "white"
                      : "gray.700"
                  }
                  fontSize={"md"}
                >
                  {"Maze Bank " + item.accountType + " " + item.accountNumber}
                </StatLabel>
                <Flex flexGrow={1} justifyContent="flex-end">
                  <ContextMenu
                    selectedAccount={selectedAccount}
                    handleAccountSelect={handleAccountSelect}
                    item={item}
                    handleReload={handleReload}
                  />
                  {/* <Menu>
                    <MenuButton
                      as={IconButton}
                      aria-label="Options"
                      icon={<SettingsIcon />}
                      variant="outline"
                      color={
                        selectedAccount.selected === item.accountNumber
                          ? "white"
                          : "gray.700"
                      }
                      size={"xs"}
                      _hover={{ bg: "gray.400" }}
                    />
                    <MenuList>
                      <MenuItem>Close Account</MenuItem>
                    </MenuList>
                  </Menu> */}
                </Flex>
              </Flex>
              <StatNumber
                color={
                  selectedAccount.selected === item.accountNumber
                    ? "white"
                    : "black"
                }
                pt={2}
              >
                {"$" +
                  item.balance.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
              </StatNumber>
              <Flex alignItems="center">
                <StatHelpText
                  color={
                    selectedAccount.selected === item.accountNumber
                      ? "white"
                      : "gray.700"
                  }
                  fontSize={"xs"}
                >
                  Available Balance
                </StatHelpText>
                <Flex flexGrow={1} justifyContent="flex-end">
                  <StatHelpText
                    textAlign={"right"}
                    color={
                      selectedAccount.selected === item.accountNumber
                        ? "white"
                        : "gray.700"
                    }
                    fontSize={"xs"}
                  >
                    Status: {item.accountStatus}
                  </StatHelpText>
                </Flex>
              </Flex>
            </Stat>
          </Box>
        ))
      ) : (
        <Card width={["100%", "30vw"]}>
          <CardBody>
            <Heading size="md" textTransform="uppercase">
              NO ACCOUNTS FOUND
            </Heading>
          </CardBody>
        </Card>
      )}
    </Stack>
  );
}
