import {
  Box,
  Button,
  Center,
  Grid,
  HStack,
  Skeleton,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Plus, Users, UserX } from "lucide-react";
import { CourtCaseRole, MatterParty } from "../types/matter.types";
import { PartyCard } from "./PartyCard";

interface PartiesWorkspaceCardProps {
  title?: string;
  subtitle?: string;
  parties: MatterParty[];
  roles?: CourtCaseRole[];
  onAddParty?: () => void;
  renderPartyActions?: (
    party: MatterParty,
    role?: CourtCaseRole
  ) => React.ReactNode;
  isLoading?: boolean;
  /** Context label, e.g. "matter" or "court case" */
  entityType?: "matter" | "court case";
}

export const PartiesWorkspaceCard = ({
  title = "Parties",
  subtitle,
  parties,
  roles = [],
  onAddParty,
  renderPartyActions,
  isLoading = false,
  entityType = "matter",
}: PartiesWorkspaceCardProps) => {
  const partyCount = parties.length;

  return (
    <Box
      bg="gray.50"
      p={{ base: 4, md: 6 }}
      borderRadius="2xl"
      border="1px solid"
      borderColor="gray.200"
    >
      <VStack align="stretch" gap={5}>
        {/* Header Bar */}
        <HStack
          justify="space-between"
          align="center"
          flexWrap="wrap"
          gap={3}
          bg="white"
          p={{ base: 4, md: 5 }}
          borderRadius="xl"
          border="1px solid"
          borderColor="gray.200"
          boxShadow="xs"
        >
          <HStack gap={3.5} align="center">
            <Center
              w="10"
              h="10"
              borderRadius="xl"
              bg="blue.50"
              color="blue.600"
              flexShrink={0}
            >
              <Users size={20} />
            </Center>
            <Box>
              <HStack gap={2.5} align="center">
                <Text
                  fontSize={{ base: "md", md: "lg" }}
                  fontWeight="700"
                  color="gray.900"
                >
                  {title}
                </Text>
                <Center
                  px={2.5}
                  py={0.5}
                  borderRadius="full"
                  bg="blue.50"
                  color="blue.700"
                  fontSize="xs"
                  fontWeight="700"
                >
                  {partyCount} {partyCount === 1 ? "Party" : "Parties"}
                </Center>
              </HStack>
              <Text fontSize="xs" color="gray.500" mt={0.5}>
                {subtitle ||
                  `${partyCount} ${
                    partyCount === 1 ? "party" : "parties"
                  } associated with this ${entityType}`}
              </Text>
            </Box>
          </HStack>

          {onAddParty && (
            <Button
              size="sm"
              bg="blue.600"
              color="white"
              _hover={{ bg: "blue.700" }}
              _active={{ bg: "blue.800" }}
              borderRadius="lg"
              px={4}
              fontSize="13px"
              fontWeight="600"
              boxShadow="xs"
              onClick={onAddParty}
            >
              <Plus size={15} style={{ marginRight: "6px" }} /> Add Party
            </Button>
          )}
        </HStack>

        {/* Content Body */}
        {isLoading ? (
          <Grid
            templateColumns={{
              base: "1fr",
              lg: "repeat(2, minmax(0, 1fr))",
            }}
            gap={4}
          >
            {[...Array(4)].map((_, i) => (
              <Box
                key={i}
                bg="white"
                p={5}
                borderRadius="xl"
                border="1px solid"
                borderColor="gray.200"
              >
                <HStack gap={3} mb={3}>
                  <Skeleton w="12" h="12" borderRadius="full" />
                  <Stack gap={2} flex={1}>
                    <Skeleton h="16px" w="60%" />
                    <Skeleton h="12px" w="40%" />
                  </Stack>
                </HStack>
                <Skeleton h="12px" w="90%" mt={4} />
              </Box>
            ))}
          </Grid>
        ) : partyCount === 0 ? (
          <Center
            bg="white"
            p={{ base: 8, md: 12 }}
            borderRadius="xl"
            border="1px border"
            borderColor="gray.200"
            flexDirection="column"
            textAlign="center"
          >
            <Center
              w="14"
              h="14"
              borderRadius="full"
              bg="gray.100"
              color="gray.400"
              mb={4}
            >
              <UserX size={28} />
            </Center>
            <Text fontSize="md" fontWeight="700" color="gray.800" mb={1}>
              No parties added yet
            </Text>
            <Text fontSize="sm" color="gray.500" maxW="400px" mb={5}>
              There are currently no parties attached to this {entityType}. Add
              parties to keep track of clients, opposing parties, and
              representation roles.
            </Text>
            {onAddParty && (
              <Button
                size="sm"
                bg="blue.600"
                color="white"
                _hover={{ bg: "blue.700" }}
                borderRadius="lg"
                px={4}
                onClick={onAddParty}
              >
                <Plus size={15} style={{ marginRight: "6px" }} /> Add First
                Party
              </Button>
            )}
          </Center>
        ) : (
          <Grid
            templateColumns={{
              base: "1fr",
              lg: partyCount === 1 ? "1fr" : "repeat(2, minmax(0, 1fr))",
            }}
            gap={4}
          >
            {parties.map((party) => {
              const role = roles.find((r) => r.matterPartyId === party.id);
              return (
                <PartyCard
                  key={party.id}
                  party={party}
                  role={role}
                  actions={
                    renderPartyActions
                      ? renderPartyActions(party, role)
                      : undefined
                  }
                />
              );
            })}
          </Grid>
        )}
      </VStack>
    </Box>
  );
};
