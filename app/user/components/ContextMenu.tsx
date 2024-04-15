"use client";

import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";

import React from "react";
import { SettingsIcon } from "@chakra-ui/icons";

interface Props {
  handleReload: any;
  handleAccountSelect: any;
  selectedAccount: { selected: number };
  item: any;
}

export default function ContextMenu({
  handleReload,
  handleAccountSelect,
  selectedAccount,
  item,
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  const handleUpdate = () => {
    console.log("updating acc");
    makeUpdateAccountRequest();
  };

  const makeUpdateAccountRequest = async () => {
    try {
      const response = await fetch("api/customer/updateAccount", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountNumber: selectedAccount.selected,
          accountStatus: item.accountStatus,
        }),
      });
      const data = await response.json();
      if (data.isSuccess) {
        console.log("Account status successfully updated");
        handleAccountSelect(null);
        handleReload();
      } else {
        console.log("Account status could not be updated");
      }
    } catch (error) {
      console.error("Error updating account status", error);
    }
  };

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<SettingsIcon />}
        variant="outline"
        color={
          selectedAccount.selected === item.accountNumber ? "white" : "gray.700"
        }
        size={"xs"}
        _hover={{ bg: "gray.400" }}
      />
      <MenuList>
        {item.accountStatus === "Active" ? (
          <MenuItem onClick={handleUpdate}>Close Account</MenuItem>
        ) : (
          <MenuItem onClick={handleUpdate}>Reopen Account</MenuItem>
        )}
      </MenuList>
    </Menu>
  );
}
