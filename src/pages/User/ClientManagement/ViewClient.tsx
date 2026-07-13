import { Badge, HStack, Stack, Text, VStack } from "@chakra-ui/react";

import { useClientByIdQuery } from "@/api/clientManagement";
import { Dialog } from "@/shared/components/dialog";
import { formatClientDate, formatMobileNumber } from "./utils";

export const ViewClient = ({
  open,
  onClose,
  id,
}: {
  open: boolean;
  onClose: () => void;
  id?: string;
}) => {
  const { data: clientData, isLoading } = useClientByIdQuery(id ?? "");

  if (!id) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Client Details"
      hasFooter={false}
    >
      {isLoading ? (
        <Stack gap={4} p={4}>
          <Text>Loading...</Text>
        </Stack>
      ) : clientData ? (
        <Stack gap={6} p={4}>
          <VStack align="start" gap={2}>
            <Text fontSize="sm" color="gray.500">
              Full Name
            </Text>
            <Text fontSize="md" fontWeight="600">
              {clientData.fullName}
            </Text>
          </VStack>

          <HStack gap={8}>
            <VStack align="start" gap={2} flex={1}>
              <Text fontSize="sm" color="gray.500">
                Username
              </Text>
              <Text fontSize="md" fontWeight="500">
                {clientData.username}
              </Text>
            </VStack>

            <VStack align="start" gap={2} flex={1}>
              <Text fontSize="sm" color="gray.500">
                Email
              </Text>
              <Text fontSize="md" fontWeight="500">
                {clientData.email}
              </Text>
            </VStack>
          </HStack>

          <HStack gap={8}>
            <VStack align="start" gap={2} flex={1}>
              <Text fontSize="sm" color="gray.500">
                Mobile Number
              </Text>
              <Text fontSize="md" fontWeight="500">
                {formatMobileNumber(clientData.mobileNo)}
              </Text>
            </VStack>

            <VStack align="start" gap={2} flex={1}>
              <Text fontSize="sm" color="gray.500">
                User Type
              </Text>
              <Badge
                bg="blue.100"
                color="blue.700"
                px="2"
                py="1"
                borderRadius="md"
                fontSize="xs"
                fontWeight="600"
              >
                {clientData.userType}
              </Badge>
            </VStack>
          </HStack>

          <HStack gap={8}>
            <VStack align="start" gap={2} flex={1}>
              <Text fontSize="sm" color="gray.500">
                Status
              </Text>
              <Badge
                bg={clientData.isActive ? "green.100" : "gray.100"}
                color={clientData.isActive ? "green.700" : "gray.700"}
                px="2"
                py="1"
                borderRadius="md"
                fontSize="xs"
                fontWeight="600"
              >
                {clientData.isActive ? "Active" : "Inactive"}
              </Badge>
            </VStack>

            <VStack align="start" gap={2} flex={1}>
              <Text fontSize="sm" color="gray.500">
                Portal Access
              </Text>
              <Badge
                bg={clientData.portalAccessEnabled ? "green.100" : "red.100"}
                color={clientData.portalAccessEnabled ? "green.700" : "red.700"}
                px="2"
                py="1"
                borderRadius="md"
                fontSize="xs"
                fontWeight="600"
              >
                {clientData.portalAccessEnabled ? "Enabled" : "Disabled"}
              </Badge>
            </VStack>
          </HStack>

          <VStack align="start" gap={2}>
            <Text fontSize="sm" color="gray.500">
              Created Date
            </Text>
            <Stack gap="0">
              <Text fontSize="md" fontWeight="500">
                {formatClientDate(clientData.createdAt).date}
              </Text>
              <Text fontSize="sm" color="gray.500">
                {formatClientDate(clientData.createdAt).time}
              </Text>
            </Stack>
          </VStack>
        </Stack>
      ) : (
        <Stack gap={4} p={4}>
          <Text>No client data found.</Text>
        </Stack>
      )}
    </Dialog>
  );
};
