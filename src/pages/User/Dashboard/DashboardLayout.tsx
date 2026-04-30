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
    <VStack gap={8} alignItems="stretch">
      {/* ── Header ── */}
      <Stack gap={4}>
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
        {/* <HStack flexWrap="wrap" gap={3} justify="space-between">
          <InputGroup
            startElement={<SearchIcon color="gray.400" />}
            maxW={{ base: "100%", md: "320px" }}
          >
            <Input
              bg="white"
              borderRadius="16px"
              placeholder="Search..."
              value={searchText}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSearchText(e.target.value)
              }
            />
          </InputGroup>
          <HStack gap={3} wrap="wrap">
            <Button variant="outline" borderRadius="16px">
              <SearchIcon /> Filters
            </Button>
            <Button bg="gray.900" color="white" borderRadius="16px">
              <AddIcon /> Add customer
            </Button>
          </HStack>
        </HStack> */}
      </Stack>

      {/* ── Stat Cards ── */}
      <HStack gap={4} flexWrap="wrap" alignItems="stretch">
        {statCards.map((card) => (
          <StatCard key={card.id} data={card} />
        ))}
      </HStack>

      <Grid
        templateColumns={{ base: "1fr", lg: "380px 1fr" }}
        gap={6}
        alignItems="start"
      >
        <VStack gap={5} alignItems="stretch">
          <CalendarSection {...calendar} />
          <UrgentDeadlines {...urgentDeadlines} />
        </VStack>

        <ActiveMattersTable {...activeMatters} />
      </Grid>
    </VStack>
  );
};
