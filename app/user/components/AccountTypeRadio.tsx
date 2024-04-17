import {
  Box,
  HStack,
  useRadio,
  useRadioGroup,
  Icon,
  Stack,
  Flex,
  Text,
  Center,
} from "@chakra-ui/react";
import { ReactElement } from "react";
import { FaPiggyBank, FaMoneyCheck } from "react-icons/fa";
import { useFormikContext } from "formik";

interface FeatureProps {
  title: string;
  icon: ReactElement;
}

const Feature = ({ title, icon }: FeatureProps) => {
  return (
    <Stack align={"center"}>
      <Flex
        w={16}
        h={16}
        align={"center"}
        justify={"center"}
        color={"white"}
        rounded={"full"}
        bg={"red.500"}
        mb={0}
      >
        {icon}
      </Flex>
      <Text fontWeight={600} fontSize={"xl"}>
        {title}
      </Text>
    </Stack>
  );
};

// 1. Create a component that consumes the `useRadio` hook
function RadioCard(props: any) {
  const { getInputProps, getRadioProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Box
      width={"100%"}
      as="label"
      justifyContent={"center"}
      alignItems={"center"}
    >
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        _checked={{
          bg: "red.500",
          color: "white",
          borderColor: "red.600",
        }}
        _focus={{
          boxShadow: "outline",
        }}
        px={5}
        py={3}
      >
        <Feature
          title={props.children}
          icon={
            props.children == "Checking" ? (
              <Icon as={FaMoneyCheck} w={10} h={10} color={"white"} />
            ) : (
              <Icon as={FaPiggyBank} w={10} h={10} color={"white"} />
            )
          }
        />
      </Box>
    </Box>
  );
}

// Step 2: Use the `useRadioGroup` hook to control a group of custom radios.
export default function AccountTypeRadio() {
  const options = ["Checking", "Savings"];

  const formikProps = useFormikContext();

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "accountType",
    defaultValue: "",
    onChange: (value) => {
      formikProps.setFieldValue("accountType", value);
    },
  });

  const group = getRootProps();

  return (
    <HStack {...group}>
      {options.map((value) => {
        const radio = getRadioProps({ value });
        return (
          <RadioCard key={value} {...radio}>
            {value}
          </RadioCard>
        );
      })}
    </HStack>
  );
}
