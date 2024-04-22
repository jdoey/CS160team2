"use client";

import Image from "next/image";

import {
  Box,
  Flex,
  Center,
  IconButton,
  Button,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";

import MazeBankLogo from "../../../public/redmazebank.png";

export default function Header() {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Box>
      <Box
        bg={useColorModeValue("white", "gray.800")}
        color={useColorModeValue("gray.600", "white")}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
      >
        <Center>
          <Button
            as={"a"}
            href={"/"}
            variant={"ghost"}
            size={"lg"}
            _hover={{ bg: "00" }}
          >
            <Image
              src={MazeBankLogo}
              alt="Maze Bank Logo"
              width={50}
              height={50}
            />
            MAZE BANK
          </Button>
        </Center>
      </Box>
    </Box>
  );
}
