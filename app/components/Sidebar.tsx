"use client";

import {
  IconButton,
  Avatar,
  Heading,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Button,
  Center,
} from "@chakra-ui/react";
import { FiMenu, FiBell, FiChevronDown } from "react-icons/fi";

import {
  CiBank,
  CiMoneyCheck1,
  CiDollar,
  CiMap,
  CiSettings,
} from "react-icons/ci";

import { useState, useEffect } from "react";
import { IconType } from "react-icons";
import NextLink from "next/link";
import MazeBankLogo from "../../public/redmazebank.png";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface LinkItemProps {
  name: string;
  icon: IconType;
  pagelink: string;
}

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: React.ReactNode;
}

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const LinkItems: Array<LinkItemProps> = [
  { name: "Home", icon: CiBank, pagelink: "/user" },
  { name: "Pay & Transfer", icon: CiDollar, pagelink: "/user/payandtransfer" },
  { name: "Deposit", icon: CiMoneyCheck1, pagelink: "/user/deposit" },
  { name: "ATM Locations", icon: CiMap, pagelink: "/user/atm-locations" },
];

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex paddingTop={5} paddingBottom={2}>
        <Button
          as={"a"}
          href={"/user"}
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
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon}>
          <NextLink href={link.pagelink} passHref>
            <Button
              bg={"white"}
              _hover={{ bg: "red.500", color: "white" }}
              onClick={onClose}
            >
              {link.name}
            </Button>
          </NextLink>
        </NavItem>
      ))}
    </Box>
  );
};

const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
  return (
    <Box style={{ textDecoration: "none" }} _focus={{ boxShadow: "none" }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        {...rest}
      >
        {icon && <Icon mr="4" fontSize="16" as={icon} />}
        {children}
      </Flex>
    </Box>
  );
};

interface SessionData {
  firstname: string;
  lastname: string;
  customerId: string;
}

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const router = useRouter();

  useEffect(() => {
    makeGetSessionDataRequest();
  }, []);

  const makeGetSessionDataRequest = async () => {
    try {
      const response = await fetch("/api/customerSessionData");
      const data = await response.json();
      setSessionData(data);
    } catch (error) {
      console.error("Error fetching session data", error);
    }
  };

  const handleSignOut = async () => {
    try {
      const response = await fetch("/api/customer/logout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.isSuccess) {
        console.log("Logout successful");
        router.push("/");
      }
    } catch (error) {
      console.error("Error logging out", error);
    }
  };
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      {/* <Text
        as={Image}
        display={{ base: "flex", md: "none" }}
        src={MazeBankLogo}
        alt="Maze Bank Logo"
        width={50}
        height={50}
        // fontSize="2xl"
        // fontFamily="monospace"
        // fontWeight="bold"
      ></Text> */}

      <Flex
        paddingTop={5}
        paddingBottom={2}
        display={{ base: "flex", md: "none" }}
      >
        <Button
          as={"a"}
          href={"/user"}
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
      </Flex>

      {/* <Image src={MazeBankLogo} alt="Maze Bank Logo" width={50} height={50} /> */}

      {/* <Heading
        display={{ base: "none", md: "flex" }}
        width={{ base: "none", md: "900px" }}
      >
        Good Day, Michael
      </Heading> */}

      <HStack spacing={{ base: "0", md: "6" }}>
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
            >
              <HStack>
                <Avatar
                  size={"sm"}
                  name={sessionData?.firstname + " " + sessionData?.lastname}
                />
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">
                    {sessionData?.firstname} {sessionData?.lastname}
                  </Text>
                  <Text fontSize="xs" color="gray.600">
                    Customer
                  </Text>
                </VStack>
                <Box display={{ base: "none", md: "flex" }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue("white", "gray.900")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              <MenuItem>Profile</MenuItem>
              <MenuDivider />
              <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};

const SidebarWithHeader = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4" pt={"0"}></Box>
    </Box>
  );
};

export default SidebarWithHeader;
