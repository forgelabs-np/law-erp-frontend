import {
  Box,
  Button,
  Grid,
  HStack,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, ExternalLink } from "lucide-react";

import { useGetStaleMattersQuery } from "../api/matter.api";
import { StaleMatterFilters } from "../types/matter.types";
import { matterStatusLabel, matterTypeLabel } from "../utils/matterHelpers";
import { MatterStatusBadge, MatterTypeBadge } from "../components/MatterBadges";
import { FieldSelect } from "../components/ui";

const DEFAULT_FILTERS: StaleMatterFilters = { days: 90, page: 0, size: 20 };

const DAYS_OPTIONS = [30, 60, 90, 120, 180, 365];

const StaleMattersPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<StaleMatterFilters>(DEFAULT_FILTERS);

  const { data, isLoading } = useGetStaleMattersQuery(filters);

  const items = data?.content ?? [];
  const totalElements = data?.totalElements ?? 0;

  return (
    <Stack gap={6} padding={8}>
      <HStack
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={4}
      >
        <Stack gap={2}>
          <Text textStyle="heading_4">Stale / Long Pending Matters</Text>
          <Text textStyle="paragraph_regular" color="gray.500">
            Matters without a real Peshi for a long time
          </Text>
        </Stack>

        <HStack gap={2}>
          <Text fontSize="sm" color="gray.500">
            No Peshi for
          </Text>
          <Box w="120px">
            <FieldSelect
              value={String(filters.days ?? 90)}
              onChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  days: Number(value),
                  page: 0,
                }))
              }
            >
              {DAYS_OPTIONS.map((days) => (
                <option key={days} value={days}>
                  {days} days
                </option>
              ))}
            </FieldSelect>
          </Box>
        </HStack>
      </HStack>

      {isLoading ? (
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
          {[...Array(4)].map((_, i) => (
            <Box key={i} h="140px" bg="gray.100" borderRadius="lg" />
          ))}
        </Grid>
      ) : items.length === 0 ? (
        <VStack py={14} gap={3}>
          <Clock size={40} color="#10b981" />
          <Text fontSize="lg" fontWeight="500" color="gray.600">
            No stale matters
          </Text>
          <Text fontSize="sm" color="gray.500">
            All matters have had a Peshi within the selected period.
          </Text>
        </VStack>
      ) : (
        <>
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
            {items.map((matter) => (
              <Box
                key={matter.id}
                p={5}
                bg="white"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="lg"
                boxShadow="sm"
              >
                <HStack justify="space-between" align="flex-start" gap={3}>
                  <Stack gap={2} minW={0}>
                    <HStack gap={2} flexWrap="wrap">
                      <MatterTypeBadge type={matter.matterType} />
                      <MatterStatusBadge status={matter.status} />
                    </HStack>
                    <Text
                      fontSize="sm"
                      fontWeight="600"
                      fontFamily="monospace"
                      color="blue.600"
                      cursor="pointer"
                      onClick={() => navigate(`/cases/${matter.matterNumber}`)}
                    >
                      {matter.matterNumber}
                    </Text>
                    <Text
                      fontSize="md"
                      fontWeight="600"
                      color="gray.900"
                      lineClamp={2}
                    >
                      {matter.title}
                    </Text>
                    <Text fontSize="xs" color="gray.500" fontFamily="monospace">
                      {matter.currentCourtCaseRef}
                    </Text>
                  </Stack>
                  <Box textAlign="right" flexShrink={0}>
                    <HStack gap={1} color="red.600" justifyContent="flex-end">
                      <Clock size={16} />
                      <Text fontSize="2xl" fontWeight="700">
                        {matter.daysSinceLastPeshi}
                      </Text>
                    </HStack>
                    <Text fontSize="xs" color="gray.500">
                      days since last Peshi
                    </Text>
                  </Box>
                </HStack>

                <HStack
                  justify="space-between"
                  mt={4}
                  pt={4}
                  borderTop="1px solid"
                  borderColor="gray.100"
                >
                  <Text fontSize="xs" color="gray.500">
                    {matterTypeLabel(matter.matterType)} ·{" "}
                    {matterStatusLabel(matter.status)}
                  </Text>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => navigate(`/cases/${matter.matterNumber}`)}
                  >
                    <ExternalLink size={12} /> Open Matter
                  </Button>
                </HStack>
              </Box>
            ))}
          </Grid>

          {/* Pagination */}
          <HStack justify="space-between" align="center" pt={2}>
            <Text fontSize="sm" color="gray.500">
              {totalElements} stale {totalElements === 1 ? "matter" : "matters"}
            </Text>
            <HStack gap={2}>
              <Button
                variant="outline"
                size="sm"
                disabled={(filters.page ?? 0) === 0}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    page: (prev.page ?? 0) - 1,
                  }))
                }
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={(filters.page ?? 0) + 1 >= (data?.totalPages ?? 1)}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    page: (prev.page ?? 0) + 1,
                  }))
                }
              >
                Next
              </Button>
            </HStack>
          </HStack>
        </>
      )}
    </Stack>
  );
};

export default StaleMattersPage;
