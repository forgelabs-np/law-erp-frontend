import { Box, HStack, Stack, Text } from "@chakra-ui/react";

import { ArrowRightIcon } from "@/assets/svgs";

export interface DeadlineItem {
  id: string;
  month: string;
  day: number;
  title: string;
  dueLabel: string;
  onClick?: () => void;
}

export interface UrgentDeadlinesData {
  items: DeadlineItem[];
}

export const UrgentDeadlines = ({ items }: UrgentDeadlinesData) => {
  return (
    <Box
      bg="white"
      borderRadius="16px"
      border="1px solid"
      borderColor="gray.200"
      p={5}
    >
      <Text fontWeight={700} fontSize="md" mb={4}>
        Urgent Deadlines
      </Text>
      <Stack gap={3}>
        {items.map((item) => (
          <HStack
            key={item.id}
            justifyContent="space-between"
            alignItems="center"
            p={3}
            border="1px solid"
            borderColor="gray.200"
            borderRadius="10px"
            cursor="pointer"
            _hover={{ bg: "gray.50" }}
            onClick={item.onClick}
          >
            <HStack gap={3} alignItems="center">
              <Box
                textAlign="center"
                minW="40px"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="8px"
                py={1}
                px={2}
              >
                <Text
                  fontSize="9px"
                  fontWeight={700}
                  color="gray.500"
                  textTransform="uppercase"
                  letterSpacing="0.05em"
                >
                  {item.month}
                </Text>
                <Text
                  fontSize="16px"
                  fontWeight={700}
                  color="gray.900"
                  lineHeight="1"
                >
                  {item.day}
                </Text>
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight={500} color="gray.800">
                  {item.title}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {item.dueLabel}
                </Text>
              </Box>
            </HStack>
            <ArrowRightIcon color="gray.400" />
          </HStack>
        ))}
      </Stack>
    </Box>
  );
};
