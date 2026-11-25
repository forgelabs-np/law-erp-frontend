import { Badge } from "@chakra-ui/react";

export const PlanStatusBadge = ({ isActive }: { isActive: boolean }) => {
  return (
    <Badge
      px={2}
      py={0.5}
      borderRadius="full"
      fontSize="xs"
      fontWeight="600"
      bg={isActive ? "green.50" : "gray.100"}
      color={isActive ? "green.700" : "gray.500"}
    >
      {isActive ? "Active" : "Inactive"}
    </Badge>
  );
};

export const PlanVisibilityBadge = ({ isPublic }: { isPublic: boolean }) => {
  return (
    <Badge
      px={2}
      py={0.5}
      borderRadius="full"
      fontSize="xs"
      fontWeight="500"
      bg={isPublic ? "lavender.50" : "gray.100"}
      color={isPublic ? "primary.600" : "gray.500"}
      borderWidth="1px"
      borderColor={isPublic ? "primary.100" : "gray.200"}
    >
      {isPublic ? "Public" : "Private"}
    </Badge>
  );
};
