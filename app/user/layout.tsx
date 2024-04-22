"use client";

import { Providers } from "../providers";
import Sidebar from "../components/Sidebar";
import { Box } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [auth, setAuth] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const fetchUserAuth = async () => {
      try {
        const response = await fetch("/api/customer/authorization", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        if (data.isSuccess) {
          setAuth(true);
        } else {
          setAuth(false);
          router.push("/employee");
        }
      } catch (error) {
        console.error("Error fetching user auth: ", error);
      }
    };
    fetchUserAuth();
  }, []);
  return (
    <Box>
      {auth ? (
        <Box>
          <Sidebar />
          <Providers>{children}</Providers>
        </Box>
      ) : (
        <Box></Box>
      )}
    </Box>
  );
}
