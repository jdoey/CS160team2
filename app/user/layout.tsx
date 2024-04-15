"use client";

import { Providers } from "../providers";
import Sidebar from "../components/Sidebar";
import { Box } from "@chakra-ui/react";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box>
      <Sidebar />
      <Providers>{children}</Providers>
    </Box>
  );
}
