import {
  Box,
  Button,
  Grid,
  HStack,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  CreatePartyRequest,
  PartyType,
  PartyRepresentation,
} from "../../types/case.types";

interface PartyFormProps {
  party: CreatePartyRequest;
  onChange: (party: CreatePartyRequest) => void;
  onDelete: () => void;
  partyTypeLabel: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const PartyForm = ({
  party,
  onChange,
  onDelete,
  partyTypeLabel,
  isExpanded,
  onToggleExpand,
}: PartyFormProps) => {
  const handleFieldChange = (field: keyof CreatePartyRequest, value: any) => {
    onChange({ ...party, [field]: value });
  };

  return (
    <Box
      bg="white"
      borderRadius="lg"
      border="1px solid"
      borderColor="gray.200"
      overflow="hidden"
    >
      {/* Header - Always Visible */}
      <HStack
        justify="space-between"
        align="center"
        p={4}
        bg="gray.50"
        cursor="pointer"
        onClick={onToggleExpand}
        _hover={{ bg: "gray.100" }}
        transition="all 0.2s ease"
      >
        <HStack gap={3} align="center">
          <Box
            w="10"
            h="10"
            borderRadius="full"
            bg="blue.100"
            color="blue.600"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <User size={18} />
          </Box>
          <VStack align="start" gap={0}>
            <Text fontSize="15px" fontWeight="600" color="gray.900">
              {party.fullName || `New ${partyTypeLabel}`}
            </Text>
            {party.mobileNo && (
              <Text fontSize="13px" color="gray.500">
                {party.mobileNo}
              </Text>
            )}
          </VStack>
        </HStack>
        <HStack gap={2}>
          {isExpanded ? (
            <ChevronUp size={18} color="#6b7280" />
          ) : (
            <ChevronDown size={18} color="#6b7280" />
          )}
          <Button
            variant="ghost"
            size="sm"
            colorScheme="red"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <X size={16} />
          </Button>
        </HStack>
      </HStack>

      {/* Expanded Form */}
      {isExpanded && (
        <Box p={4} bg="white">
          <VStack gap={4} align="stretch">
            <Grid
              templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
              gap={4}
            >
              <VStack align="stretch" gap={2}>
                <Text fontSize="13px" fontWeight="500" color="gray.700">
                  Full Name *
                </Text>
                <input
                  type="text"
                  value={party.fullName}
                  onChange={(e) =>
                    handleFieldChange("fullName", e.target.value)
                  }
                  placeholder="Enter full name"
                  style={{
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #e2e8f0",
                    fontSize: "14px",
                  }}
                />
              </VStack>

              <VStack align="stretch" gap={2}>
                <Text fontSize="13px" fontWeight="500" color="gray.700">
                  Mobile Number *
                </Text>
                <input
                  type="text"
                  value={party.mobileNo}
                  onChange={(e) =>
                    handleFieldChange("mobileNo", e.target.value)
                  }
                  placeholder="Enter mobile number"
                  style={{
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #e2e8f0",
                    fontSize: "14px",
                  }}
                />
              </VStack>

              <VStack align="stretch" gap={2}>
                <Text fontSize="13px" fontWeight="500" color="gray.700">
                  Email
                </Text>
                <input
                  type="email"
                  value={party.email || ""}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  placeholder="Enter email address"
                  style={{
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #e2e8f0",
                    fontSize: "14px",
                  }}
                />
              </VStack>

              <VStack align="stretch" gap={2}>
                <Text fontSize="13px" fontWeight="500" color="gray.700">
                  Address
                </Text>
                <input
                  type="text"
                  value={party.address || ""}
                  onChange={(e) => handleFieldChange("address", e.target.value)}
                  placeholder="Enter address"
                  style={{
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #e2e8f0",
                    fontSize: "14px",
                  }}
                />
              </VStack>
            </Grid>

            <VStack align="stretch" gap={2}>
              <Text fontSize="13px" fontWeight="500" color="gray.700">
                Notes
              </Text>
              <textarea
                value={party.notes || ""}
                onChange={(e) => handleFieldChange("notes", e.target.value)}
                placeholder="Add any additional notes"
                style={{
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #e2e8f0",
                  fontSize: "14px",
                  minHeight: "60px",
                }}
              />
            </VStack>
          </VStack>
        </Box>
      )}
    </Box>
  );
};
