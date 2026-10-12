import {
  Box,
  Button,
  HStack,
  Skeleton,
  Stack,
  Table as ChakraTable,
  Text,
} from "@chakra-ui/react";
import { ChevronLeft, ChevronRight, Scale } from "lucide-react";
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { CasePositioning, TodayEvent } from "../../types/dashboard.types";
import { MatterType } from "../../types/matter.types";
import { formatDate, matterTypeLabel } from "../../utils/matterHelpers";

interface CasePositioningTableProps {
  matters: CasePositioning[];
  todayEvents?: TodayEvent[];
  isLoading?: boolean;
}

const PAGE_SIZE = 5;

// ============================================================
// Deterministic Pastel Avatar Initials & Color
// ============================================================

const AVATAR_PALETTES = [
  { bg: "#EBF3FE", color: "#1D4ED8" }, // Blue
  { bg: "#FEF3C7", color: "#B45309" }, // Amber
  { bg: "#F3E8FF", color: "#7E22CE" }, // Purple
  { bg: "#FEE2E2", color: "#B91C1C" }, // Rose / Red
  { bg: "#ECFDF5", color: "#047857" }, // Emerald
  { bg: "#E0E7FF", color: "#4338CA" }, // Indigo
];

const getMatterInitials = (title: string): string => {
  if (!title) return "CM";
  const words = title.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return (words[0][0] + words[1][0]).toUpperCase();
};

