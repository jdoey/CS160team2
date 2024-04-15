"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  Select,
  FormLabel,
  InputGroup,
  InputLeftElement,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
} from "@chakra-ui/react";

import { useState } from "react";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import AccountTypeRadio from "./AccountTypeRadio";

const validationSchema = Yup.object({
  accountType: Yup.string().required("Required"),
  initialDeposit: Yup.string().required("Required"),
});

interface Props {
  handleReload: any;
}

export default function OpenNewAccount({ handleReload }: Props) {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);

  const format = (val: string) => `$` + val;
  const parse = (val: string) => val.replace(/^\$/, "");

  const [data, setData] = useState({
    accountType: "",
    initialDeposit: "",
  });

  const handleSubmit = (data: any) => {
    makeAccountCreationRequest(data);
  };

  const makeDepositRequest = async (accountProps: any) => {
    try {
      const response = await fetch("api/transaction/deposit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(accountProps),
      });
      const data = await response.json();
      handleReload();
      setLoading(false);
    } catch (error) {
      console.error("Error depositing to account", error);
    }
  };

  const makeAccountCreationRequest = async (formData: any) => {
    setLoading(true);
    try {
      const response = await fetch("/api/customer/account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log(data);
      if (data.isSuccess == true) {
        toast({
          title: data.message,
          description: "New account successfully created!",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        makeDepositRequest(data.accountProps);
        onClose();
      } else {
        toast({
          title: data.message,
          description: "Error: Please try again.",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error creating account:", error);
      toast({
        title: "Bank account creation failed!",
        description: "Please try again later.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Button onClick={onOpen} width={"100%"} colorScheme="red">
        Open New Account
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize={"2xl"} pb={0}>
            Open a new bank account
          </ModalHeader>
          <ModalCloseButton />
          <Formik
            initialValues={data}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched }) => (
              <Form>
                <ModalBody>
                  {/* <FormControl
                    isRequired
                    isInvalid={!!errors.accountType && !!touched.accountType}
                  >
                    <FormLabel htmlFor="accountType">Account Type</FormLabel> */}
                  {/* <Field
                      as={Select}
                      id="accountType"
                      name="accountType"
                      placeholder="Select account type"
                    >
                      <option>Checking</option>
                      <option>Savings</option>
                    </Field> */}
                  {/* <Field
                      as={AccountTypeRadio}
                      id="accountType"
                      name="accountType"
                    ></Field>
                  </FormControl> */}
                  <Field name="accountType">
                    {({ field, form }: any) => (
                      <FormControl isRequired id="accountType" pt={5}>
                        <FormLabel htmlFor="accountType">
                          Select an account type
                        </FormLabel>
                        <AccountTypeRadio />
                      </FormControl>
                    )}
                  </Field>
                  <Field name="initialDeposit">
                    {({ field, form }: any) => (
                      <FormControl isRequired id="initialDeposit" pt={10}>
                        <FormLabel htmlFor="initialDeposit">
                          Initial Deposit (Minimum: $200)
                        </FormLabel>
                        <NumberInput
                          id="initialDeposit"
                          {...field}
                          onChange={(valueString) =>
                            form.setFieldValue(field.name, parse(valueString))
                          }
                          value={format(field.value)}
                          min={200}
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
                  <ModalFooter pt={"40px"}>
                    <Button variant="ghost" mr={3} onClick={onClose}>
                      Cancel
                    </Button>
                    <Button type="submit" colorScheme="red" isLoading={loading}>
                      Create
                    </Button>
                  </ModalFooter>
                </ModalBody>
              </Form>
            )}
          </Formik>
        </ModalContent>
      </Modal>
    </>
  );
}
