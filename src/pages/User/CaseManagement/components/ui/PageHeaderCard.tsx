import { Box, Button, HStack, Stack, Text } from "@chakra-ui/react";
import { LucideIcon } from "lucide-react";

interface PageHeaderCardProps {
  caseNumber: string;
  title: string;
  caseTypeBadge: React.ReactNode;
  stageBadge: React.ReactNode;
  statusBadge: React.ReactNode;
  onEdit: () => void;
  onDelete: () => void;
  quickInfo?: Array<{
    icon?: LucideIcon;
    label: string;
    value: string | number | undefined | null;
  }>;
  onCopyCaseNumber?: () => void;
}

export const PageHeaderCard = ({
  caseNumber,
  title,
  caseTypeBadge,
  stageBadge,
  statusBadge,
  onEdit,
  onDelete,
  quickInfo = [],
  onCopyCaseNumber,
}: PageHeaderCardProps) => {
  return (
    <Box
      bg="white"
      borderRadius="xl"
      border="1px solid"
      borderColor="gray.200"
      boxShadow="sm"
      p={6}
    >
      {/* Breadcrumb */}
      <HStack gap={2} mb={4}>
        <Text fontSize="sm" color="gray.500">
          Cases
        </Text>
        <Text fontSize="sm" color="gray.400">
          /
        </Text>
        <Text fontSize="sm" color="gray.900" fontWeight="600">
          {caseNumber}
        </Text>
      </HStack>

      {/* Case Number with Copy */}
      <HStack gap={3} mb={4}>
        <Text
          fontSize="3xl"
          fontWeight="700"
          color="gray.900"
          fontFamily="monospace"
        >
          {caseNumber}
        </Text>
        <Button
          variant="ghost"
          size="xs"
          onClick={onCopyCaseNumber}
          color="gray.500"
          _hover={{ color: "gray.700" }}
        >
          Copy
        </Button>
      </HStack>

      {/* Title and Badges */}
      <HStack justify="space-between" align="flex-start" mb={6}>
        <Stack gap={3}>
          <Text fontSize="2xl" fontWeight="700" color="gray.900">
            {title}
          </Text>
          <HStack gap={2} flexWrap="wrap">
            {caseTypeBadge}
            {stageBadge}
            {statusBadge}
          </HStack>
        </Stack>

        <HStack gap={2}>
          <Button
            variant="outline"
            colorScheme="blue"
            onClick={onEdit}
            size="sm"
          >
            Edit
          </Button>
          <Button
            variant="outline"
            colorScheme="red"
            onClick={onDelete}
            size="sm"
          >
            Delete
          </Button>
        </HStack>
      </HStack>

      {/* Quick Info Grid */}
      {quickInfo.length > 0 && (
        <Box
          bg="gray.50"
          borderRadius="lg"
          p={4}
          border="1px solid"
          borderColor="gray.100"
        >
          <HStack gap={6} flexWrap="wrap">
            {quickInfo.map((info, index) => (
              <HStack key={index} gap={2} align="center">
                {info.icon && <info.icon size={16} color="#6b7280" />}
                <Text fontSize="sm" color="gray.500">
                  {info.label}:
                </Text>
                <Text fontSize="sm" fontWeight="600" color="gray.900">
                  {info.value || "-"}
                </Text>
              </HStack>
            ))}
          </HStack>
        </Box>
      )}
    </Box>
  );
};
