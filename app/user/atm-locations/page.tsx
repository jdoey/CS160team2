"use client";
import { Link } from "@chakra-ui/next-js";
import MapTitle from "../../ATM/components/MapTitle";
import AtmMap from "../../ATM/components/Map";

import { Box } from "@chakra-ui/react";

export default function Page() {
  return (
    <>
      <Box ml={{ base: 0, md: 60 }}>
        <MapTitle />
        <AtmMap />
      </Box>
    </>
  );
}
