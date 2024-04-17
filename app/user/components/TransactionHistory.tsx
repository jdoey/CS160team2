import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Center,
  Spinner,
  Flex,
  Text,
} from "@chakra-ui/react";

interface TransactionProps {
  transactionId: number;
  transactionType: string;
  amount: number;
  date: string;
}

interface TransactionsArray {
  transactions: TransactionProps[] | null;
}

export default function TransactionHistory({
  transactions,
}: TransactionsArray) {
  return (
    <Box maxHeight="68vh" overflowY="auto">
      <Accordion borderRadius={10} allowToggle bg={"#FFFFFF"}>
        {!transactions ? (
          <Text></Text>
        ) : (
          transactions?.map((item: TransactionProps) => (
            <AccordionItem key={item.transactionId}>
              {({ isExpanded }) => (
                <>
                  <h2>
                    <AccordionButton
                      borderRadius={10}
                      _expanded={{ bg: "red.500", color: "white" }}
                    >
                      <Text
                        as="span"
                        textAlign="left"
                        whiteSpace={"nowrap"}
                        overflow={"hidden"}
                        textOverflow={"ellipsis"}
                        width={"100%"}
                      >
                        {(
                          item.transactionType +
                          " " +
                          " ON " +
                          new Date(item.date).toLocaleDateString()
                        ).toUpperCase() +
                          " " +
                          item.transactionId.toString().slice(3)}
                      </Text>
                      {isExpanded ? (
                        <>
                          <Text
                            fontWeight="semibold"
                            textAlign={"right"}
                            width={"100%"}
                            color={"white"}
                          >
                            {item.transactionType == "Transfer+" ||
                            item.transactionType == "Deposit"
                              ? "+" +
                                "$" +
                                item.amount.toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                })
                              : "$" +
                                item.amount.toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                })}
                          </Text>
                        </>
                      ) : (
                        <>
                          <Text
                            fontWeight="semibold"
                            textAlign={"right"}
                            width={"100%"}
                            color={
                              item.transactionType === "Deposit" ||
                              item.transactionType === "Transfer+"
                                ? "green"
                                : "black"
                            }
                          >
                            {item.transactionType == "Transfer+" ||
                            item.transactionType == "Deposit"
                              ? "+" +
                                "$" +
                                item.amount.toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                })
                              : "$" +
                                item.amount.toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                })}
                          </Text>
                        </>
                      )}
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Text>
                      Transaction ID: {item.transactionId} <br></br>
                      Transaction Type: {item.transactionType}
                      <br></br>
                      Transaction Date: {item.date}
                      <br></br>
                    </Text>
                  </AccordionPanel>
                </>
              )}
            </AccordionItem>
          ))
        )}
      </Accordion>
    </Box>
  );
}
