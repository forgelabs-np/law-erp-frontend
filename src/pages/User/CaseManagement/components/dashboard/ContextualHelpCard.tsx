import { Box, Button, Stack, Text } from "@chakra-ui/react";
import { ArrowUpRight, Scale } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

export const ContextualHelpCard = () => {
  const navigate = useNavigate();

  return (
    <Box
      position="relative"
      bg="linear-gradient(135deg, #1E293B 0%, #0F172A 100%)"
      color="white"
      borderRadius="xl"
      p={5}
      overflow="hidden"
      boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
      w="100%"
      minW={0}
    >
      {/* Background Watermark Icon */}
      <Box
        position="absolute"
        right="-12px"
        bottom="-12px"
        color="white"
        opacity={0.07}
        pointerEvents="none"
      >
        <Scale size={110} />
      </Box>

      <Stack gap={3} position="relative" zIndex={1}>
        <Stack gap={1}>
          <Text fontSize="sm" fontWeight="700" color="white" letterSpacing="-0.01em">
            Need help managing cases?
          </Text>
          <Text fontSize="xs" color="gray.300" lineHeight="1.5">
            Track hearings, manage court dates, and streamline legal documentation in NepalCRM.
          </Text>
        </Stack>

        <Box pt={1}>
          <Button
            size="xs"
            h="32px"
            px={3.5}
            fontSize="xs"
            fontWeight="600"
            bg="primary.500"
            color="white"
            borderRadius="lg"
            _hover={{ bg: "primary.600" }}
            onClick={() => navigate("/cases")}
          >
            Explore Matters
            <ArrowUpRight size={13} />
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};
