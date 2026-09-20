import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import { History } from "lucide-react";

import { DashboardActivityItem } from "@/api/dashboard";
import { relativeTime } from "@/pages/User/CaseManagement/utils/matterHelpers";

import { humanizeLabel } from "../utils";
import { EmptyState } from "./SectionCard";

interface ActivityFeedProps {
  activities: DashboardActivityItem[];
  maxItems?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  /** Fixed height for the scrollable container. Omit for auto height. */
  maxHeight?: string;
}

/**
 * Lightweight activity feed with optional fixed-height scrollable container.
 * The super admin dashboard reuses the richer `RecentActivity` component
 * in CaseManagement; this covers the other roles.
 */
export const ActivityFeed = ({
  activities,
  maxItems = 8,
  emptyTitle = "No recent updates",
  emptyDescription = "Activity will appear here as your team works on matters.",
  maxHeight,
}: ActivityFeedProps) => {
  const displayed = activities.slice(0, maxItems);

  if (displayed.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        icon={<History size={20} />}
      />
    );
  }

  return (
    <Box
      maxH={maxHeight}
      overflowY={maxHeight ? "auto" : undefined}
      pr={maxHeight ? 1 : 0}
      css={
        maxHeight
          ? {
              "&::-webkit-scrollbar": { width: "3px" },
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
        {displayed.map((activity, index) => {
          const title =
            humanizeLabel(activity.action) ||
            humanizeLabel(activity.entityType) ||
            "Update";
          const isLast = index === displayed.length - 1;

          return (
            <HStack
              key={`${activity.createdAt ?? "activity"}-${activity.action ?? index}`}
              gap={3}
              py={3}
              align="flex-start"
              borderBottom={isLast ? "none" : "1px solid"}
              borderColor="gray.100"
            >
              <Box
                w="2"
                h="2"
                mt={2}
                borderRadius="full"
                bg="primary.400"
                flexShrink={0}
              />
              <Stack gap={0.5} flex={1} minW={0}>
                <Text
                  fontSize="sm"
                  fontWeight={600}
                  color="gray.900"
                  lineClamp={1}
                >
                  {title}
                </Text>
                {activity.summary && (
                  <Text fontSize="xs" color="gray.500" lineClamp={2}>
                    {activity.summary}
                  </Text>
                )}
                {activity.userName && (
                  <Text fontSize="xs" color="gray.400">
                    {activity.userName}
                  </Text>
                )}
              </Stack>
              <Text
                fontSize="xs"
                color="gray.400"
                whiteSpace="nowrap"
                flexShrink={0}
              >
                {relativeTime(activity.createdAt ?? null)}
              </Text>
            </HStack>
          );
        })}
      </Stack>
    </Box>
  );
};
