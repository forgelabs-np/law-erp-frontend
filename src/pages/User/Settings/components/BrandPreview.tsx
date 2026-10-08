import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { Sparkles } from "lucide-react";

interface BrandPreviewProps {
  primaryColor: string;
  secondaryColor: string;
}

export const BrandPreview = ({ primaryColor, secondaryColor }: BrandPreviewProps) => {
  const isValidHex = (val: string) => /^#?[0-9a-fA-F]{6}$/.test(val.trim());

  const formatHex = (val: string, fallback: string) => {
    if (!val || !isValidHex(val)) return fallback;
    return val.startsWith("#") ? val : `#${val}`;
  };

  const primary = formatHex(primaryColor, "#1A237E");
  const secondary = formatHex(secondaryColor, "#E3F2FD");

  return (
    <Box
      border="1px solid"
      borderColor="gray.200"
      borderRadius="lg"
      bg="gray.50"
      p={4}
      width="100%"
    >
      <HStack justify="space-between" align="center" mb={3}>
        <HStack gap={1.5} color="gray.700">
          {/* <Sparkles size={14} /> */}
          <Text fontSize="xs" fontWeight="600" textTransform="uppercase" letterSpacing="wider">
            Live Brand Preview
          </Text>
        </HStack>
        <Text fontSize="xs" color="gray.400">
          Interactive Mockup
        </Text>
      </HStack>

      <Box
        borderRadius="md"
        overflow="hidden"
        border="1px solid"
        borderColor="gray.200"
        bg="white"
        shadow="xs"
      >
        {/* Mini Header Bar */}
        <Box bg={primary} px={3} py={2} color="white">
          <HStack justify="space-between" align="center">
            <HStack gap={2}>
              <Box w={3} h={3} borderRadius="full" bg="white" opacity={0.8} />
              <Text fontSize="xs" fontWeight="700">
                NepalCRM
              </Text>
            </HStack>
            <Box px={2} py={0.5} bg="white" color={primary} borderRadius="xs" fontSize="9px" fontWeight="700">
              PORTAL
            </Box>
          </HStack>
        </Box>

        {/* Mini Body */}
        <HStack p={3} gap={3} align="stretch" minH="90px">
          {/* Mini Sidebar Surface */}
          <VStack
            w="28%"
            bg={secondary}
            borderRadius="sm"
            p={2}
            align="flex-start"
            gap={1.5}
            justify="center"
          >
            <Box w="80%" h="6px" bg={primary} opacity={0.7} borderRadius="xs" />
            <Box w="60%" h="5px" bg={primary} opacity={0.4} borderRadius="xs" />
            <Box w="70%" h="5px" bg={primary} opacity={0.4} borderRadius="xs" />
          </VStack>

          {/* Mini Main Content Area */}
          <VStack flex={1} align="flex-start" gap={2} justify="center">
            <Text fontSize="xs" fontWeight="600" color="gray.800">
              Firm Dashboard
            </Text>
            <HStack gap={2} w="100%">
              {/* Primary Action Button */}
              <Box
                px={2.5}
                py={1}
                bg={primary}
                color="white"
                borderRadius="xs"
                fontSize="10px"
                fontWeight="600"
              >
                + New Action
              </Box>
              {/* Secondary Accent Surface */}
              <Box
                px={2}
                py={1}
                bg={secondary}
                color="gray.700"
                borderRadius="xs"
                fontSize="10px"
                fontWeight="500"
              >
                Badge Tag
              </Box>
            </HStack>
          </VStack>
        </HStack>
      </Box>
    </Box>
  );
};
