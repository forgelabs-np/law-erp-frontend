import {
  Badge,
  Box,
  Center,
  Grid,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Mail, MapPin, Phone, User, ShieldCheck } from "lucide-react";
import { CourtCaseRole, MatterParty } from "../types/matter.types";
import { partyTypeLabel, representationLabel } from "../utils/matterHelpers";

interface PartyCardProps {
  party: MatterParty;
  role?: CourtCaseRole;
  actions?: React.ReactNode;
}

const initialsOf = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

export const PartyCard = ({ party, role, actions }: PartyCardProps) => {
  const roleType = role?.roleType;
  const representation = role?.representation;

  return (
    <Box
      bg="white"
      borderRadius="xl"
      border="1px solid"
      borderColor="gray.200"
      boxShadow="sm"
      p={{ base: 4, sm: 5 }}
      transition="all 0.2s ease"
      _hover={{
        borderColor: "gray.300",
        boxShadow: "md",
      }}
      position="relative"
    >
      <VStack align="stretch" gap={4}>
        {/* Header Section: Avatar, Identity, Badges & Actions */}
        <HStack
          justify="space-between"
          align="flex-start"
          gap={3}
          flexWrap="nowrap"
        >
          <HStack gap={3.5} align="flex-start" minW={0} flex={1}>
            <Center
              w={{ base: "10", sm: "12" }}
              h={{ base: "10", sm: "12" }}
              borderRadius="full"
              bg="blue.50"
              color="blue.700"
              fontSize={{ base: "xs", sm: "sm" }}
              fontWeight="700"
              border="1px solid"
              borderColor="blue.200"
              flexShrink={0}
            >
              {initialsOf(party.fullName) || <User size={20} />}
            </Center>

            <VStack align="flex-start" gap={1.5} minW={0} flex={1}>
              <HStack gap={2} flexWrap="wrap" align="center">
                <Text
                  fontSize={{ base: "md", sm: "16px" }}
                  fontWeight="700"
                  color="gray.900"
                  lineHeight="1.3"
                  wordBreak="break-word"
                >
                  {party.fullName}
                </Text>
                {party.isOurClient && (
                  <Badge
                    bg="green.50"
                    color="green.700"
                    border="1px solid"
                    borderColor="green.200"
                    px={2.5}
                    py={0.5}
                    borderRadius="full"
                    fontSize="11px"
                    fontWeight="600"
                    display="inline-flex"
                    alignItems="center"
                    gap={1}
                  >
                    <ShieldCheck size={12} />
                    Our Client
                  </Badge>
                )}
              </HStack>

              {/* Badges Row */}
              <HStack gap={2} flexWrap="wrap">
                {roleType && (
                  <Badge
                    bg="blue.50"
                    color="blue.700"
                    border="1px solid"
                    borderColor="blue.200"
                    px={2.5}
                    py={0.5}
                    borderRadius="md"
                    fontSize="11px"
                    fontWeight="600"
                    letterSpacing="0.02em"
                  >
                    {partyTypeLabel(roleType)}
                  </Badge>
                )}
                {representation && (
                  <Badge
                    bg={
                      representation === "OPPOSING" ? "orange.50" : "purple.50"
                    }
                    color={
                      representation === "OPPOSING"
                        ? "orange.700"
                        : "purple.700"
                    }
                    border="1px solid"
                    borderColor={
                      representation === "OPPOSING"
                        ? "orange.200"
                        : "purple.200"
                    }
                    px={2.5}
                    py={0.5}
                    borderRadius="md"
                    fontSize="11px"
                    fontWeight="600"
                  >
                    {representationLabel(representation)}
                  </Badge>
                )}
                {party.clientId && (
                  <Badge
                    bg="gray.100"
                    color="gray.700"
                    border="1px solid"
                    borderColor="gray.200"
                    px={2}
                    py={0.5}
                    borderRadius="md"
                    fontSize="11px"
                    fontWeight="500"
                  >
                    Linked Client
                  </Badge>
                )}
              </HStack>
            </VStack>
          </HStack>

          {actions && (
            <HStack gap={1} flexShrink={0}>
              {actions}
            </HStack>
          )}
        </HStack>

        {/* Details Grid */}
        {(party.mobileNo || party.email || party.address) && (
          <Box pt={3} borderTop="1px solid" borderColor="gray.100">
            <Grid
              templateColumns={{
                base: "1fr",
                sm:
                  party.email && party.mobileNo
                    ? "repeat(2, minmax(0, 1fr))"
                    : "1fr",
              }}
              gap={3}
            >
              {/* Contact Information */}
              {party.email && (
                <VStack align="flex-start" gap={0.5} minW={0}>
                  <Text
                    fontSize="11px"
                    fontWeight="600"
                    color="gray.400"
                    textTransform="uppercase"
                    letterSpacing="0.04em"
                  >
                    Contact Email
                  </Text>
                  <HStack gap={1.5} color="gray.700" minW={0} w="100%">
                    <Mail size={13} style={{ flexShrink: 0 }} />
                    <Text
                      fontSize="13px"
                      fontWeight="500"
                      wordBreak="break-word"
                      title={party.email}
                    >
                      {party.email}
                    </Text>
                  </HStack>
                </VStack>
              )}

              {party.mobileNo && (
                <VStack align="flex-start" gap={0.5} minW={0}>
                  <Text
                    fontSize="11px"
                    fontWeight="600"
                    color="gray.400"
                    textTransform="uppercase"
                    letterSpacing="0.04em"
                  >
                    Phone / Mobile
                  </Text>
                  <HStack gap={1.5} color="gray.700" minW={0}>
                    <Phone size={13} style={{ flexShrink: 0 }} />
                    <Text fontSize="13px" fontWeight="500">
                      {party.mobileNo}
                    </Text>
                  </HStack>
                </VStack>
              )}

              {party.address && (
                <VStack
                  align="flex-start"
                  gap={0.5}
                  gridColumn={{ sm: "1 / -1" }}
                  minW={0}
                >
                  <Text
                    fontSize="11px"
                    fontWeight="600"
                    color="gray.400"
                    textTransform="uppercase"
                    letterSpacing="0.04em"
                  >
                    Address
                  </Text>
                  <HStack
                    gap={1.5}
                    color="gray.700"
                    align="flex-start"
                    minW={0}
                  >
                    <MapPin
                      size={13}
                      style={{ flexShrink: 0, marginTop: "2px" }}
                    />
                    <Text
                      fontSize="13px"
                      fontWeight="500"
                      wordBreak="break-word"
                    >
                      {party.address}
                    </Text>
                  </HStack>
                </VStack>
              )}
            </Grid>
          </Box>
        )}
      </VStack>
    </Box>
  );
};
