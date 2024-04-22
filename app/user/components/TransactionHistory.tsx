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
  recipient: string;
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
                        {item.transactionType.startsWith("Payment")
                          ? item.transactionType === "Payment-"
                            ? (
                                item.transactionType +
                                " TO " +
                                item.recipient
                              ).toUpperCase()
                            : (
                                item.transactionType +
                                " FROM " +
                                item.recipient
                              ).toUpperCase()
                          : item.transactionType.toUpperCase()}
                        {" ON " +
                          new Date(item.date)
                            .toLocaleString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                              hour: "numeric",
                              minute: "numeric",
                              hour12: true,
                            })
                            .toUpperCase() +
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
                              item.transactionType.slice(-1) === "+"
                                ? "green"
                                : "black"
                            }
                          >
                            {item.transactionType.slice(-1) === "+" ||
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
                    <Text>ID: {item.transactionId} </Text>
                    <Text>Type: {item.transactionType}</Text>
                    {item.transactionType.startsWith("Payment") ? (
                      item.transactionType.slice(-1) === "-" ? (
                        <Text>Recipient: {item.recipient}</Text>
                      ) : (
                        <Text>Source: {item.recipient}</Text>
                      )
                    ) : null}
                    <Text>
                      Date:{" "}
                      {new Date(item.date).toLocaleString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })}
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
