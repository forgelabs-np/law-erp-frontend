import {
  Badge,
  Box,
  Button,
  Card,
  Grid,
  HStack,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Check, RotateCcw, Type } from "lucide-react";

import { useAppFont } from "@/shared/theme/fontManager";
import {
  AVAILABLE_FONTS,
  DEFAULT_FONT,
  type FontKey,
} from "@/shared/theme/tokens/fonts";

const FONT_OPTIONS: Array<{
  key: FontKey;
  label: string;
  family: string;
  description: string;
}> = [
  {
    key: "Poppins",
    label: "Poppins",
    family: AVAILABLE_FONTS.Poppins,
    description: "Modern, geometric sans-serif with friendly curves.",
  },
  {
    key: "Roboto",
    label: "Roboto",
    family: AVAILABLE_FONTS.Roboto,
    description: "Clean, neo-grotesque structure built for high legibility.",
  },
  {
    key: "Nunito",
    label: "Nunito",
    family: AVAILABLE_FONTS.Nunito,
    description: "Well-balanced, rounded sans-serif with warm typography.",
  },
  {
    key: "Inter",
    label: "Inter",
    family: AVAILABLE_FONTS.Inter,
    description: "Precision-crafted variable font optimized for UI screens.",
  },
];

export const TypographySection = () => {
  const { activeFont, setFont } = useAppFont();

  return (
    <Card.Root
      border="1px solid"
      borderColor="gray.200"
      shadow="xs"
      borderRadius="xl"
    >
      <Card.Header pb={4} borderBottom="1px solid" borderColor="gray.100">
        <HStack gap={3}>
          <Box
            p={2}
            bg="primary.50"
            color="primary.600"
            borderRadius="lg"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Type size={18} />
          </Box>
          <Box>
            <Heading size="md" fontWeight="600" color="gray.900">
              Font Family & Typography
            </Heading>
            <Text fontSize="xs" color="gray.500" mt={0.5}>
              Select the global font family for the application interface.
            </Text>
          </Box>
        </HStack>
      </Card.Header>

      <Card.Body pt={6}>
        <Stack gap={6}>
          {/* Font Selection Grid */}
          <Grid
            templateColumns={{
              base: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            }}
            gap={4}
          >
            {FONT_OPTIONS.map((font) => {
              const isActive = activeFont === font.key;

              return (
                <Box
                  key={font.key}
                  onClick={() => setFont(font.key)}
                  p={4}
                  borderRadius="lg"
                  borderWidth="2px"
                  borderColor={isActive ? "primary.500" : "gray.200"}
                  bg={isActive ? "primary.50" : "white"}
                  _hover={{
                    borderColor: isActive ? "primary.600" : "gray.300",
                    bg: isActive ? "primary.50" : "gray.50",
                    cursor: "pointer",
                  }}
                  transition="all 0.15s ease-in-out"
                  position="relative"
                >
                  <HStack
                    justifyContent="space-between"
                    alignItems="flex-start"
                    mb={2}
                  >
                    <Text
                      fontSize="lg"
                      fontWeight={700}
                      color={isActive ? "primary.700" : "gray.900"}
                      style={{ fontFamily: font.family }}
                    >
                      {font.label}
                    </Text>

                    {isActive ? (
                      <Box
                        bg="primary.600"
                        color="white"
                        borderRadius="full"
                        p={1}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Check size={12} />
                      </Box>
                    ) : (
                      <Badge
                        variant="subtle"
                        colorPalette="gray"
                        fontSize="10px"
                      >
                        Select
                      </Badge>
                    )}
                  </HStack>

                  <Text fontSize="xs" color="gray.500" lineHeight="snug">
                    {font.description}
                  </Text>
                </Box>
              );
            })}
          </Grid>

          {/* Live Sample Preview Box */}
          <Box
            p={5}
            bg="gray.50"
            borderRadius="lg"
            borderWidth="1px"
            borderColor="gray.200"
          >
            <HStack justify="space-between" align="center" mb={2}>
              <Text
                fontSize="10px"
                fontWeight={700}
                textTransform="uppercase"
                color="gray.500"
                letterSpacing="wider"
              >
                Live Typography Preview — Active: {activeFont}
              </Text>

              {activeFont !== DEFAULT_FONT && (
                <Button
                  variant="ghost"
                  size="xs"
                  color="gray.600"
                  _hover={{ color: "gray.900", bg: "gray.200" }}
                  onClick={() => setFont(DEFAULT_FONT)}
                  display="flex"
                  alignItems="center"
                  gap={1}
                >
                  <RotateCcw size={12} />
                  Reset to Default
                </Button>
              )}
            </HStack>

            <Stack gap={1}>
              <Text
                fontSize="md"
                fontWeight={700}
                color="gray.900"
                style={{ fontFamily: AVAILABLE_FONTS[activeFont] }}
              >
                Law Practice Management & ERP System
              </Text>
              <Text
                fontSize="sm"
                color="gray.600"
                style={{ fontFamily: AVAILABLE_FONTS[activeFont] }}
              >
                Manage matters, client documents, billing invoices, and daily
                schedules with seamless performance.
              </Text>
              <Text
                fontSize="xs"
                color="gray.500"
                mt={1}
                style={{ fontFamily: AVAILABLE_FONTS[activeFont] }}
              >
                ABCDEFGHIJKLM NOPQRSTUVWXYZ • 0123456789
              </Text>
            </Stack>
          </Box>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
};
