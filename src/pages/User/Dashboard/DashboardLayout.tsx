import {
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  Input,
  InputGroup,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ChangeEvent, useMemo, useState } from "react";

import { AddIcon } from "@/assets/svgs";
import { SearchIcon } from "@/shared/assets/svg";
export interface PipelineCardData {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  comments: number;
  attachments: number;
  manager: string;
  address: string;
  highlight?: boolean;
}

export interface PipelineColumnData {
  id: string;
  name: string;
  cards: PipelineCardData[];
}

export interface SummaryItem {
  id: string;
  title: string;
  value: string;
  label: string;
  accent?: boolean;
}

export interface NewCustomerEntry {
  label: string;
  value: number;
  active: boolean;
}

interface DashboardLayoutProps {
  title: string;
  subtitle: string;
  newCustomers: NewCustomerEntry[];
  dealSuccessRate: number;
  summaryItems: SummaryItem[];
  pipelineColumns: PipelineColumnData[];
}

const sectionBoxProps = {
  bg: "white",
  borderRadius: "24px",
  p: { base: 5, md: 6 },
  boxShadow: "0px 12px 30px rgba(15, 23, 42, 0.04)",
  border: "1px solid",
  borderColor: "gray.100",
};

const getFilteredCards = (
  columns: PipelineColumnData[],
  query: string,
  sortAsc: boolean
) => {
  return columns.map((column) => {
    const cards = column.cards
      .filter((card) => {
        if (!query.trim()) return true;
        const normalized = query.toLowerCase();
        return [card.title, card.description, card.manager, card.address]
          .join(" ")
          .toLowerCase()
          .includes(normalized);
      })
      .sort((a, b) => {
        const dateA = new Date(a.dueDate).getTime();
        const dateB = new Date(b.dueDate).getTime();
        return sortAsc ? dateA - dateB : dateB - dateA;
      });

    return { ...column, cards };
  });
};

const PipelineCard = ({ card }: { card: PipelineCardData }) => {
  const bg = card.highlight ? "gray.900" : "white";
  const color = card.highlight ? "white" : "gray.800";
  const borderColor = card.highlight ? "transparent" : "gray.200";

  return (
    <Box
      bg={bg}
      color={color}
      borderRadius="20px"
      border="1px solid"
      borderColor={borderColor}
      p={5}
      minH="190px"
    >
      <HStack justifyContent="space-between" mb={4} alignItems="flex-start">
        <Text fontSize="md" fontWeight={700} lineHeight="short" maxW="80%">
          {card.title}
        </Text>
      </HStack>
      <Text fontSize="sm" opacity={card.highlight ? 0.88 : 0.75} mb={4}>
        {card.description}
      </Text>
      <Text fontSize="xs" fontWeight={600} opacity={0.7} mb={4}>
        {card.address}
      </Text>
      <HStack gap={3} wrap="wrap" mb={4}>
        <Box
          px={3}
          py={1}
          bg={card.highlight ? "whiteAlpha.150" : "gray.100"}
          borderRadius="full"
          fontSize="xs"
        >
          Manager • {card.manager}
        </Box>
      </HStack>
      <HStack gap={4} fontSize="sm" opacity={0.72}>
        {/* <Text>{card.comments} comments</Text> */}
        <Box
          px={3}
          py={1}
          bg={card.highlight ? "gray.100" : "white"}
          border={"1px solid"}
          borderRadius="999px"
          fontSize="xs"
          fontWeight={700}
          //   color={card.highlight ? "white" : "gray.100"}
        >
          {card.dueDate}
        </Box>
        <Text>{card.attachments} attachments</Text>
      </HStack>
    </Box>
  );
};

