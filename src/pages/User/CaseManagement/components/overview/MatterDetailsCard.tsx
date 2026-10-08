import { Box, Grid, HStack, Text } from "@chakra-ui/react";
import { FileText } from "lucide-react";

import { MatterResponse } from "../../types/matter.types";
import { formatDate } from "../../utils/matterHelpers";
import { MatterStatusBadge, MatterTypeBadge } from "../MatterBadges";
import { OverviewCard } from "./OverviewCard";
import { OverviewField } from "./OverviewField";

interface MatterDetailsCardProps {
  matter: MatterResponse;
  courtCaseCount: number;
  partyCount: number;
  eventCount: number;
}

/**
 * Matter Details panel on the Matter Detail → Overview tab.
 *
 * Read-only: every value is derived from the already-loaded matter response and
 * its related collections, so no additional requests are made.
 */
export const MatterDetailsCard = ({
  matter,
  courtCaseCount,
  partyCount,
  eventCount,
}: MatterDetailsCardProps) => {
  const stats: Array<{ label: string; value: number }> = [
    { label: "Court Cases", value: courtCaseCount },
    { label: "Parties", value: partyCount },
    { label: "Events", value: eventCount },
  ];

  return (
    <OverviewCard
      title="Matter Details"
      description="Core information recorded for this matter."
      icon={FileText}
    >
      <Box
        bg="gray.50"
        border="1px solid"
        borderColor="gray.100"
        borderRadius="lg"
        px={4}
        py={3}
      >
        <HStack gap={{ base: 6, md: 10 }} flexWrap="wrap">
          {stats.map((stat) => (
            <HStack key={stat.label} gap={2} align="baseline" minW={0}>
              <Text fontSize="lg" fontWeight="700" color="gray.900">
                {stat.value}
              </Text>
              <Text
                fontSize="xs"
                fontWeight="600"
                color="gray.500"
                textTransform="uppercase"
                letterSpacing="0.04em"
              >
                {stat.label}
              </Text>
            </HStack>
          ))}
        </HStack>
      </Box>

      <Grid
        templateColumns={{
          base: "1fr",
          md: "repeat(2, minmax(0, 1fr))",
          lg: "repeat(3, minmax(0, 1fr))",
        }}
        gap={5}
        mt={5}
      >
        <OverviewField label="Matter Number" value={matter.matterNumber} mono />
        <OverviewField
          label="Type"
          value={<MatterTypeBadge type={matter.matterType} />}
        />
        <OverviewField
          label="Status"
          value={<MatterStatusBadge status={matter.status} />}
        />
        <OverviewField
          label="Current Court"
          value={matter.currentCourtCase?.courtName ?? matter.courtName ?? "-"}
        />
        <OverviewField
          label="Court Case Number"
          value={
            matter.currentCourtCase?.courtCaseNumber ??
            matter.courtCaseNumber ??
            "-"
          }
        />
        <OverviewField
          label="Filing Date"
          value={formatDate(matter.filingDate)}
        />
      </Grid>

      {matter.description && (
        <Box mt={5} pt={5} borderTop="1px solid" borderColor="gray.100">
          <Text
            fontSize="xs"
            fontWeight="600"
            color="gray.500"
            textTransform="uppercase"
            letterSpacing="0.04em"
            mb={2}
          >
            Description
          </Text>
          <Text fontSize="sm" color="gray.700" lineHeight="1.7">
            {matter.description}
          </Text>
        </Box>
      )}
    </OverviewCard>
  );
};
