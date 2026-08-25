import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import {
  ArrowRight,
  FileText,
  History,
  MailWarning,
  ShieldCheck,
  ShieldOff,
  UserPlus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { RecentActivity as RecentActivityType } from "../../types/dashboard.types";
import { relativeTime } from "../../utils/matterHelpers";

// ============================================================
// Types
// ============================================================

type ActivitySeverity = "INFO" | "SUCCESS" | "WARNING" | "ERROR";

interface ActivityPresentation {
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  severity: ActivitySeverity;
  label: string;
}

interface RecentActivityProps {
  activities: RecentActivityType[];
  maxItems?: number;
  compact?: boolean;
}

// ============================================================
// Activity mapping
// ============================================================

const activityPresentationMap: Record<
  string,
  (entityType: string) => ActivityPresentation
> = {
  EMAIL_FAILED: () => ({
    icon: <MailWarning size={14} />,
    color: "red.600",
    bgColor: "red.50",
    severity: "ERROR",
    label: "Email failed",
  }),
  CLIENT_CREATED: () => ({
    icon: <UserPlus size={14} />,
    color: "green.600",
    bgColor: "green.50",
    severity: "SUCCESS",
    label: "Client created",
  }),
  USER_CREATED: () => ({
    icon: <UserPlus size={14} />,
    color: "blue.600",
    bgColor: "blue.50",
    severity: "INFO",
    label: "User created",
  }),
  CLIENT_PORTAL_ENABLED: () => ({
    icon: <ShieldCheck size={14} />,
    color: "green.600",
    bgColor: "green.50",
    severity: "SUCCESS",
    label: "Portal enabled",
  }),
  CLIENT_PORTAL_DISABLED: () => ({
    icon: <ShieldOff size={14} />,
    color: "amber.600",
    bgColor: "amber.50",
    severity: "WARNING",
    label: "Portal disabled",
  }),
};

function getPresentation(
  action: string,
  entityType: string
): ActivityPresentation {
  const factory = activityPresentationMap[action];
  if (factory) return factory(entityType);

  // Fallback for unknown actions
  return {
    icon: <FileText size={14} />,
    color: "gray.600",
    bgColor: "gray.50",
    severity: "INFO",
    label: action
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase()),
  };
}

// ============================================================
// Activity row
// ============================================================

interface ActivityRowProps {
  activity: RecentActivityType;
}

const ActivityRow = ({ activity }: ActivityRowProps) => {
  const pres = getPresentation(activity.action, activity.entityType);

  return (
    <HStack
      gap={3}
      py={3}
      px={1}
      borderBottom="1px solid"
      borderColor="gray.100"
      align="flex-start"
      transition="background 0.1s ease"
      _hover={{ bg: "gray.50" }}
      borderRadius="md"
      cursor="default"
    >
      {/* Icon */}
      <Box
        w="8"
        h="8"
        borderRadius="lg"
        bg={pres.bgColor}
        color={pres.color}
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexShrink={0}
        mt={0.5}
      >
        {pres.icon}
      </Box>

      {/* Content */}
      <Stack gap={0.5} flex={1} minW={0}>
        <Text fontSize="sm" fontWeight="600" color="gray.900" lineHeight="1.3">
          {pres.label}
        </Text>
        <Text
          fontSize="xs"
          color="gray.500"
          lineHeight="1.4"
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          title={activity.summary}
        >
          {activity.summary}
        </Text>
        <HStack gap={1.5} mt={0.5}>
          <Text fontSize="xs" color="gray.400">
            {activity.userName}
          </Text>
          <Text fontSize="xs" color="gray.300">
            ·
          </Text>
          <Text fontSize="xs" color="gray.400" textTransform="uppercase">
            {activity.entityType}
          </Text>
        </HStack>
      </Stack>

      {/* Timestamp */}
      <Text fontSize="xs" color="gray.400" whiteSpace="nowrap" flexShrink={0}>
        {relativeTime(activity.createdAt)}
      </Text>
    </HStack>
  );
};

// ============================================================
// Empty state
// ============================================================

const EmptyState = () => (
  <Stack gap={3} align="center" py={10} textAlign="center">
    <Box
      w="12"
      h="12"
      borderRadius="full"
      bg="gray.100"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <History size={22} color="#9ca3af" />
    </Box>
    <Stack gap={0.5}>
      <Text fontSize="sm" fontWeight="600" color="gray.700">
        No recent activity
      </Text>
      <Text fontSize="xs" color="gray.400" maxW="240px">
        Activity from users, firms and matters will appear here.
      </Text>
    </Stack>
  </Stack>
);

// ============================================================
// Main Component
// ============================================================

export const RecentActivity = ({
  activities,
  maxItems = 10,
  compact = false,
}: RecentActivityProps) => {
  const navigate = useNavigate();
  const displayed = activities.slice(0, maxItems);

  return (
    <Stack gap={0} h="100%">
      {/* Header */}
      <HStack justify="space-between" align="center" mb={3} flexShrink={0}>
        <HStack gap={2}>
          <Box
            w="8"
            h="8"
            borderRadius="lg"
            bg="purple.50"
            color="purple.600"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <History size={16} />
          </Box>
          <Text fontSize="sm" fontWeight="600" color="gray.900">
            Recent Activity
          </Text>
        </HStack>
        <Box
          as="button"
          onClick={() => navigate("/super-admin/audit-logs")}
          display="inline-flex"
          alignItems="center"
          gap={1}
          px={2}
          py={1}
          bg="transparent"
          border="none"
          borderRadius="md"
          fontSize="xs"
          fontWeight="500"
          color="gray.500"
          cursor="pointer"
          transition="color 0.15s ease"
          _hover={{ color: "gray.700" }}
        >
          View All
          <ArrowRight size={12} />
        </Box>
      </HStack>

      {/* Activity list */}
      {displayed.length === 0 ? (
        <EmptyState />
      ) : (
        <Box
          flex={1}
          minH={0}
          overflowY={compact ? "auto" : undefined}
          pr={compact ? 1 : 0}
          css={
            compact
              ? {
                  "&::-webkit-scrollbar": { width: "4px" },
                  "&::-webkit-scrollbar-track": { bg: "transparent" },
                  "&::-webkit-scrollbar-thumb": {
                    bg: "gray.200",
                    borderRadius: "full",
                  },
                  "&::-webkit-scrollbar-thumb:hover": { bg: "gray.300" },
                }
              : undefined
          }
        >
          <Stack gap={0}>
            {displayed.map((activity, index) => (
              <ActivityRow
                key={`${activity.createdAt}-${activity.action}-${index}`}
                activity={activity}
              />
            ))}
          </Stack>
        </Box>
      )}
    </Stack>
  );
};
