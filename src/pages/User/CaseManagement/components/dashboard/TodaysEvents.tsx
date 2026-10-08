import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import { CalendarDays, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TodaysEventsProps {
  count: number;
}

export const TodaysEvents = ({ count }: TodaysEventsProps) => {
  const navigate = useNavigate();

  return (
    <Box>
      <Text fontSize="sm" fontWeight="600" color="gray.900" mb={4}>
        Today's Events
      </Text>

      <HStack gap={4} flexWrap="wrap">
        <HStack gap={2}>
          <Box color="gray.400">
            <CalendarDays size={16} />
          </Box>
          <Stack gap={0}>
            <Text fontSize="sm" fontWeight="600" color="gray.900">
              {count}
            </Text>
            <Text fontSize="xs" color="gray.500">
              {count === 0 ? "No events" : `event${count !== 1 ? "s" : ""}`}
            </Text>
          </Stack>
        </HStack>

        <Box
          as="button"
          onClick={() => navigate("/task-calendar")}
          display="inline-flex"
          alignItems="center"
          gap={1}
          px={2.5}
          py={1}
          bg="transparent"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="md"
          fontSize="xs"
          fontWeight="500"
          color="gray.500"
          cursor="pointer"
          transition="all 0.15s ease"
          _hover={{ bg: "gray.50", borderColor: "gray.300", color: "gray.700" }}
          ml="auto"
        >
          View Calendar
          <ExternalLink size={10} />
        </Box>
      </HStack>
    </Box>
  );
};
