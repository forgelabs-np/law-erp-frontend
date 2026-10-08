import { Badge, Box, Center, HStack, Text, VStack } from "@chakra-ui/react";
import { Mail, Phone, Users, ShieldCheck } from "lucide-react";
import { useMemo } from "react";

import { CourtCaseRole, MatterParty } from "../../types/matter.types";
import { partyTypeLabel, representationLabel } from "../../utils/matterHelpers";
import { OverviewCard } from "./OverviewCard";

interface CasePartiesCardProps {
  /** Roles on the current court case (`courtCase.roles`). */
  roles: CourtCaseRole[];
  /** Parties already resolved by the page (`matter.parties` style list). */
  parties: MatterParty[];
}

const initialsOf = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

/**
 * Compact list of the parties attached to this court case together with
 * their role and representation. Mirrors the "Parties & Roles" tab using
 * the same already-loaded data.
 */
export const CasePartiesCard = ({ roles, parties }: CasePartiesCardProps) => {
  const entries = useMemo(
    () =>
      parties.map((party) => ({
        party,
        role: roles.find((item) => item.matterPartyId === party.id),
      })),
    [parties, roles]
  );

  return (
    <OverviewCard
      title="Parties"
      description={`${entries.length} ${
        entries.length === 1 ? "party" : "parties"
      } on this court case`}
      icon={Users}
    >
      {entries.length === 0 ? (
        <Center flexDirection="column" gap={2} py={6}>
          <Center
            w="10"
            h="10"
            borderRadius="full"
            bg="gray.50"
            border="1px solid"
            borderColor="gray.200"
            color="gray.400"
          >
            <Users size={18} />
          </Center>
          <Text fontSize="13px" fontWeight="600" color="gray.700">
            No parties on this case
          </Text>
          <Text fontSize="12px" color="gray.500" textAlign="center">
            No roles are assigned on this court case yet.
          </Text>
        </Center>
      ) : (
        <VStack gap={3} align="stretch">
          {entries.map(({ party, role }) => (
            <HStack
              key={party.id}
              gap={3}
              align="flex-start"
              p={3}
              borderRadius="xl"
              border="1px solid"
              borderColor="gray.200"
              bg="gray.50"
              _hover={{ borderColor: "gray.300", bg: "white" }}
              transition="all 0.15s ease"
            >
              <Center
                w="9"
                h="9"
                borderRadius="full"
                bg="blue.50"
                color="blue.700"
                fontSize="11px"
                fontWeight="700"
                border="1px solid"
                borderColor="blue.200"
                flexShrink={0}
              >
                {initialsOf(party.fullName) || "?"}
              </Center>

              <Box minW={0} flex={1}>
                <Text
                  fontSize="13px"
                  fontWeight="700"
                  color="gray.900"
                  lineHeight="1.4"
                  wordBreak="break-word"
                >
                  {party.fullName}
                </Text>

                <HStack gap={1.5} flexWrap="wrap" mt={1}>
                  {role && (
                    <Badge
                      bg="blue.50"
                      color="blue.700"
                      border="1px solid"
                      borderColor="blue.200"
                      px={2}
                      py={0.5}
                      borderRadius="md"
                      fontSize="10px"
                      fontWeight="600"
                    >
                      {partyTypeLabel(role.roleType)}
                    </Badge>
                  )}
                  {role && (
                    <Badge
                      bg={
                        role.representation === "OPPOSING"
                          ? "orange.50"
                          : "purple.50"
                      }
                      color={
                        role.representation === "OPPOSING"
                          ? "orange.700"
                          : "purple.700"
                      }
                      border="1px solid"
                      borderColor={
                        role.representation === "OPPOSING"
                          ? "orange.200"
                          : "purple.200"
                      }
                      px={2}
                      py={0.5}
                      borderRadius="md"
                      fontSize="10px"
                      fontWeight="600"
                    >
                      {representationLabel(role.representation)}
                    </Badge>
                  )}
                  {party.isOurClient && (
                    <Badge
                      bg="green.50"
                      color="green.700"
                      border="1px solid"
                      borderColor="green.200"
                      px={2}
                      py={0.5}
                      borderRadius="md"
                      fontSize="10px"
                      fontWeight="600"
                      display="inline-flex"
                      alignItems="center"
                      gap={0.5}
                    >
                      <ShieldCheck size={10} />
                      Our Client
                    </Badge>
                  )}
                </HStack>

                {(party.mobileNo || party.email) && (
                  <VStack
                    gap={1}
                    align="stretch"
                    mt={2}
                    pt={2}
                    borderTop="1px solid"
                    borderColor="gray.200/60"
                  >
                    {party.mobileNo && (
                      <HStack gap={1.5} color="gray.600" fontSize="11px">
                        <Phone size={11} style={{ flexShrink: 0 }} />
                        <Text fontWeight="500">{party.mobileNo}</Text>
                      </HStack>
                    )}
                    {party.email && (
                      <HStack
                        gap={1.5}
                        color="gray.600"
                        fontSize="11px"
                        minW={0}
                      >
                        <Mail size={11} style={{ flexShrink: 0 }} />
                        <Text
                          fontWeight="500"
                          wordBreak="break-word"
                          title={party.email}
                        >
                          {party.email}
                        </Text>
                      </HStack>
                    )}
                  </VStack>
                )}
              </Box>
            </HStack>
          ))}
        </VStack>
      )}
    </OverviewCard>
  );
};
