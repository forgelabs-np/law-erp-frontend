import { Box, Button, HStack } from "@chakra-ui/react";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface StickyActionBarProps {
  onCancel: () => void;
  onNext: () => void;
  onBack?: () => void;
  isNextDisabled?: boolean;
  nextLabel?: string;
  showCancel?: boolean;
}

export const StickyActionBar = ({
  onCancel,
  onNext,
  onBack,
  isNextDisabled = false,
  nextLabel = "Next Step",
  showCancel = true,
}: StickyActionBarProps) => {
  return (
    <Box
      position="sticky"
      bottom={0}
      bg="white"
      borderTop="1px solid"
      borderColor="gray.200"
      py={4}
      mt={6}
      boxShadow="0 -6px 16px -12px rgba(16, 24, 40, 0.18)"
    >
      <HStack justify="space-between" align="center" gap={3} flexWrap="wrap">
        <Box>
          {showCancel && (
            <Button
              variant="ghost"
              color="gray.600"
              fontWeight="600"
              onClick={onCancel}
              _hover={{ bg: "gray.100", color: "gray.800" }}
            >
              Cancel
            </Button>
          )}
        </Box>

        <HStack gap={3}>
          {onBack && (
            <Button
              variant="outline"
              height="11"
              px={5}
              fontWeight="600"
              onClick={onBack}
            >
              <HStack gap={2}>
                <ArrowLeft size={16} />
                <span>Back</span>
              </HStack>
            </Button>
          )}

          <Button
            variant="primary"
            height="11"
            px={6}
            fontWeight="600"
            onClick={onNext}
            disabled={isNextDisabled}
            opacity={isNextDisabled ? 0.6 : 1}
            boxShadow="0 1px 2px rgba(16, 24, 40, 0.08)"
          >
            <HStack gap={2}>
              <span>{nextLabel}</span>
              <ArrowRight size={16} />
            </HStack>
          </Button>
        </HStack>
      </HStack>
    </Box>
  );
};
