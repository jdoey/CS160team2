"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  ButtonGroup,
  Button,
  Heading,
  Flex,
  FormControl,
  Stack,
  Select,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { useToast } from "@chakra-ui/react";

const form1ValidationSchema = Yup.object({
  accountNumber: Yup.string().required("Required"),
  deposit: Yup.string().required("Required"),
});

const Form1 = (props: any) => {
  const format = (val: string) => `$` + val;
  const parse = (val: string) => val.replace(/^\$/, "");

  const handleSubmit = (values: any) => {
    props.next(values);
  };

  return (
    <>
      <Heading
        w="100%"
        textAlign={"center"}
        fontWeight="semibold"
        mb="2%"
        padding={10}
      >
        Deposit a check
      </Heading>
      <Formik
        initialValues={props.data}
        validationSchema={form1ValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched }) => (
          <Form>
            <FormControl isRequired id="accountNumber" pb={"20px"}>
              <FormLabel>Deposit to</FormLabel>
              <Field
                as={Select}
                id="accountNumber"
                name="accountNumber"
                variant="filled"
                placeholder="Select an account to deposit to"
                width={"100%"}
                textAlign={"left"}
                whiteSpace={"nowrap"}
                overflow={"hidden"}
                textOverflow={"ellipsis"}
              >
                {props.accountsData?.map((item: any) => (
                  <option key={item.accountNumber} value={item.accountNumber}>
                    Maze Bank {item.accountType} {item.accountNumber}
                  </option>
                ))}
              </Field>
            </FormControl>
            <Field name="deposit">
              {({ field, form }: any) => (
                <FormControl isRequired id="deposit" width={"100%"}>
                  <FormLabel htmlFor="deposit">Amount</FormLabel>
                  <NumberInput
                    id="deposit"
                    {...field}
                    onChange={(valueString) =>
                      form.setFieldValue(field.name, parse(valueString))
                    }
                    value={format(field.value)}
                    min={1}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              )}
            </Field>
            <ButtonGroup mt="5%" w="100%">
              <Flex w="100%" justifyContent="space-between">
                <Flex>
                  <Button
                    isDisabled
                    colorScheme="red"
                    variant="solid"
                    w="7rem"
                    mr="5%"
                  >
                    Back
                  </Button>
                  <Button
                    w="7rem"
                    type="submit"
                    colorScheme="red"
                    variant="outline"
                  >
                    Next
                  </Button>
                </Flex>
              </Flex>
            </ButtonGroup>
          </Form>
        )}
      </Formik>
    </>
  );
};

const Form2 = (props: any) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = () => {
    setLoading(true);
    makeDepositRequest();
  };

  const makeDepositRequest = async () => {
    try {
      const response = await fetch("/api/transaction/deposit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountNumber: props.data.accountNumber,
          amount: props.data.deposit,
        }),
      });
      const data = await response.json();
      if (data.isSuccess) {
        setLoading(false);
        toast({
          title: data.message,
          description: `Check deposited to Account#:${props.data.accountNumber} successfully!`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: data.message,
          description: `Error in depositing check to Account#:${props.data.accountNumber}. Please try again`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
      router.push("/user");
    } catch (error) {
      console.error("Error depositing check to account", error);
      setLoading(false);
    }
  };

  return (
    <>
      <Heading
        w="100%"
        textAlign={"center"}
        fontWeight="semibold"
        mb="2%"
        padding={10}
      >
        Upload check photos
      </Heading>
      <Box flexDirection={"row"}>
        <Box padding={"5"}>
          <p>Front of check:</p>
          <form action="action_page.php">
            <input type="file" id="checkPhoto" name="checkPhotoName" />
          </form>
        </Box>
        <Box padding={"5"}>
          <p>Back of check:</p>
          <form action="action_page.php">
            <input type="file" id="checkPhoto" name="checkPhotoName" />
            {/* <Button>
              <input type="submit"/>
            </Button> */}
          </form>
        </Box>
      </Box>
      <ButtonGroup mt="5%" w="100%">
        <Flex w="100%" justifyContent="space-between">
          <Flex>
            <Button
              onClick={() => props.prev(props.data)}
              colorScheme="red"
              variant="solid"
              w="7rem"
              mr="5%"
            >
              Back
            </Button>
            <Button w="7rem" isDisabled colorScheme="red" variant="outline">
              Next
            </Button>
          </Flex>
          <Button
            type="submit"
            w="7rem"
            colorScheme="red"
            variant="solid"
            onClick={handleSubmit}
            isLoading={loading}
          >
            Submit
          </Button>
        </Flex>
      </ButtonGroup>
    </>
  );
};

export default function Multistep() {
  const toast = useToast();
  const [step, setStep] = useState(0);

  const [data, setData] = useState({
    accountNumber: "",
    deposit: "",
    frontCheckImage: "",
    backCheckImage: "",
  });

  const [accountsData, setAccountsData] = useState([]);

  useEffect(() => {
    console.log("rerender accountcards");
    fetch("/api/customer/getActiveAccounts", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch active accounts");
        }
        return response.json();
      })
      .then((data) => {
        setAccountsData(data.accounts);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  const handleNextStep = (newData: any, final = false) => {
    setData((prev) => ({ ...prev, ...newData }));

    if (final) {
      return;
    }

    setStep((prev) => prev + 1);
  };

  const handlePrevStep = (newData: any) => {
    setData((prev) => ({ ...prev, ...newData }));
    setStep((prev) => prev - 1);
  };

  const steps = [
    <Form1 accountsData={accountsData} next={handleNextStep} data={data} />,
    <Form2 next={handleNextStep} prev={handlePrevStep} data={data} />,
  ];

  return (
    <>
      <Box
        borderWidth="1px"
        rounded="lg"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
        maxWidth={800}
        p={6}
        m="10px auto"
      >
        {steps[step]}
      </Box>
    </>
  );
}
