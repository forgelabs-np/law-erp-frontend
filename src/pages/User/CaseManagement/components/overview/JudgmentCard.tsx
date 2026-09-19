import { Box, Center, HStack, Stack, Text } from "@chakra-ui/react";
import { CalendarClock, Gavel } from "lucide-react";

import { CourtCase } from "../../types/matter.types";
import { formatDate } from "../../utils/matterHelpers";
import { OverviewCard } from "./OverviewCard";

interface JudgmentCardProps {
  courtCase: CourtCase;
}

/**
 * Judgment summary for the Overview tab. Renders only when the court case
 * already carries judgment data.
 */
export const JudgmentCard = ({ courtCase }: JudgmentCardProps) => {
  return (
    <OverviewCard title="Judgment" icon={Gavel}>
      <Box
        p={{ base: 4, md: 5 }}
        bg="green.50"
        border="1px solid"
        borderColor="green.200"
        borderRadius="lg"
      >
        <HStack gap={3} align="center" mb={2} flexWrap="wrap">
          <Center
            w="8"
            h="8"
            borderRadius="lg"
            bg="green.100"
            color="green.700"
            flexShrink={0}
          >
            <Gavel size={15} />
          </Center>
          <Text fontSize="13px" fontWeight="700" color="green.800">
            Delivered on {formatDate(courtCase.judgmentDate)}
          </Text>
        </HStack>

        {courtCase.appealDeadline && (
          <HStack gap={2} mb={2} color="green.700">
            <CalendarClock size={14} />
            <Text fontSize="12px" fontWeight="600">
              Appeal deadline: {formatDate(courtCase.appealDeadline)}
            </Text>
          </HStack>
        )}

        {courtCase.judgmentSummary && (
          <Stack gap={0}>
            <Text fontSize="13px" color="gray.700" lineHeight="1.65">
              {courtCase.judgmentSummary}
            </Text>
          </Stack>
        )}
      </Box>
    </OverviewCard>
  );
};
