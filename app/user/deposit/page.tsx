"use client";

import {
  Flex,
  Container,
  Heading,
  Stack,
  Text,
  Button,
  Icon,
  IconProps,
} from "@chakra-ui/react";

import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

export default function CallToActionWithIllustration() {
  return (
    <>
      <Container maxW={"6xl"}>
        <Stack
          paddingLeft={225}
          textAlign={"center"}
          align={"center"}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 20, md: 28 }}
        >
          <Heading
            fontWeight={600}
            fontSize={{ base: "3xl", sm: "4xl", md: "6xl" }}
            lineHeight={"110%"}
          >
            Depositing checks{" "}
            <Text as={"span"} color={"red.400"}>
              made easy
            </Text>
          </Heading>
          <Text color={"gray.500"} maxW={"3xl"}>
            Use our mobile app to upload photos of your checks and deposit them
            in less than a minute.<br></br>
          </Text>
          <Stack spacing={6} direction={"row"}>
            <Button
              rounded={"full"}
              px={6}
              colorScheme={"red"}
              bg={"red.400"}
              _hover={{ bg: "red.500" }}
            >
              Download the Mobile App
            </Button>
            <Button rounded={"full"} px={6}>
              Learn more
            </Button>
          </Stack>
        </Stack>
      </Container>
    </>
  );
}
