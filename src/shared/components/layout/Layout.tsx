import { Box, HStack, VStack, Spinner, Center } from "@chakra-ui/react";
import { PropsWithChildren, useEffect, useState } from "react";

import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { useCurrentUserQuery } from "@/api/me";
import { useAuthStore } from "@/shared/stores/auth.store";
import TokenService from "@/shared/service/service-token";

export const Layout = ({ children }: PropsWithChildren) => {
  const isAuthenticated = TokenService.isAuthenticated();
  const query = useCurrentUserQuery({ enabled: isAuthenticated });
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (query.data && !isInitialized) {
      useAuthStore.getState().initializeUser({
        user: query.data,
        firm: query.data.firm,
        role: query.data.role,
        permissions: query.data.permissions,
        modules: query.data.modules,
      });
      setIsInitialized(true);
    }
  }, [query.data, isInitialized]);

  useEffect(() => {
    if (query.error) {
      useAuthStore.getState().clearUser();
      window.location.href = "/auth/login";
    }
  }, [query.error]);

  if (!isInitialized || query.isLoading) {
    return (
      <Center height="100vh">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  return (
    <HStack alignItems="stretch" gap="0" height="vh">
      <Sidebar />

      <VStack alignItems="stretch" flex="1" gap="0">
        {/* <Navbar /> */}

        <Box overflowY="auto" flex="1">
          <Box padding="2">{children}</Box>
        </Box>
      </VStack>
    </HStack>
  );
};
