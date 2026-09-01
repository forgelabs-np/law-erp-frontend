import {
  Badge,
  Box,
  Button,
  HStack,
  Skeleton,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Calendar, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { parseApiDate } from "@/utils/nepaliDateUtils";

import {
  CaseHearingStatus as CaseHearingStatusType,
  HearingRecord,
} from "@/shared/types/scraper.types";
import { SectionCard } from "../ui";
import { HearingSourceBadge } from "./HearingSourceBadge";

interface CaseHearingStatusProps {
  data: CaseHearingStatusType | null;
  isLoading: boolean;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const CaseHearingStatus = ({
  data,
  isLoading,
  onRefresh,
  isRefreshing,
}: CaseHearingStatusProps) => {
  if (isLoading) {
    return <HearingStatusSkeleton />;
  }

  if (!data) {
    return (
      <SectionCard title="Hearing Status" icon={Calendar}>
        <Box py={8} textAlign="center">
          <Text fontSize="sm" color="gray.500">
            Hearing status not available
          </Text>
        </Box>
      </SectionCard>
    );
  }

  const { caseNoBs, courtName, caseNoInternal, upcoming, history } = data;

  return (
    <SectionCard
      title="Hearing Status"
      icon={Calendar}
      actions={
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          loading={isRefreshing}
        >
          <HStack gap={2}>
            <RefreshCw size={14} />
            <Text>Refresh</Text>
          </HStack>
        </Button>
      }
    >
      {/* Header */}
      <Box mb={6} pb={4} borderBottom="1px solid" borderColor="gray.100">
        <HStack gap={6} flexWrap="wrap">
          <Box>
            <Text
              fontSize="xs"
              fontWeight="600"
              color="gray.500"
              textTransform="uppercase"
              mb={1}
            >
              Case
            </Text>
            <Text fontSize="sm" fontWeight="600" color="gray.900">
              {caseNoBs || "-"}
            </Text>
          </Box>
          <Box>
            <Text
              fontSize="xs"
              fontWeight="600"
              color="gray.500"
              textTransform="uppercase"
              mb={1}
            >
              Court
            </Text>
            <Text fontSize="sm" fontWeight="600" color="gray.900">
              {courtName || "-"}
            </Text>
          </Box>
          <Box>
            <Text
              fontSize="xs"
              fontWeight="600"
              color="gray.500"
              textTransform="uppercase"
              mb={1}
            >
              Internal Case No.
            </Text>
            <Text
              fontSize="sm"
              fontWeight="600"
              color="gray.700"
              fontFamily="monospace"
            >
              {caseNoInternal}
            </Text>
          </Box>
        </HStack>
      </Box>

      {/* Upcoming Hearing */}
      {upcoming.length > 0 ? (
        <NextHearingCard hearing={upcoming[0]} />
      ) : (
        <Box
          p={6}
          bg="gray.50"
          borderRadius="lg"
          border="1px solid"
          borderColor="gray.100"
          mb={6}
          textAlign="center"
        >
          <Text fontSize="base" fontWeight="500" color="gray.700" mb={1}>
            No upcoming hearing found
          </Text>
          <Text fontSize="sm" color="gray.500">
            There are currently no upcoming hearings recorded for this case.
          </Text>
        </Box>
      )}

      {/* Hearing History */}
      {history.length > 0 ? (
        <HearingHistory history={history} />
      ) : (
        <Box py={4} textAlign="center">
          <Text fontSize="sm" color="gray.500">
            No hearing history available
          </Text>
        </Box>
      )}
    </SectionCard>
  );
};

// ============================================================
// Next Hearing Card
// ============================================================

interface NextHearingCardProps {
  hearing: HearingRecord;
}

const NextHearingCard = ({ hearing }: NextHearingCardProps) => {
  const adDate = parseApiDate(hearing.hearingDateAd);

  return (
    <Box
      p={6}
      bg="green.50"
      borderRadius="lg"
      border="1px solid"
      borderColor="green.200"
      mb={6}
    >
      <Text
        fontSize="xs"
        fontWeight="600"
        color="green.700"
        textTransform="uppercase"
        mb={3}
      >
        Next Hearing
      </Text>

      {/* Date */}
      <Text fontSize="2xl" fontWeight="700" color="green.800" mb={1}>
        {format(adDate, "d MMM yyyy")}
      </Text>
      <Text
        fontSize="lg"
        fontWeight="600"
        color="green.700"
        mb={4}
        fontFamily="monospace"
      >
        {hearing.hearingDateBs} BS
      </Text>

      {/* Details */}
      <Stack gap={2}>
        <Box>
          <Text
            fontSize="xs"
            fontWeight="600"
            color="gray.500"
            textTransform="uppercase"
          >
            Court
          </Text>
          <Text fontSize="sm" fontWeight="600" color="gray.900">
            {hearing.judgeName}
          </Text>
        </Box>

        <Box>
          <Text
            fontSize="xs"
            fontWeight="600"
            color="gray.500"
            textTransform="uppercase"
          >
            Subject
          </Text>
          <Text fontSize="sm" fontWeight="500" color="gray.800">
            {hearing.subject}
          </Text>
        </Box>

        <Box>
          <Text
            fontSize="xs"
            fontWeight="600"
            color="gray.500"
            textTransform="uppercase"
          >
            Order
          </Text>
          <Text fontSize="sm" fontWeight="500" color="gray.800">
            {hearing.orderType}
          </Text>
        </Box>

        <Box>
          <Text
            fontSize="xs"
            fontWeight="600"
            color="gray.500"
            textTransform="uppercase"
          >
            Source
          </Text>
          <HearingSourceBadge source={hearing.source} />
        </Box>
      </Stack>
    </Box>
  );
};

// ============================================================
// Hearing History
// ============================================================

interface HearingHistoryProps {
  history: HearingRecord[];
}

const HearingHistory = ({ history }: HearingHistoryProps) => {
  return (
    <Box>
      <Text fontSize="sm" fontWeight="600" color="gray.900" mb={4}>
        Hearing History
      </Text>
      <VStack gap={3} align="stretch" maxH="400px" overflowY="auto">
        {history.map((hearing, index) => (
          <HearingHistoryItem key={index} hearing={hearing} />
        ))}
      </VStack>
    </Box>
  );
};

// ============================================================
// Hearing History Item
// ============================================================

interface HearingHistoryItemProps {
  hearing: HearingRecord;
}

const HearingHistoryItem = ({ hearing }: HearingHistoryItemProps) => {
  const adDate = parseApiDate(hearing.hearingDateAd);

  return (
    <Box
      p={4}
      bg="gray.50"
      borderRadius="lg"
      border="1px solid"
      borderColor="gray.100"
    >
      <HStack justify="space-between" align="flex-start" mb={3}>
        <VStack align="stretch" gap={1}>
          <Text fontSize="base" fontWeight="600" color="gray.900">
            {format(adDate, "d MMM yyyy")}
          </Text>
          <Text
            fontSize="sm"
            fontWeight="500"
            color="gray.600"
            fontFamily="monospace"
          >
            {hearing.hearingDateBs}
          </Text>
        </VStack>
        <HearingSourceBadge source={hearing.source} />
      </HStack>

      <Stack gap={2}>
        <Box>
          <Text fontSize="xs" fontWeight="600" color="gray.500">
            Judge
          </Text>
          <Text fontSize="sm" fontWeight="500" color="gray.800">
            {hearing.judgeName}
          </Text>
        </Box>

        <Box>
          <Text fontSize="xs" fontWeight="600" color="gray.500">
            Subject
          </Text>
          <Text fontSize="sm" fontWeight="500" color="gray.800">
            {hearing.subject}
          </Text>
        </Box>

        <Box>
          <Text fontSize="xs" fontWeight="600" color="gray.500">
            Order
          </Text>
          <Text fontSize="sm" fontWeight="500" color="gray.800">
            {hearing.orderType}
          </Text>
        </Box>
      </Stack>
    </Box>
  );
};

// ============================================================
// Hearing Status Skeleton
// ============================================================

const HearingStatusSkeleton = () => {
  return (
    <SectionCard title="Hearing Status" icon={Calendar}>
      <Stack gap={4}>
        <Box h="40px" bg="gray.100" borderRadius="md" />
        <Box h="120px" bg="gray.100" borderRadius="md" />
        {[...Array(2)].map((_, i) => (
          <Box key={i} h="80px" bg="gray.100" borderRadius="md" />
        ))}
      </Stack>
    </SectionCard>
  );
};
