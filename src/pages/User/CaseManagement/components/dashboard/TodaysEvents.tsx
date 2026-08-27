import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import { CalendarDays, Clock, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TodaysEventsProps {
  count: number;
}

export const TodaysEvents = ({ count }: TodaysEventsProps) => {
  const navigate = useNavigate();

  return (
    <Box>
      <HStack justify="space-between" align="center" mb={4}>
        <Text fontSize="sm" fontWeight="600" color="gray.900">
          Today's Events
        </Text>
      </HStack>

      {/* Event status bar */}
      <HStack gap={0} h="8px" borderRadius="full" overflow="hidden" mb={4}>
        <Box
          w={count > 0 ? "100%" : "0%"}
          bg="blue.400"
          transition="all 0.3s ease"
        />
      </HStack>

      {/* Event summary row */}
      <HStack gap={4} flexWrap="wrap">
        <HStack gap={2}>
          <Box
            w="7"
            h="7"
            borderRadius="md"
            bg="blue.50"
            color="blue.600"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <CalendarDays size={14} />
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
          px={3}
          py={1.5}
          bg="gray.50"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="lg"
          fontSize="xs"
          fontWeight="500"
          color="gray.600"
          cursor="pointer"
          transition="all 0.15s ease"
          _hover={{ bg: "gray.100", borderColor: "gray.300" }}
          ml="auto"
        >
          <Clock size={12} />
          View Calendar
          <ExternalLink size={10} />
        </Box>
      </HStack>
    </Box>
  );
};
