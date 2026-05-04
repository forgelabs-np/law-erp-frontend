import { Box, HStack, VStack } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <HStack alignItems="stretch" gap="0" height="vh">
      <Sidebar />

      <VStack alignItems="stretch" flex="1" gap="0">
        <Navbar />

        <Box overflowY="auto" flex="1">
          <Box padding="2">{children}</Box>
        </Box>
      </VStack>
    </HStack>
  );
};
