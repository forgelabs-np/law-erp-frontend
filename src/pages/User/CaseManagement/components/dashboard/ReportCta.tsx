import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import { BarChart3, ExternalLink } from "lucide-react";

export const ReportCta = () => {
  return (
    <Box
      p={5}
      bg="linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0f9ff 100%)"
      border="1px solid"
      borderColor="green.100"
      borderRadius="xl"
      position="relative"
      overflow="hidden"
    >
      {/* Decorative chart bars */}
      <Box position="absolute" right={4} bottom={3} opacity={0.15}>
        <HStack gap={1} align="flex-end">
          <Box w="4" h="12" bg="green.600" borderRadius="sm" />
          <Box w="4" h="18" bg="green.600" borderRadius="sm" />
          <Box w="4" h="8" bg="green.600" borderRadius="sm" />
          <Box w="4" h="14" bg="green.600" borderRadius="sm" />
        </HStack>
      </Box>

      <Stack gap={3}>
        <HStack gap={2}>
          <Box
            w="7"
            h="7"
            borderRadius="md"
            bg="green.100"
            color="green.600"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <BarChart3 size={14} />
          </Box>
          <Text fontSize="sm" fontWeight="600" color="gray.900">
            Need detailed insights?
          </Text>
        </HStack>

        <Text fontSize="xs" color="gray.500" lineHeight="1.5">
          Generate comprehensive reports and analytics.
        </Text>

        <Box
          as="button"
          display="inline-flex"
          alignItems="center"
          gap={1.5}
          px={3}
          py={1.5}
          bg="white"
          border="1px solid"
          borderColor="green.200"
          borderRadius="lg"
          fontSize="xs"
          fontWeight="500"
          color="green.700"
          cursor="pointer"
          transition="all 0.15s ease"
          _hover={{ borderColor: "green.300", boxShadow: "sm" }}
          w="fit-content"
        >
          <BarChart3 size={12} />
          Generate Report
          <ExternalLink size={10} />
        </Box>
      </Stack>
    </Box>
  );
};
