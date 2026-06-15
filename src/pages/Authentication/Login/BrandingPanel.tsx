import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { Building2, Scale, FileText, Shield } from "lucide-react";

export const BrandingPanel = () => {
  return (
    <Box
      bg="primary.900"
      p={8}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minH="100vh"
    >
      <VStack align="start" gap={8} flex={1} justify="center">
        {/* Logo */}
        <Box>
          <Text
            color="white"
            fontSize="xl"
            fontWeight="bold"
            letterSpacing="wide"
          >
            LexElite
          </Text>
          <Text
            color="primary.200"
            fontSize="sm"
            fontWeight="600"
            letterSpacing="wider"
          >
            CASE MANAGEMENT
          </Text>
        </Box>

        {/* Illustration */}
        <Box position="relative" w="full" h="200px">
          <Building2
            size={80}
            color="primary.300"
            style={{ position: "absolute", top: 20, left: 20 }}
          />
          <Scale
            size={60}
            color="primary.400"
            style={{ position: "absolute", top: 60, right: 40 }}
          />
          <FileText
            size={50}
            color="primary.200"
            style={{ position: "absolute", bottom: 40, left: 60 }}
          />
        </Box>

        {/* Title and Description */}
        <VStack align="start" gap={4} maxW="400px">
          <Text
            color="white"
            fontSize="3xl"
            fontWeight="bold"
            lineHeight="tight"
          >
            Modern Case Management for Modern Law Firms
          </Text>
          <Text color="primary.100" fontSize="md" lineHeight="relaxed">
            Streamline your legal practice with our comprehensive case
            management solution. Manage documents, track cases, and collaborate
            seamlessly.
          </Text>
        </VStack>
      </VStack>

      {/* Security Badge */}
      <HStack gap={3} bg="primary.800" p={4} borderRadius="md" align="center">
        <Shield size={24} color="primary.300" />
        <VStack align="start" gap={0}>
          <Text color="white" fontSize="xs" fontWeight="600">
            Bank-grade security & SOC2 Type II Compliant
          </Text>
        </VStack>
      </HStack>

      {/* Copyright */}
      <Text color="primary.300" fontSize="xs" textAlign="center">
        © 2026 LexElite. All rights reserved.
      </Text>
    </Box>
  );
};
