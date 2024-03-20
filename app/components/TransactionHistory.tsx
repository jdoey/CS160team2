import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
    Flex,
    Text
  } from '@chakra-ui/react'

export default function TransactionHistory() {
    return (
        <Accordion defaultIndex={[0]}>
  <AccordionItem>
    <h2>
      <AccordionButton _expanded={{ bg: 'red.500', color: 'white' }}>
        <Box as="span" flex='1' textAlign='left'>
            Save-A-Cent
        </Box>
        <Text fontWeight='semibold' paddingLeft={500}>$12.36</Text>
        <AccordionIcon />
      </AccordionButton>
    </h2>
    <AccordionPanel pb={4}>
        <Text>
            March 13, 2024 <br></br>
            Description: <br></br>
            Merchant type: <br></br>
            Method: <br></br>
        </Text>
    </AccordionPanel>
  </AccordionItem>

  <AccordionItem>
    <h2>
      <AccordionButton _expanded={{ bg: 'red.500', color: 'white' }}>
        <Box as="span" flex='1' textAlign='left'>
            A&R Market
        </Box>
        <Text fontWeight='semibold' paddingLeft={500}>$34.17</Text>
        <AccordionIcon />
      </AccordionButton>
    </h2>
    <AccordionPanel pb={4}>
        <Text>
            March 4, 2024 <br></br>
            Description: <br></br>
            Merchant type: <br></br>
            Method: <br></br>
        </Text>
    </AccordionPanel>
  </AccordionItem>

  <AccordionItem>
    <h2>
      <AccordionButton _expanded={{ bg: 'red.500', color: 'white' }}>
        <Box as="span" flex='1' textAlign='left'>
            Bob Mulét
        </Box>
        <Text fontWeight='semibold' paddingLeft={500}>$18.24</Text>
        <AccordionIcon />
      </AccordionButton>
    </h2>
    <AccordionPanel pb={4}>
        <Text>
            February 16, 2024 <br></br>
            Description: <br></br>
            Merchant type: <br></br>
            Method: <br></br>
        </Text>
    </AccordionPanel>
  </AccordionItem>

  <AccordionItem>
    <h2>
      <AccordionButton _expanded={{ bg: 'red.500', color: 'white' }}>
        <Box as="span" flex='1' textAlign='left'>
            Vangelico
        </Box>
        <Text fontWeight='semibold' paddingLeft={500}>$8.76</Text>
        <AccordionIcon />
      </AccordionButton>
    </h2>
    <AccordionPanel pb={4}>
        <Text>
            February 2, 2024 <br></br>
            Description: <br></br>
            Merchant type: <br></br>
            Method: <br></br>
        </Text>
    </AccordionPanel>
  </AccordionItem>

  <AccordionItem>
    <h2>
      <AccordionButton _expanded={{ bg: 'red.500', color: 'white' }}>
        <Box as="span" flex='1' textAlign='left'>
            LTD Gasoline
        </Box>
        <Text as="span" flex='1' textAlign='right' fontWeight='semibold'>$65.82</Text>
        <AccordionIcon />
      </AccordionButton>
    </h2>
    <AccordionPanel pb={4}>
        <Text>
            January 17, 2024 <br></br>
            Description: <br></br>
            Merchant type: <br></br>
            Method: <br></br>
        </Text>
    </AccordionPanel>
  </AccordionItem>
</Accordion>
    )
    }