import { useState } from "react";
import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
import { LuType, LuX, LuCheck, LuChevronUp, LuRotateCcw } from "react-icons/lu";

import { useAppFont } from "@/shared/theme/fontManager";
import { AVAILABLE_FONTS, DEFAULT_FONT, type FontKey } from "@/shared/theme/tokens/fonts";

const FONT_OPTIONS: Array<{ key: FontKey; label: string; family: string }> = [
  { key: "Poppins", label: "Poppins", family: AVAILABLE_FONTS.Poppins },
  { key: "Roboto", label: "Roboto", family: AVAILABLE_FONTS.Roboto },
  { key: "Nunito", label: "Nunito", family: AVAILABLE_FONTS.Nunito },
  { key: "Inter", label: "Inter", family: AVAILABLE_FONTS.Inter },
];

export const FontSwitcherWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { activeFont, setFont } = useAppFont();

  return (
    <Box
      position="fixed"
      bottom="20px"
      right="20px"
      zIndex={9999}
      style={{ isolation: "isolate" }}
    >
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          size="sm"
          colorScheme="blue"
          bg="primary.600"
          color="white"
          shadow="lg"
          borderRadius="full"
          px={4}
          py={2}
          h="auto"
          display="flex"
          alignItems="center"
          gap={2}
          _hover={{ bg: "primary.700", transform: "translateY(-2px)" }}
          transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
          cursor="pointer"
        >
          <LuType size={16} />
          <Text fontSize="xs" fontWeight={600} letterSpacing="wide">
            Font: {activeFont}
          </Text>
          <LuChevronUp size={14} />
        </Button>
      ) : (
        <Box
          bg="white"
          color="gray.900"
          borderWidth="1px"
          borderColor="gray.200"
          borderRadius="xl"
          shadow="2xl"
          w="320px"
          overflow="hidden"
          animation="fadeIn 0.2s ease-out"
        >
          {/* Header */}
          <HStack
            justifyContent="space-between"
            alignItems="center"
            px={4}
            py={3}
            bg="gray.50"
            borderBottomWidth="1px"
            borderColor="gray.100"
          >
            <HStack gap={2}>
              <Box
                p={1.5}
                bg="primary.50"
                color="primary.600"
                borderRadius="md"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <LuType size={16} />
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight={700} color="gray.800" lineHeight="tight">
                  Font Switcher
                </Text>
                <Text fontSize="10px" color="gray.500" fontWeight={500}>
                  Compare typography in real time
                </Text>
              </Box>
            </HStack>

            <Button
              variant="ghost"
              size="xs"
              p={1}
              minW="auto"
              h="auto"
              borderRadius="md"
              color="gray.400"
              _hover={{ color: "gray.700", bg: "gray.200" }}
              onClick={() => setIsOpen(false)}
              aria-label="Close Font Switcher"
            >
              <LuX size={16} />
            </Button>
          </HStack>

          {/* Font List */}
          <VStack gap={1.5} p={3} alignItems="stretch">
            {FONT_OPTIONS.map((font) => {
              const isActive = activeFont === font.key;
              return (
                <Box
                  key={font.key}
                  onClick={() => setFont(font.key)}
                  p={2.5}
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor={isActive ? "primary.400" : "gray.100"}
                  bg={isActive ? "primary.50" : "white"}
                  _hover={{
                    borderColor: isActive ? "primary.500" : "gray.300",
                    bg: isActive ? "primary.50" : "gray.50",
                    cursor: "pointer",
                  }}
                  transition="all 0.15s ease-in-out"
                >
                  <HStack justifyContent="space-between" alignItems="center">
                    <Box>
                      <Text
                        fontSize="sm"
                        fontWeight={isActive ? 700 : 500}
                        color={isActive ? "primary.700" : "gray.800"}
                        style={{ fontFamily: font.family }}
                      >
                        {font.label}
                      </Text>
                      <Text
                        fontSize="10px"
                        color="gray.400"
                        fontFamily="monospace"
                        mt={0.5}
                      >
                        {font.family}
                      </Text>
                    </Box>

                    {isActive && (
                      <Box
                        bg="primary.600"
                        color="white"
                        borderRadius="full"
                        p={1}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <LuCheck size={12} />
                      </Box>
                    )}
                  </HStack>
                </Box>
              );
            })}

            {/* Quick Live Preview Box */}
            <Box
              mt={2}
              p={3}
              bg="gray.50"
              borderRadius="lg"
              borderWidth="1px"
              borderColor="gray.200"
            >
              <Text fontSize="10px" fontWeight={700} textTransform="uppercase" color="gray.400" mb={1} letterSpacing="wider">
                Live Sample Preview
              </Text>
              <Text fontSize="xs" fontWeight={600} color="gray.800" style={{ fontFamily: AVAILABLE_FONTS[activeFont] }}>
                Law ERP Dashboard & Documents
              </Text>
              <Text fontSize="11px" color="gray.600" mt={0.5} style={{ fontFamily: AVAILABLE_FONTS[activeFont] }}>
                1234567890 • Quick brown fox jumps over lazy dog
              </Text>
            </Box>
          </VStack>

          {/* Footer */}
          <HStack
            justifyContent="space-between"
            alignItems="center"
            px={3}
            py={2}
            bg="gray.50"
            borderTopWidth="1px"
            borderColor="gray.100"
          >
            <Button
              variant="ghost"
              size="xs"
              color="gray.500"
              _hover={{ color: "gray.800" }}
              onClick={() => setFont(DEFAULT_FONT)}
              display="flex"
              alignItems="center"
              gap={1}
            >
              <LuRotateCcw size={12} />
              Reset to Poppins
            </Button>
            <Text fontSize="10px" color="gray.400">
              Saved automatically
            </Text>
          </HStack>
        </Box>
      )}
    </Box>
  );
};
