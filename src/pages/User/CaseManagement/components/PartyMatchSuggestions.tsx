import {
  Badge,
  Box,
  Button,
  HStack,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";

import { PartyMatchResult, MatchConfidence } from "../types/case.types";

interface PartyMatchSuggestionsProps {
  matches: PartyMatchResult[];
  onSelectMatch: (match: PartyMatchResult) => void;
  onDismiss: () => void;
}

const CONFIDENCE_COLORS: Record<MatchConfidence, string> = {
  HIGH: "green",
  MEDIUM: "yellow",
  LOW: "gray",
};

export const PartyMatchSuggestions = ({
  matches,
  onSelectMatch,
  onDismiss,
}: PartyMatchSuggestionsProps) => {
  if (matches.length === 0) return null;

  const highConfidenceMatch = matches.find((m) => m.confidence === "HIGH");
  const mediumConfidenceMatches = matches.filter(
    (m) => m.confidence === "MEDIUM"
  );

  return (
    <VStack align="stretch" gap={3}>
      {/* High confidence match - auto-applied */}
      {highConfidenceMatch && (
        <Box
          p={3}
          bg="green.50"
          border="1px solid"
          borderColor="green.200"
          borderRadius="md"
        >
          <HStack justifyContent="space-between" align="center">
            <Stack gap={1}>
              <Text fontSize="sm" fontWeight="600" color="green.700">
                Matched to existing{" "}
                {highConfidenceMatch.sourceType === "CLIENT"
                  ? "client"
                  : "party"}
                : {highConfidenceMatch.fullName}
              </Text>
              <Text fontSize="xs" color="green.600">
                {highConfidenceMatch.mobileNo &&
                  `Phone: ${highConfidenceMatch.mobileNo}`}
                {highConfidenceMatch.mobileNo &&
                  highConfidenceMatch.email &&
                  " • "}
                {highConfidenceMatch.email &&
                  `Email: ${highConfidenceMatch.email}`}
              </Text>
            </Stack>
            <HStack gap={2}>
              <Badge
                bg="green.100"
                color="green.700"
                fontSize="xs"
                fontWeight="600"
              >
                HIGH CONFIDENCE
              </Badge>
              <Button
                size="xs"
                variant="ghost"
                onClick={() => onSelectMatch(highConfidenceMatch)}
              >
                Use
              </Button>
              <Button size="xs" variant="ghost" onClick={() => onDismiss()}>
                Dismiss
              </Button>
            </HStack>
          </HStack>
        </Box>
      )}

      {/* Medium confidence matches - suggestions */}
      {mediumConfidenceMatches.length > 0 && (
        <Box
          p={3}
          bg="yellow.50"
          border="1px solid"
          borderColor="yellow.200"
          borderRadius="md"
        >
          <Text fontSize="sm" fontWeight="600" color="yellow.700" mb={2}>
            Possible matches found:
          </Text>
          <VStack align="stretch" gap={2}>
            {mediumConfidenceMatches.map((match) => (
              <HStack
                key={match.sourceId}
                justifyContent="space-between"
                align="center"
                p={2}
                bg="white"
                borderRadius="md"
                border="1px solid"
                borderColor="yellow.100"
              >
                <Stack gap={0}>
                  <Text fontSize="sm" fontWeight="500">
                    {match.fullName}
                  </Text>
                  <Text fontSize="xs" color="gray.600">
                    {match.sourceType === "CLIENT" ? "Client" : "Party"} •{" "}
                    {match.mobileNo || match.email || "No contact info"}
                  </Text>
                </Stack>
                <HStack gap={2}>
                  <Badge
                    bg="yellow.100"
                    color="yellow.700"
                    fontSize="xs"
                    fontWeight="600"
                  >
                    MEDIUM
                  </Badge>
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => onSelectMatch(match)}
                  >
                    Link
                  </Button>
                </HStack>
              </HStack>
            ))}
          </VStack>
        </Box>
      )}
    </VStack>
  );
};
