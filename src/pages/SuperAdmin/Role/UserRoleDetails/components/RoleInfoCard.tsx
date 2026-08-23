import {
  Avatar,
  Badge,
  Box,
  Center,
  Grid,
  HStack,
  Separator,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FileText, Info, Shield, ShieldCheck, Users, Zap } from "lucide-react";
import { useRoleByIdQuery } from "@/api/roleSetup.ts/index.ts";

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  iconBg?: string;
}

const MetricCard = ({
  icon,
  label,
  value,
  iconBg = "gray.50",
}: MetricCardProps) => (
  <Box
    bg="white"
    border="1px solid"
    borderColor="gray.100"
    borderRadius="12px"
    p={4}
    transition="all 0.2s"
    _hover={{ borderColor: "gray.200", boxShadow: "sm" }}
  >
    <HStack gap={3}>
      <Box
        bg={iconBg}
        borderRadius="lg"
        p={2.5}
        flexShrink={0}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {icon}
      </Box>
      <Stack gap={0}>
        <Text fontSize="xl" fontWeight="700" color="gray.800">
          {value}
        </Text>
        <Text fontSize="xs" color="gray.500" fontWeight="500">
          {label}
        </Text>
      </Stack>
    </HStack>
  </Box>
);

export const RoleInfoCard = ({ roleId }: { roleId: string }) => {
  const { data: roleData, isLoading } = useRoleByIdQuery(roleId);

  if (isLoading) {
    return (
      <Box
        bg="white"
        borderRadius="2xl"
        border="1px solid"
        borderColor="gray.200"
        p={6}
      >
        <Center p={10}>
          <Spinner />
        </Center>
      </Box>
    );
  }

  if (!roleData) {
    return null;
  }

  const permissionCount = roleData.permissions?.length ?? 0;
  const userCount = roleData.userCount ?? 0;
  const assignedUserNames = roleData.assignedUserNames ?? [];

  return (
    <Box
      bg="white"
      borderRadius="2xl"
      border="1px solid"
      borderColor="gray.200"
      p={6}
      boxShadow="0 1px 3px rgba(0,0,0,0.04)"
    >
      {/* Role Header */}
      <HStack gap={4} align="center" flexWrap={{ base: "wrap", md: "nowrap" }}>
        <Box bg="purple.50" borderRadius="xl" p={3} flexShrink={0}>
          <Shield size={28} color="#7c3aed" />
        </Box>
        <Stack gap={1} flex={1}>
          <HStack gap={3} align="center" flexWrap="wrap">
            <Text fontSize="xl" fontWeight="700" color="gray.900">
              {roleData.name}
            </Text>
            <Badge
              bg="gray.100"
              color="gray.700"
              px="2.5"
              py="1"
              borderRadius="md"
              fontSize="xs"
              fontWeight="600"
            >
              {roleData.code}
            </Badge>
          </HStack>
          <HStack gap={2} mt={0.5}>
            <Badge
              bg={roleData.isActive ? "green.50" : "red.50"}
              color={roleData.isActive ? "green.700" : "red.700"}
              px="2.5"
              py="1"
              borderRadius="md"
              fontSize="xs"
              fontWeight="600"
            >
              {roleData.isActive ? "Active" : "Inactive"}
            </Badge>
            {roleData.isSystem && (
              <Badge
                bg="blue.50"
                color="blue.700"
                px="2.5"
                py="1"
                borderRadius="md"
                fontSize="xs"
                fontWeight="600"
              >
                System Role
              </Badge>
            )}
          </HStack>
        </Stack>
      </HStack>

      <Separator my={5} />

      <Grid
        templateColumns={{
          base: "1fr",
          sm: "repeat(2, 1fr)",
          lg: "repeat(4, 1fr)",
        }}
        gap={3}
        mb={5}
      >
        <MetricCard
          icon={<Users size={18} color="#3b82f6" />}
          iconBg="blue.50"
          label="Assigned Users"
          value={userCount}
        />
        <MetricCard
          icon={<Zap size={18} color="#f59e0b" />}
          iconBg="orange.50"
          label="Permissions"
          value={permissionCount}
        />
        <MetricCard
          icon={<ShieldCheck size={18} color="#10b981" />}
          iconBg="green.50"
          label="System Role"
          value={roleData.isSystem ? "Yes" : "No"}
        />
        <MetricCard
          icon={<FileText size={18} color="#8b5cf6" />}
          iconBg="purple.50"
          label="Status"
          value={roleData.isActive ? "Active" : "Inactive"}
        />
      </Grid>

      {roleData.description && (
        <Box
          bg="blue.50"
          borderLeft="4px solid"
          borderLeftColor="blue.400"
          borderRadius="0 12px 12px 0"
          p={4}
          mb={5}
        >
          <HStack gap={2} mb={1.5}>
            <Info size={14} color="#3b82f6" />
            <Text
              fontSize="xs"
              fontWeight="600"
              color="blue.700"
              textTransform="uppercase"
              letterSpacing="wider"
            >
              About this Role
            </Text>
          </HStack>
          <Text fontSize="sm" color="gray.700" lineHeight="tall">
            {roleData.description}
          </Text>
        </Box>
      )}

      {/* Assigned Users */}
      {/* <Stack gap={3}>
        <HStack gap={2}>
          <Users size={16} color="#6b7280" />
          <Text fontSize="sm" fontWeight="600" color="gray.700">
            Assigned Users
          </Text>
          <Badge
            bg="gray.100"
            color="gray.600"
            px="2"
            py="0.5"
            borderRadius="full"
            fontSize="xs"
          >
            {userCount}
          </Badge>
        </HStack>

        {assignedUserNames.length > 0 ? (
          <HStack gap={3} flexWrap="wrap">
            <HStack gap={-2}>
              {assignedUserNames.slice(0, 4).map((name, i) => (
                <Avatar.Root
                  key={i}
                  size="sm"
                  colorPalette={["blue", "purple", "green", "orange"][i % 4]}
                  border="2px solid white"
                >
                  <Avatar.Fallback name={name} />
                </Avatar.Root>
              ))}
              {assignedUserNames.length > 4 && (
                <Box
                  bg="gray.100"
                  borderRadius="full"
                  w="32px"
                  h="32px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  border="2px solid white"
                  ml={-2}
                >
                  <Text fontSize="xs" fontWeight="600" color="gray.600">
                    +{assignedUserNames.length - 4}
                  </Text>
                </Box>
              )}
            </HStack>
            <HStack gap={1} flexWrap="wrap">
              {assignedUserNames.slice(0, 3).map((name, i) => (
                <Text key={i} fontSize="sm" color="gray.600">
                  {name}
                  {i < Math.min(2, assignedUserNames.length - 1) ? "," : ""}
                </Text>
              ))}
              {assignedUserNames.length > 3 && (
                <Text fontSize="sm" color="gray.500">
                  +{assignedUserNames.length - 3} more
                </Text>
              )}
            </HStack>
          </HStack>
        ) : (
          <Box
            border="2px dashed"
            borderColor="gray.200"
            borderRadius="12px"
            p={6}
            textAlign="center"
          >
            <Center>
              <Stack gap={2} align="center">
                <Box bg="gray.100" borderRadius="full" p={3}>
                  <Users size={20} color="#9ca3af" />
                </Box>
                <Text fontSize="sm" color="gray.500" fontWeight="500">
                  No users are currently assigned to this role.
                </Text>
                <Text fontSize="xs" color="gray.400">
                  Assign this role to users from User Management.
                </Text>
              </Stack>
            </Center>
          </Box>
        )}
      </Stack> */}
    </Box>
  );
};
