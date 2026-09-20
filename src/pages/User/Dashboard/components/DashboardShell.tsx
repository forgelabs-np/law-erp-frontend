import {
  Box,
  Button,
  Grid,
  HStack,
  Icon,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { AlertTriangle, RefreshCw, ShieldOff } from "lucide-react";

interface DashboardRefreshButtonProps {
  isFetching: boolean;
  onClick: () => void;
  /** @deprecated No longer used — kept for backward compat. */
  onDark?: boolean;
}

/** Refresh control used in every dashboard header. */
export const DashboardRefreshButton = ({
  isFetching,
  onClick,
}: DashboardRefreshButtonProps) => (
  <Button
    variant="ghost"
    size="sm"
    borderRadius="lg"
    onClick={onClick}
    disabled={isFetching}
    color="gray.600"
    _hover={{ bg: "gray.100" }}
  >
    {isFetching ? (
      <Spinner size="sm" color="gray.400" />
    ) : (
      <Icon as={RefreshCw} boxSize={4} />
    )}
    {/* {isFetching ? "Refreshing..." : "Refresh"} */}
  </Button>
);

const TileSkeleton = () => (
  <Box
    p={5}
    bg="white"
    border="1px solid"
    borderColor="gray.200"
    borderRadius="xl"
  >
    <HStack justify="space-between" mb={3}>
      <Stack gap={2} flex={1}>
        <Box h="10px" w="80px" bg="gray.100" borderRadius="md" />
        <Box h="28px" w="52px" bg="gray.100" borderRadius="md" />
      </Stack>
      <Box w="10" h="10" borderRadius="lg" bg="gray.100" />
    </HStack>
    <Box h="10px" w="120px" bg="gray.50" borderRadius="md" />
  </Box>
);

const PanelSkeleton = () => (
  <Box
    p={5}
    bg="white"
    border="1px solid"
    borderColor="gray.200"
    borderRadius="xl"
  >
    <HStack gap={3} mb={4}>
      <Box w="8" h="8" borderRadius="lg" bg="gray.100" />
      <Box h="12px" w="140px" bg="gray.100" borderRadius="md" />
    </HStack>
    <Stack gap={3}>
      {[1, 2, 3].map((row) => (
        <Box key={row} h="42px" w="100%" bg="gray.50" borderRadius="md" />
      ))}
    </Stack>
  </Box>
);

/** Role-agnostic skeleton shown while the dashboard request is in flight. */
export const DashboardSkeleton = () => (
  <Stack gap={6} padding={2}>
    <Stack gap={2}>
      <Box h="26px" w="240px" bg="gray.100" borderRadius="md" />
      <Box h="14px" w="380px" bg="gray.100" borderRadius="md" />
    </Stack>

    <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={4}>
      {[1, 2, 3, 4].map((tile) => (
        <TileSkeleton key={tile} />
      ))}
    </SimpleGrid>

    <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6}>
      <PanelSkeleton />
      <PanelSkeleton />
    </Grid>
  </Stack>
);

interface DashboardErrorStateProps {
  message: string;
  onRetry: () => void;
}

/** Error state with retry, using the existing query refetch. */
export const DashboardErrorState = ({
  message,
  onRetry,
}: DashboardErrorStateProps) => (
  <Stack
    gap={4}
    align="center"
    justify="center"
    textAlign="center"
    py={16}
    px={6}
    bg="white"
    border="1px solid"
    borderColor="gray.200"
    borderRadius="xl"
  >
    <Box
      w="12"
      h="12"
      borderRadius="full"
      bg="red.50"
      color="red.500"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Icon as={AlertTriangle} boxSize={6} />
    </Box>
    <Stack gap={1}>
      <Text fontSize="md" fontWeight={600} color="gray.800">
        Unable to load dashboard data
      </Text>
      <Text fontSize="sm" color="gray.500" maxW="420px">
        {message}
      </Text>
    </Stack>
    <Button size="sm" colorPalette="primary" onClick={onRetry}>
      <Icon as={RefreshCw} boxSize={4} />
      Retry
    </Button>
  </Stack>
);

/** Shown when the authenticated role has no dashboard of its own. */
export const UnsupportedRoleState = () => (
  <Stack
    gap={4}
    align="center"
    justify="center"
    textAlign="center"
    py={16}
    px={6}
    bg="white"
    border="1px solid"
    borderColor="gray.200"
    borderRadius="xl"
  >
    <Box
      w="12"
      h="12"
      borderRadius="full"
      bg="gray.100"
      color="gray.500"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Icon as={ShieldOff} boxSize={6} />
    </Box>
    <Stack gap={1}>
      <Text fontSize="md" fontWeight={600} color="gray.800">
        Dashboard unavailable for your role
      </Text>
      <Text fontSize="sm" color="gray.500" maxW="420px">
        No dashboard is configured for your account role. Please contact your
        administrator if you believe this is an error.
      </Text>
    </Stack>
  </Stack>
);