const getAvatarColor = (identifier: string) => {
  let hash = 0;
  for (let i = 0; i < identifier.length; i++) {
    hash = identifier.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_PALETTES.length;
  return AVATAR_PALETTES[index];
};

// ============================================================
// Modern Status Badge with Dot Indicator
// ============================================================

const StatusDotBadge = ({ status }: { status: string | null | undefined }) => {
  const norm = (status || "").toUpperCase();

  let dotColor = "#9CA3AF";
  let bg = "#F3F4F6";
  let textColor = "#374151";
  let borderColor = "#E5E7EB";
  let label = status || "Unknown";

  if (norm === "ACTIVE") {
    dotColor = "#10B981";
    bg = "#ECFDF5";
    textColor = "#065F46";
    borderColor = "#A7F3D0";
    label = "ACTIVE";
  } else if (norm === "CLOSED" || norm === "WITHDRAWN") {
    dotColor = "#6B7280";
    bg = "#F3F4F6";
    textColor = "#374151";
    borderColor = "#E5E7EB";
    label = norm === "WITHDRAWN" ? "WITHDRAWN" : "CLOSED";
  } else if (norm === "DORMANT") {
    dotColor = "#F59E0B";
    bg = "#FFFBEB";
    textColor = "#92400E";
    borderColor = "#FDE68A";
    label = "DORMANT";
  } else if (norm === "ON_HOLD" || norm === "ON HOLD") {
    dotColor = "#3B82F6";
    bg = "#EFF6FF";
    textColor = "#1E40AF";
    borderColor = "#BFDBFE";
    label = "ON HOLD";
  } else if (norm === "JUDGMENT_AWAITED") {
    dotColor = "#F59E0B";
    bg = "#FFFBEB";
    textColor = "#B45309";
    borderColor = "#FDE68A";
    label = "JUDGMENT AWAITED";
  } else if (norm) {
    label = norm.replace(/_/g, " ");
  }

  return (
    <Box
      display="inline-flex"
      alignItems="center"
      gap={1.5}
      px={2.5}
      py={0.5}
      borderRadius="full"
      bg={bg}
      border="1px solid"
      borderColor={borderColor}
      flexShrink={0}
    >
      <Box w="6px" h="6px" borderRadius="full" bg={dotColor} />
      <Text
        fontSize="11px"
        fontWeight="600"
        color={textColor}
        letterSpacing="0.02em"
      >
        {label}
      </Text>
    </Box>
  );
};

// ============================================================
// Main Case Positioning Table Component
// ============================================================

export const CasePositioningTable = ({
  matters,
  isLoading = false,
}: CasePositioningTableProps) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(matters.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedMatters = useMemo(() => {
    const start = (safeCurrentPage - 1) * PAGE_SIZE;
    return matters.slice(start, start + PAGE_SIZE);
  }, [matters, safeCurrentPage]);

  const startRecord =
    matters.length === 0 ? 0 : (safeCurrentPage - 1) * PAGE_SIZE + 1;
  const endRecord = Math.min(safeCurrentPage * PAGE_SIZE, matters.length);

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
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} h="54px" borderRadius="lg" />
          ))}
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
      boxShadow="0 1px 3px rgba(0, 0, 0, 0.03)"
      overflow="hidden"
      w="100%"
      maxW="100%"
      minW={0}
    >
      {/* Scrollable container strictly for table */}
      <Box overflowX="auto" w="100%" maxW="100%" minW={0}>
        <ChakraTable.Root
          borderCollapse="separate"
          borderSpacing={0}
          w="100%"
          minW="720px"
        >
          {/* Table Header: 5 Distinct & Balanced Columns */}
          <ChakraTable.Header>
            <ChakraTable.Row bg="gray.50" borderBottom="1px solid" borderColor="gray.200">
              <ChakraTable.ColumnHeader
                w={{ base: "30%", md: "29%" }}
                py={3.5}
                px={4}
                fontSize="11px"
                fontWeight="700"
                color="gray.500"
                letterSpacing="0.05em"
                textTransform="uppercase"
              >
                Case Details
              </ChakraTable.ColumnHeader>
              <ChakraTable.ColumnHeader
                w={{ base: "22%", md: "21%" }}
                py={3.5}
                px={4}
                fontSize="11px"
                fontWeight="700"
                color="gray.500"
                letterSpacing="0.05em"
                textTransform="uppercase"
              >
                Court
              </ChakraTable.ColumnHeader>
              <ChakraTable.ColumnHeader
                w={{ base: "14%", md: "12%" }}
                py={3.5}
                px={4}
                fontSize="11px"
                fontWeight="700"
                color="gray.500"
                letterSpacing="0.05em"
                textTransform="uppercase"
              >
                Status
              </ChakraTable.ColumnHeader>
              <ChakraTable.ColumnHeader
                w={{ base: "17%", md: "19%" }}
                py={3.5}
                px={4}
                fontSize="11px"
                fontWeight="700"
                color="gray.500"
                letterSpacing="0.05em"
                textTransform="uppercase"
              >
                Last Hearing
              </ChakraTable.ColumnHeader>
              <ChakraTable.ColumnHeader
                w={{ base: "17%", md: "19%" }}
                py={3.5}
                px={4}
                fontSize="11px"
                fontWeight="700"
                color="gray.500"
                letterSpacing="0.05em"
                textTransform="uppercase"
              >
                Next Court Event
              </ChakraTable.ColumnHeader>
            </ChakraTable.Row>
          </ChakraTable.Header>

          {/* Table Body */}
          <ChakraTable.Body>
            {matters.length === 0 ? (
              <ChakraTable.Row>
                <ChakraTable.Cell colSpan={5} py={12} textAlign="center">
                  <Stack align="center" gap={2}>
                    <Box
                      w="10"
                      h="10"
                      borderRadius="full"
                      bg="gray.100"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      color="gray.400"
                    >
                      <Scale size={20} />
                    </Box>
                    <Text fontSize="sm" fontWeight="600" color="gray.700">
                      No cases found
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      Try adjusting your filters or search terms.
                    </Text>
                  </Stack>
                </ChakraTable.Cell>
              </ChakraTable.Row>
            ) : (
              paginatedMatters.map((matter) => {
                const initials = getMatterInitials(matter.matterTitle);
                const avatarStyle = getAvatarColor(
                  matter.matterNumber || matter.matterTitle
                );

                // Format days since last hearing if meaningful
                const daysAgoText =
                  matter.daysSinceLastHearing !== null &&
                  matter.daysSinceLastHearing !== undefined
                    ? matter.daysSinceLastHearing === 0
                      ? "Today"
                      : `${matter.daysSinceLastHearing} ${
                          matter.daysSinceLastHearing === 1 ? "day" : "days"
                        } ago`
                    : null;

                // Format next event location/judge subtitle
                const nextEventDetails = [
                  matter.nextEventCourtRoom
                    ? `Rm ${matter.nextEventCourtRoom}`
                    : null,
                  matter.nextEventJudge ? `Judge ${matter.nextEventJudge}` : null,
                ]
                  .filter(Boolean)
                  .join(" · ");

                return (
                  <ChakraTable.Row
                    key={matter.matterId}
                    data-group
                    role="button"
                    tabIndex={0}
                    aria-label={`View details for ${
                      matter.matterTitle || matter.matterNumber
                    }`}
                    borderBottom="1px solid"
                    borderColor="gray.100"
                    cursor="pointer"
                    onClick={() => navigate(`/cases/${matter.matterNumber}`)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        navigate(`/cases/${matter.matterNumber}`);
                      }
                    }}
                    bg="white"
                    _hover={{ bg: "#F8FAFC" }}
                    _focusVisible={{
                      outline: "2px solid",
                      outlineColor: "primary.500",
                      outlineOffset: "-2px",
                      bg: "#F8FAFC",
                    }}
                    transition="all 0.15s ease"
                  >
                    {/* Column 1: Case Details (Title, Number, subtle Type only) */}
                    <ChakraTable.Cell py={3.5} px={4} verticalAlign="middle">
                      <HStack gap={3} align="center">
                        <Box
                          w="36px"
                          h="36px"
                          borderRadius="lg"
                          bg={avatarStyle.bg}
                          color={avatarStyle.color}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          fontSize="xs"
                          fontWeight="700"
                          flexShrink={0}
                        >
                          {initials}
                        </Box>
                        <Stack gap={0.5} minW={0} flex={1}>
                          <Text
                            fontSize="sm"
                            fontWeight="600"
                            color="gray.900"
                            lineClamp={2}
                            title={matter.matterTitle}
                            _groupHover={{ color: "primary.600" }}
                            transition="color 0.15s ease"
                          >
                            {matter.matterTitle || "Untitled Matter"}
                          </Text>
                          <HStack
                            gap={1.5}
                            align="center"
                            fontSize="xs"
                            color="gray.500"
                            whiteSpace="nowrap"
                          >
                            <Text fontFamily="monospace" fontWeight="500">
                              {matter.matterNumber}
                            </Text>
                            {matter.matterType && (
                              <>
                                <Text color="gray.300">·</Text>
                                <Text>
                                  {matterTypeLabel(
                                    matter.matterType as MatterType
                                  )}
                                </Text>
                              </>
                            )}
                          </HStack>
                        </Stack>
                      </HStack>
                    </ChakraTable.Cell>

                    {/* Column 2: Court (Name only, wraps cleanly up to 2 lines) */}
                    <ChakraTable.Cell py={3.5} px={4} verticalAlign="middle">
                      <Text
                        fontSize="xs"
                        fontWeight="500"
                        color="gray.800"
                        lineClamp={2}
                        title={matter.courtName || undefined}
                      >
                        {matter.courtName || "—"}
                      </Text>
                    </ChakraTable.Cell>

                    {/* Column 3: Status (Compact badge with dot) */}
                    <ChakraTable.Cell py={3.5} px={4} verticalAlign="middle">
                      <StatusDotBadge
                        status={matter.matterStatus || matter.caseStatus}
                      />
                    </ChakraTable.Cell>

                    {/* Column 4: Last Hearing (Date, Type · Status, Days ago) */}
                    <ChakraTable.Cell py={3.5} px={4} verticalAlign="middle">
                      {matter.lastHearingDate ? (
                        <Stack gap={0.5}>
                          <Text
                            fontSize="xs"
                            fontWeight="600"
                            color="gray.800"
                            whiteSpace="nowrap"
                          >
                            {formatDate(matter.lastHearingDate)}
                          </Text>
                          <Text fontSize="11px" color="gray.500" lineClamp={1}>
                            {[matter.lastHearingType, matter.lastHearingStatus]
                              .filter(Boolean)
                              .join(" · ") || "Hearing"}
                            {matter.lastHearingOutcome
                              ? ` (${matter.lastHearingOutcome})`
                              : ""}
                          </Text>
                          {daysAgoText && (
                            <Text
                              fontSize="11px"
                              color={
                                matter.stale ? "amber.700" : "gray.500"
                              }
                              fontWeight={matter.stale ? "600" : "400"}
                            >
                              {daysAgoText}
                            </Text>
                          )}
                        </Stack>
                      ) : (
                        <Text fontSize="xs" color="gray.400">
                          —
                        </Text>
                      )}
                    </ChakraTable.Cell>

                    {/* Column 5: Next Court Event (Date, Type, Location/Judge) */}
                    <ChakraTable.Cell py={3.5} px={4} verticalAlign="middle">
                      {matter.nextEventDate ? (
                        <Stack gap={0.5}>
                          <Text
                            fontSize="xs"
                            fontWeight="600"
                            color="gray.800"
                            whiteSpace="nowrap"
                          >
                            {formatDate(matter.nextEventDate)}
                          </Text>
                          <Text
                            fontSize="11px"
                            color="blue.600"
                            fontWeight="500"
                            lineClamp={1}
                          >
                            {matter.nextEventType || "Event"}
                          </Text>
                          {nextEventDetails && (
                            <Text
                              fontSize="11px"
                              color="gray.500"
                              lineClamp={1}
                              title={nextEventDetails}
                            >
                              {nextEventDetails}
                            </Text>
                          )}
                        </Stack>
                      ) : (
                        <Text fontSize="xs" color="gray.400">
                          —
                        </Text>
                      )}
                    </ChakraTable.Cell>
                  </ChakraTable.Row>
                );
              })
            )}
          </ChakraTable.Body>
        </ChakraTable.Root>
      </Box>

      {/* Table Footer with Pagination */}
      {matters.length > 0 && (
        <HStack
          justify="space-between"
          align="center"
          px={5}
          py={3.5}
          borderTop="1px solid"
          borderColor="gray.100"
          bg="white"
          flexWrap="wrap"
          gap={3}
        >
          <Text fontSize="xs" color="gray.500">
            Showing{" "}
            <Text as="span" fontWeight="600" color="gray.700">
              {startRecord}
            </Text>{" "}
            to{" "}
            <Text as="span" fontWeight="600" color="gray.700">
              {endRecord}
            </Text>{" "}
            of{" "}
            <Text as="span" fontWeight="600" color="gray.700">
              {matters.length}
            </Text>{" "}
            cases
          </Text>

          {totalPages > 1 && (
            <HStack gap={1}>
              <Button
                variant="outline"
                size="xs"
                h="28px"
                w="28px"
                p={0}
                disabled={safeCurrentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                aria-label="Previous page"
              >
                <ChevronLeft size={14} />
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => {
                  const isActive = pageNum === safeCurrentPage;
                  return (
                    <Button
                      key={pageNum}
                      variant={isActive ? "primary" : "outline"}
                      size="xs"
                      h="28px"
                      w="28px"
                      p={0}
                      fontSize="xs"
                      fontWeight={isActive ? "700" : "500"}
                      bg={isActive ? "primary.500" : "white"}
                      color={isActive ? "white" : "gray.700"}
                      borderColor={isActive ? "primary.500" : "gray.200"}
                      _hover={
                        isActive
                          ? { bg: "primary.600" }
                          : { bg: "gray.50", borderColor: "gray.300" }
                      }
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                }
              )}

              <Button
                variant="outline"
                size="xs"
                h="28px"
                w="28px"
                p={0}
                disabled={safeCurrentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                aria-label="Next page"
              >
                <ChevronRight size={14} />
              </Button>
            </HStack>
          )}
        </HStack>
      )}
    </Box>
  );
};
