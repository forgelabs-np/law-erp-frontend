import { Box, HStack, Separator, Stack, Text } from "@chakra-ui/react";
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
    color: "blue",
    bgColor: "blue.50",
    textColor: "blue.600",
    Icon: Scale,
  },
  {
    key: "paralegals" as const,
    label: "Paralegals",
    field: "totalParalegals" as const,
    color: "teal",
    bgColor: "teal.50",
    textColor: "teal.600",
    Icon: Briefcase,
  },
  {
    key: "clients" as const,
    label: "Clients",
    field: "totalClients" as const,
    color: "purple",
    bgColor: "purple.50",
    textColor: "purple.600",
    Icon: FileText,
  },
  {
    key: "admins" as const,
    label: "Firm Admins",
    field: "totalFirmAdmins" as const,
    color: "amber",
    bgColor: "amber.50",
    textColor: "amber.600",
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
      borderRadius="xl"
      p={5}
    >
      <HStack justify="space-between" align="center" mb={4}>
        <Text fontSize="sm" fontWeight="600" color="gray.900">
          User Distribution
        </Text>
      </HStack>

      {/* Segmented bar */}
      <HStack gap={0} h="8px" borderRadius="full" overflow="hidden" mb={4}>
        {ROLE_CONFIG.map((role) => {
          const count = stats[role.field];
          const width = total > 0 ? (count / total) * 100 : 0;
          return (
            <Box
              key={role.key}
              w={`${width}%`}
              minW={count > 0 ? "8px" : "0"}
              bg={`${role.color}.400`}
              transition="all 0.3s ease"
            />
          );
        })}
      </HStack>

      {/* Role list */}
      <HStack gap={12} flexWrap="wrap">
        {ROLE_CONFIG.map((role, index) => {
          const count = stats[role.field];
          return (
            <HStack key={role.key} gap={2}>
              <Box
                w="7"
                h="7"
                borderRadius="md"
                bg={role.bgColor}
                color={role.textColor}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <role.Icon size={14} />
              </Box>
              <Stack gap={0}>
                <Text fontSize="sm" fontWeight="600" color="gray.900">
                  {count}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {role.label}
                </Text>
              </Stack>
              {index !== ROLE_CONFIG.length - 1 && (
                <Separator
                  orientation="vertical"
                  h="40px"
                  color={"gray.800"}
                  ml={4}
                  display={{ base: "none", lg: "flex" }}
                />
              )}
            </HStack>
          );
        })}
      </HStack>
    </Box>
  );
};
