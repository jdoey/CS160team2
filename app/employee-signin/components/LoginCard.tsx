"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  FormErrorMessage,
} from "@chakra-ui/react";

export default function LoginCard() {
  const [incorrectCreds, setIncorrectCreds] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const response = await fetch("/api/employee/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      console.log(data.message);
      if (data.isSuccess == true) {
        setLoading(false);
        router.push("/employee");
      } else {
        setLoading(false);
        setIncorrectCreds(true);
        setErrorMsg(data.message);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error logging in: ", error);
    }
  };

  return (
    <Formik
      initialValues={{
        username: "",
        password: "",
        isEmp: true,
      }}
      onSubmit={handleSubmit}
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({ values, errors, touched }) => (
        <Form>
          <Flex
            minH={"100vh"}
            justify={"center"}
            bg={useColorModeValue("gray.50", "gray.800")}
          >
            <Stack spacing={8} mx={"auto"} maxW={"xl"} py={6} px={6}>
              <Stack align={"center"}></Stack>
              <Box
                rounded={"lg"}
                bg={useColorModeValue("white", "gray.700")}
                borderWidth="1px"
                shadow="1px 1px 3px rgba(0,0,0,0.3)"
                boxShadow={"lg"}
                p={8}
              >
                <Stack spacing={5}>
                  <Stack align={"center"} mb={"5%"}>
                    <Heading>Employee Portal Sign-in</Heading>
                    <Text fontSize={"lg"} color={"gray.600"}>
                      for employees of Maze Bank only
                    </Text>
                  </Stack>
                  <FormControl id="username" isInvalid={incorrectCreds}>
                    <FormLabel>Username</FormLabel>
                    <Field
                      as={Input}
                      id="username"
                      name="username"
                      type="username"
                    />
                    <FormErrorMessage>{errorMsg}</FormErrorMessage>
                  </FormControl>
                  <FormControl id="password">
                    <FormLabel>Password</FormLabel>
                    <Field
                      as={Input}
                      id="password"
                      name="password"
                      type="password"
                    />
                  </FormControl>
                  <Stack spacing={10}>
                    <Stack
                      direction={{ base: "column", sm: "row" }}
                      align={"start"}
                      justify={"space-between"}
                    >
                      {/* <Checkbox>Remember me</Checkbox> */}
                      <Text color={"blue.400"}>Forgot password?</Text>
                    </Stack>
                    <Stack spacing={2}>
                      <Button
                        type="submit"
                        bg={"#E1090A"}
                        color={"white"}
                        isLoading={loading}
                        _hover={{
                          bg: "#88090A",
                        }}
                      >
                        Sign in
                      </Button>
                    </Stack>
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </Flex>
        </Form>
      )}
    </Formik>
  );
}
