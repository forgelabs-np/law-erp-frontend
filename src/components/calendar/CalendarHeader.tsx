import { Box, Flex, Heading, Text, Button } from "@chakra-ui/react";
import { Plus } from "lucide-react";
import { CalendarSearch } from "./CalendarSearch";
import { ChangeEvent } from "react";
// import { CalendarFilters } from "./CalendarFilters";

interface CalendarHeaderProps {
  searchQuery: string;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onFilterClick: () => void;
  onCreateClick: () => void;
}

export const CalendarHeader = ({
  searchQuery,
  onSearchChange,
  onFilterClick,
  onCreateClick,
}: CalendarHeaderProps) => {
  return (
    <Flex
      direction={{ base: "column", lg: "row" }}
      justify="space-between"
      align={{ base: "stretch", lg: "center" }}
      mb={6}
      gap={4}
    >
      <Box>
        <Heading
          as="h1"
          size="lg"
          fontWeight="bold"
          color="gray.800"
          _dark={{ color: "white" }}
          mb={1}
        >
          Manage Tasks
        </Heading>
        <Text color="gray.500" _dark={{ color: "gray.400" }} fontSize="sm">
          Manage legal tasks, hearings, meetings and case schedules.
        </Text>
      </Box>

      <Flex align="center" gap={3} flexWrap="wrap">
        <CalendarSearch value={searchQuery} onChange={onSearchChange} />

        <Button
          variant="outline"
          borderRadius="full"
          bg="white"
          _dark={{ bg: "gray.800", borderColor: "gray.600" }}
          onClick={onFilterClick}
          size="md"
        >
          Filters
        </Button>

        <Button
          bg="black"
          color="white"
          _hover={{ bg: "gray.800" }}
          _dark={{ bg: "white", color: "black", _hover: { bg: "gray.200" } }}
          borderRadius="full"
          onClick={onCreateClick}
          size="md"
        >
          <Plus size={16} />
          Create Task
        </Button>
      </Flex>
    </Flex>
  );
};
