import { Input, Box } from "@chakra-ui/react";
import { Search as SearchIcon } from "lucide-react";
import { ChangeEvent } from "react";

interface CalendarSearchProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const CalendarSearch = ({ value, onChange }: CalendarSearchProps) => {
  return (
    <Box position="relative" width={{ base: "100%", md: "250px" }}>
      <Box
        position="absolute"
        left="12px"
        top="50%"
        transform="translateY(-50%)"
        zIndex={2}
      >
        <SearchIcon size={16} color="#94a3b8" />
      </Box>
      <Input
        value={value}
        onChange={onChange}
        placeholder="Search task..."
        pl="36px"
        bg="white"
        _dark={{ bg: "gray.800", borderColor: "gray.600" }}
        borderRadius="full"
        border="1px solid"
        borderColor="gray.200"
        boxShadow="sm"
        _hover={{ borderColor: "gray.300" }}
        _focus={{ borderColor: "blue.500", boxShadow: "outline" }}
        transition="all 0.2s"
      />
    </Box>
  );
};
