import {
  Badge,
  Box,
  Button,
  HStack,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { AlertTriangle, ArrowRight, CheckCircle2, Clock } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

import { CasePositioning } from "../../types/dashboard.types";

interface StaleMattersPanelProps {
  matters: CasePositioning[];
  staleCount?: number;
  isLoading?: boolean;
}

export const StaleMattersPanel = ({
  matters,
  staleCount,
  isLoading = false,
}: StaleMattersPanelProps) => {
  const navigate = useNavigate();

  // Use backend stats.staleCount if provided, fallback to array length
  const displayCount = staleCount !== undefined ? staleCount : matters.length;

  if (isLoading) {
    return (
      <Box
        bg="white"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="xl"
        p={5}
        boxShadow="0 1px 3px rgba(0, 0, 0, 0.03)"
      >
        <Stack gap={3}>
          <Skeleton h="18px" w="120px" borderRadius="md" />
          <Skeleton h="50px" w="100%" borderRadius="lg" />
          <Skeleton h="50px" w="100%" borderRadius="lg" />
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="xl"
      p={5}
      boxShadow="0 1px 3px rgba(0, 0, 0, 0.03)"
      w="100%"
      minW={0}
    >
      {/* Header */}
      <HStack justify="space-between" align="center" mb={3.5}>
        <HStack gap={2} align="center">
          <Box
            w="26px"
            h="26px"
            borderRadius="md"
            bg="amber.50"
            color="amber.600"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <AlertTriangle size={14} />
          </Box>
          <Text fontSize="sm" fontWeight="700" color="gray.900">
            Stale Matters
          </Text>
          {displayCount > 0 && (
            <Badge
              colorPalette="amber"
              variant="subtle"
              size="xs"
              borderRadius="full"
            >
              {displayCount}
            </Badge>
          )}
        </HStack>

        <Button
          variant="ghost"
          size="xs"
          color="gray.500"
          _hover={{ color: "primary.600", bg: "transparent" }}
          onClick={() => navigate("/stale-matters")}
          p={0}
          h="auto"
          fontSize="xs"
        >
          View all
          <ArrowRight size={12} />
        </Button>
      </HStack>

      {/* Stale List or Empty State */}
      {matters.length === 0 ? (
        <Box
          py={6}
          px={3}
          bg="green.50"
          border="1px solid"
          borderColor="green.200"
          borderRadius="lg"
          textAlign="center"
        >
          <Box
            w="8"
            h="8"
            borderRadius="full"
            bg="green.100"
            color="green.700"
            display="flex"
            alignItems="center"
            justifyContent="center"
            mx="auto"
            mb={2}
          >
            <CheckCircle2 size={16} />
          </Box>
          <Text fontSize="xs" fontWeight="600" color="green.800" mb={0.5}>
            No stale matters
          </Text>
          <Text fontSize="11px" color="green.600">
            All matters are currently up to date.
          </Text>
        </Box>
      ) : (
        <Stack gap={2.5}>
          {matters.slice(0, 5).map((matter) => (
            <Box
              key={matter.matterId}
              p={3}
              bg="amber.50"
              border="1px solid"
              borderColor="amber.200"
              borderRadius="lg"
              cursor="pointer"
              onClick={() => navigate(`/cases/${matter.matterNumber}`)}
              _hover={{ borderColor: "amber.400", bg: "amber.100" }}
              transition="all 0.15s ease"
            >
              <HStack justify="space-between" align="flex-start" mb={1}>
                <Text
                  fontSize="xs"
                  fontWeight="600"
                  color="gray.900"
                  lineClamp={1}
                  flex={1}
                >
                  {matter.matterTitle}
                </Text>
                <Badge
                  colorPalette="amber"
                  size="xs"
                  fontSize="10px"
                  fontWeight="700"
                  borderRadius="md"
                  px={1.5}
                >
                  {matter.daysSinceLastHearing !== null
                    ? `${matter.daysSinceLastHearing}d`
                    : "Stale"}
                </Badge>
              </HStack>

              <HStack
                justify="space-between"
                align="center"
                fontSize="11px"
                color="gray.600"
              >
                <Text fontFamily="monospace" color="gray.500">
                  {matter.matterNumber}
                </Text>
                {matter.courtName && (
                  <Text color="gray.600" lineClamp={1}>
                    {matter.courtName}
                  </Text>
                )}
              </HStack>

              <HStack gap={1} mt={1.5} color="amber.800" fontSize="11px">
                <Clock size={11} />
                <Text fontWeight="500">
                  {matter.daysSinceLastHearing !== null
                    ? `No hearing in ${matter.daysSinceLastHearing} days`
                    : "No hearing recorded"}
                </Text>
              </HStack>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
};
