import { Box, Grid, HStack, Stack, Text, VStack } from "@chakra-ui/react";

import {
  ActiveMattersTable,
  ActiveMattersTableData,
} from "./ActiveMattersTable";
import { CalendarSection, CalendarSectionData } from "./CalendarSection";
import { StatCard, StatCardData } from "./StatCard";
import { UrgentDeadlines, UrgentDeadlinesData } from "./UrgentDeadlines";

interface DashboardLayoutProps {
  title: string;
  subtitle: string;
  statCards: StatCardData[];
  calendar: CalendarSectionData;
  urgentDeadlines: UrgentDeadlinesData;
  activeMatters: ActiveMattersTableData;
}

export const DashboardLayout = ({
  title,
  // subtitle,
  statCards,
  calendar,
  urgentDeadlines,
  activeMatters,
}: DashboardLayoutProps) => {
  // const [searchText, setSearchText] = useState("");

  return (
    <VStack gap={8} alignItems="stretch" w="100%" maxW="100%" minW={0}>
      {/* ── Header ── */}
      <Stack gap={4} w="100%" minW={0}>
        <HStack
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={4}
        >
          <Box>
            <Text textStyle="xl" fontWeight={700}>
              {title}
            </Text>
            {/* <Text opacity={0.7} mt={1} fontSize="sm">
              {subtitle}
            </Text> */}
          </Box>
        </HStack>
      </Stack>

      {/* ── Stat Cards ── */}
      <HStack gap={4} flexWrap="wrap" alignItems="stretch" w="100%" minW={0}>
        {statCards.map((card) => (
          <StatCard key={card.id} data={card} />
        ))}
      </HStack>

      <Grid
        templateColumns={{ base: "1fr", lg: "380px 1fr" }}
        gap={6}
        alignItems="start"
        w="100%"
        maxW="100%"
        minW={0}
      >
        <VStack gap={5} alignItems="stretch" minW={0}>
          <CalendarSection {...calendar} />
          <UrgentDeadlines {...urgentDeadlines} />
        </VStack>

        <Box minW={0} w="100%" maxW="100%">
          <ActiveMattersTable {...activeMatters} />
        </Box>
      </Grid>
    </VStack>
  );
};
