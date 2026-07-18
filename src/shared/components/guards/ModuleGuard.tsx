import { Box, Text, VStack } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

import { useHasModule } from "@/shared/hooks/useAuth";

interface ModuleGuardProps {
  moduleCode: string;
  fallback?: React.ReactNode;
}

export const ModuleGuard = ({
  moduleCode,
  fallback,
  children,
}: PropsWithChildren<ModuleGuardProps>) => {
  const hasModule = useHasModule(moduleCode);

  if (!hasModule) {
    return (
      fallback || (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          minHeight="400px"
        >
          <VStack gap={4} textAlign="center">
            <Text fontSize="6xl" fontWeight="bold" color="gray.300">
              403
            </Text>
            <Text fontSize="xl" fontWeight="semibold" color="gray.700">
              Access Denied
            </Text>
            <Text fontSize="sm" color="gray.500">
              You do not have access to this module.
            </Text>
          </VStack>
        </Box>
      )
    );
  }

  return <>{children}</>;
};