export const DashboardLayout = ({
  title,
  subtitle,
  newCustomers,
  dealSuccessRate,
  summaryItems,
  pipelineColumns,
}: DashboardLayoutProps) => {
  const [searchText, setSearchText] = useState("");
  const [sortAsc, setSortAsc] = useState(false);

  const filteredColumns = useMemo(
    () => getFilteredCards(pipelineColumns, searchText, sortAsc),
    [pipelineColumns, searchText, sortAsc]
  );

  const totalPipelineItems = filteredColumns.reduce(
    (sum, column) => sum + column.cards.length,
    0
  );

  const secondaryBg = "gray.50";

  return (
    <VStack gap={8} alignItems="stretch">
      <Stack gap={4}>
        <HStack
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={4}
        >
          <Box>
            <Text textStyle="heading_5" fontWeight={700}>
              {title}
            </Text>
            <Text opacity={0.7} mt={1} fontSize="sm">
              {subtitle}
            </Text>
          </Box>
        </HStack>
        <HStack
          flexWrap="wrap"
          gap={3}
          w={{ base: "full", md: "auto" }}
          justify={"space-between"}
        >
          <Box>
            <InputGroup
              startElement={<SearchIcon color="gray.400" />}
              maxW={{ base: "100%", md: "320px" }}
            >
              <Input
                bg="white"
                borderRadius="16px"
                placeholder="Search customer..."
                value={searchText}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setSearchText(event.target.value)
                }
              />
            </InputGroup>
          </Box>
          <HStack gap={6} wrap="wrap">
            <Button
              //   leftIcon={<Icon as={ChevronDownIcon} />}
              variant="outline"
              borderRadius="16px"
              onClick={() => setSortAsc((prev) => !prev)}
            >
              Sort by due date
            </Button>
            <Button variant="outline" borderRadius="16px">
              <SearchIcon />
              Filters
            </Button>
            <Button
              colorScheme="blackAlpha"
              bg="gray.900"
              color="white"
              borderRadius="16px"
            >
              <AddIcon />
              Add customer
            </Button>
          </HStack>
        </HStack>
      </Stack>

      <Grid templateColumns={{ base: "1fr", lg: "1.8fr 1fr" }} gap={6}>
        <Box {...sectionBoxProps}>
          <Stack gap={5}>
            <HStack justifyContent="space-between" alignItems="center">
              <Box>
                <Text fontSize="md" fontWeight={700}>
                  New customers
                </Text>
                <Text fontSize="sm" opacity={0.7}>
                  Tracking weekly onboarding progress.
                </Text>
              </Box>
              <Box
                px={3}
                py={1}
                bg="gray.100"
                borderRadius="full"
                fontSize="xs"
                fontWeight={700}
              >
                This week
              </Box>
            </HStack>

            <HStack
              gap={3}
              alignItems="flex-end"
              height="170px"
              justifyContent="space-between"
            >
              {newCustomers.map((entry) => (
                <VStack key={entry.label} gap={2} flex="1" alignItems="center">
                  <Box
                    width="100%"
                    height={`${entry.value * 1.2 + 30}px`}
                    maxH="140px"
                    borderRadius="24px"
                    bg={entry.active ? "gray.900" : "gray.200"}
                    transition="all 0.2s ease"
                  />
                  <Text fontSize="sm" opacity={0.7}>
                    {entry.label}
                  </Text>
                </VStack>
              ))}
            </HStack>
          </Stack>
        </Box>

        <Stack gap={6}>
          <Box {...sectionBoxProps}>
            <Stack gap={5} alignItems="center">
              <Text fontSize="md" fontWeight={700}>
                Successful deals
              </Text>
              <Box position="relative" width="190px" height="190px">
                {/* <CircularProgress
                  value={dealSuccessRate}
                  size="190px"
                  thickness="10px"
                  color="black"
                  trackColor="gray.200"
                /> */}
                <Flex
                  position="absolute"
                  inset={0}
                  alignItems="center"
                  justifyContent="center"
                  direction="column"
                >
                  <Text fontSize="3xl" fontWeight={700}>
                    {dealSuccessRate}%
                  </Text>
                  <Text opacity={0.7} fontSize="sm">
                    Closed deals
                  </Text>
                </Flex>
              </Box>
            </Stack>
          </Box>

          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
            {summaryItems.map((item) => (
              <Box key={item.id} {...sectionBoxProps} p={5}>
                <HStack justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Text
                      fontSize="xs"
                      opacity={0.7}
                      textTransform="uppercase"
                      //   lettergap="1px"
                    >
                      {item.title}
                    </Text>
                    <Text fontSize="2xl" fontWeight={700} mt={2}>
                      {item.value}
                    </Text>
                  </Box>
                  <Box
                    px={3}
                    py={1}
                    bg={item.accent ? "black" : "gray.100"}
                    color={item.accent ? "white" : "gray.800"}
                    borderRadius="full"
                    fontSize="xs"
                    fontWeight={700}
                  >
                    {item.label}
                  </Box>
                </HStack>
              </Box>
            ))}
          </Grid>
        </Stack>
      </Grid>

      <Box {...sectionBoxProps} bg={secondaryBg}>
        <Stack gap={5}>
          <HStack justifyContent="space-between" alignItems="center">
            <Text fontSize="lg" fontWeight={700}>
              Opportunity board
            </Text>
            <Text opacity={0.7} fontSize="sm">
              {totalPipelineItems} active cards in pipeline
            </Text>
          </HStack>

          <Grid
            templateColumns={{ base: "1fr", md: "repeat(4, minmax(0, 1fr))" }}
            gap={4}
          >
            {filteredColumns.map((column) => (
              <VStack key={column.id} alignItems="stretch" gap={4}>
                <Box>
                  <Text fontSize="sm" fontWeight={700} mb={2}>
                    {column.name}
                  </Text>
                  <Text fontSize="xs" opacity={0.68}>
                    {column.cards.length} items
                  </Text>
                </Box>
                <Stack gap={4}>
                  {column.cards.length ? (
                    column.cards.map((card) => (
                      <PipelineCard key={card.id} card={card} />
                    ))
                  ) : (
                    <Box
                      p={4}
                      bg="white"
                      borderRadius="20px"
                      border="1px solid"
                      borderColor="gray.200"
                    >
                      <Text opacity={0.68} fontSize="sm">
                        No matches found.
                      </Text>
                    </Box>
                  )}
                </Stack>
              </VStack>
            ))}
          </Grid>
        </Stack>
      </Box>
    </VStack>
  );
};
