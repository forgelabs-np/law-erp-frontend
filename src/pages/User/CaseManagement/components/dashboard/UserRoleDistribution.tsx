import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import { Briefcase, FileText, Scale, Shield } from "lucide-react";
import type { UserStats } from "../../types/dashboard.types";

interface UserRoleDistributionProps {
  stats: UserStats;
}

const ROLE_CONFIG = [
  {
    key: "advocates" as const,
    label: "Advocates",
    field: "totalAdvocates" as const,
    color: "#3b82f6",
    Icon: Scale,
  },
  {
    key: "paralegals" as const,
    label: "Paralegals",
    field: "totalParalegals" as const,
    color: "#14b8a6",
    Icon: Briefcase,
  },
  {
    key: "clients" as const,
    label: "Clients",
    field: "totalClients" as const,
    color: "#8b5cf6",
    Icon: FileText,
  },
  {
    key: "admins" as const,
    label: "Firm Admins",
    field: "totalFirmAdmins" as const,
    color: "#f59e0b",
    Icon: Shield,
  },
];

export const UserRoleDistribution = ({ stats }: UserRoleDistributionProps) => {
  const total = stats.totalUsers || 1;

  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="lg"
      boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.03)"
      p={5}
    >
      <Text fontSize="sm" fontWeight="600" color="gray.900" mb={4}>
        User Distribution
      </Text>

      {/* Segmented bar */}
      <HStack gap={0} h="6px" borderRadius="full" overflow="hidden" mb={4}>
        {ROLE_CONFIG.map((role) => {
          const count = stats[role.field];
          const width = total > 0 ? (count / total) * 100 : 0;
          return (
            <Box
              key={role.key}
              w={`${width}%`}
              minW={count > 0 ? "6px" : "0"}
              bg={role.color}
              transition="all 0.3s ease"
            />
          );
        })}
      </HStack>

      {/* Role list */}
      <HStack gap={0} flexWrap="wrap">
        {ROLE_CONFIG.map((role, index) => {
          const count = stats[role.field];
          const isLast = index === ROLE_CONFIG.length - 1;
          return (
            <HStack
              key={role.key}
              gap={2}
              pr={isLast ? 0 : 6}
              mr={isLast ? 0 : 6}
              borderRight={isLast ? "none" : "1px solid"}
              borderColor="gray.200"
            >
              <role.Icon size={14} color={role.color} />
              <Text fontSize="sm" fontWeight="600" color="gray.900">
                {count}
              </Text>
              <Text fontSize="xs" color="gray.500">
                {role.label}
              </Text>
            </HStack>
          );
        })}
      </HStack>
    </Box>
  );
};
