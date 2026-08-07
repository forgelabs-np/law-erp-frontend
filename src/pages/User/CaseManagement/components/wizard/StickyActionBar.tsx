import { Box, HStack, Button } from "@chakra-ui/react";
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
      px={6}
      mt={8}
      borderRadius="lg"
      boxShadow="0 -4px 6px -1px rgba(0, 0, 0, 0.05)"
    >
      <HStack justify="flex-end" gap={3}>
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            <HStack gap={2}>
              <ArrowLeft size={16} />
              <span>Back</span>
            </HStack>
          </Button>
        )}
        {showCancel && (
          <Button variant="outline" onClick={onCancel}>
            <HStack gap={2}>
              <ArrowLeft size={16} />
              <span>Cancel</span>
            </HStack>
          </Button>
        )}
        <Button
          variant="primary"
          onClick={onNext}
          disabled={isNextDisabled}
          bg="black"
          color="white"
          _hover={{ bg: "gray.800" }}
          _disabled={{ bg: "gray.300", cursor: "not-allowed" }}
          opacity={isNextDisabled ? 0.6 : 1}
        >
          <HStack gap={2}>
            <span>{nextLabel}</span>
            <ArrowRight size={16} />
          </HStack>
        </Button>
      </HStack>
    </Box>
  );
};
