"use client";

import { useState, useEffect, useRef } from "react";
import {
  Stack,
  Text,
  Button,
  Center,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Box,
  Spinner,
} from "@chakra-ui/react";
import { FcLock } from "react-icons/fc";

interface AccountProps {
  accountNumber: number;
  accountType: string;
  balance: number;
  accountStatus: string;
}

interface AccountsArray {
  accounts: AccountProps[] | null;
  selectedAccount: { selected: number };
  handleAccountSelect: (value: number) => void;
}

export default function AccountCard({
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
  }, [accounts]);

  return (
    <Stack>
      {!accounts ? (
        <Center pb={5}>
          <Spinner color="red.500" size="lg" />
        </Center>
      ) : (
        accounts?.map((item: AccountProps) => (
          <button
            key={item.accountNumber}
            onClick={() => handleAccountSelect(item.accountNumber)}
            style={{ textAlign: "left", width: "100%" }}
          >
            <Stat
              p="4"
              boxShadow={"lg"}
              width={["100%", "400px"]}
              marginBottom={3}
              borderRadius={10}
              borderWidth="1px"
              bg={
                selectedAccount.selected === item.accountNumber
                  ? "red.500"
                  : "white"
              }
            >
              <StatLabel
                color={
                  selectedAccount.selected === item.accountNumber
                    ? "white"
                    : "black"
                }
                fontSize={"md"}
                pb={2}
              >
                {"Maze Bank " + item.accountType + " " + item.accountNumber}
              </StatLabel>
              <StatNumber
                color={
                  selectedAccount.selected === item.accountNumber
                    ? "white"
                    : "black"
                }
              >
                {"$" +
                  item.balance.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
              </StatNumber>
              <StatHelpText
                color={
                  selectedAccount.selected === item.accountNumber
                    ? "white"
                    : "black"
                }
                fontSize={"xs"}
              >
                Available Balance
              </StatHelpText>
            </Stat>
          </button>
        ))
      )}
    </Stack>
  );
}
