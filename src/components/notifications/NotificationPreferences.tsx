import { Box, HStack, Spinner, Text, VStack } from "@chakra-ui/react";
import { Lock } from "lucide-react";

import {
  useNotificationPreferencesQuery,
  useUpdateNotificationPreferenceMutation,
  type NotificationPreference,
} from "@/api/notifications";
import { Switch } from "@/shared/components/ui";

// Human-readable labels for notification types
const NOTIFICATION_TYPE_LABELS: Record<
  string,
  { title: string; description: string }
> = {
  CASE_ASSIGNED: {
    title: "Case Assigned",
    description: "Receive notifications when a matter is assigned to you",
  },
  INVOICE_STATUS: {
    title: "Invoice Status",
    description: "Receive notifications about invoice status updates",
  },
  APPEAL_LAPSED: {
    title: "Appeal Lapsed",
    description: "Receive alerts when an appeal has lapsed",
  },
  HEARING_REMINDER: {
    title: "Hearing Reminder",
    description: "Receive reminders about upcoming hearings",
  },
  APPEAL_DEADLINE: {
    title: "Appeal Deadline",
    description: "Receive alerts about approaching appeal deadlines",
  },
  ANNOUNCEMENT: {
    title: "Announcement",
    description: "Receive firm-wide announcements and broadcasts",
  },
};

const PreferenceRow = ({
  preference,
  isUpdating,
  onToggle,
}: {
  preference: NotificationPreference;
  isUpdating: boolean;
  onToggle: (type: string, emailEnabled: boolean) => void;
}) => {
  const label = NOTIFICATION_TYPE_LABELS[preference.type] ?? {
    title: preference.type,
    description: "Notification preference",
  };

  return (
    <HStack
      py="3.5"
      px="4"
      justify="space-between"
      alignItems="center"
      borderBottom="1px"
      borderColor="gray.100"
      _last={{ borderBottom: "none" }}
      opacity={isUpdating ? 0.6 : 1}
      transition="opacity 0.15s"
    >
      <VStack alignItems="flex-start" gap="0.5" flex="1" minW="0">
        <Text fontSize="sm" fontWeight="500" color="gray.800">
          {label.title}
        </Text>
        <Text fontSize="xs" color="gray.500" lineClamp={2}>
          {label.description}
        </Text>
      </VStack>

      <HStack gap="2" flexShrink="0">
        {isUpdating && <Spinner size="xs" color="blue.500" />}
        {preference.locked ? (
          <HStack gap="1" opacity={0.5}>
            <Lock size={12} color="var(--chakra-colors-gray-500)" />
            <Text fontSize="xs" color="gray.500">
              Required
            </Text>
          </HStack>
        ) : (
          <Switch
            checked={preference.emailEnabled}
            onCheckedChange={(details) => {
              onToggle(preference.type, details.checked);
            }}
            disabled={isUpdating || preference.locked}
            aria-label={`Toggle ${label.title} email notifications`}
            size="sm"
          />
        )}
      </HStack>
    </HStack>
  );
};

export const NotificationPreferences = () => {
  const {
    data: preferences,
    isLoading,
    error,
  } = useNotificationPreferencesQuery();

  const updateMutation = useUpdateNotificationPreferenceMutation();

  const handleToggle = (type: string, emailEnabled: boolean) => {
    updateMutation.mutate({ type, emailEnabled });
  };

  if (isLoading) {
    return (
      <VStack py="8" gap="3">
        {Array.from({ length: 4 }).map((_, i) => (
          <HStack
            key={i}
            width="full"
            py="3.5"
            px="4"
            justify="space-between"
            borderBottom="1px"
            borderColor="gray.100"
          >
            <VStack alignItems="flex-start" gap="1" flex="1">
              <Box
                height="12px"
                width="120px"
                borderRadius="4px"
                bg="gray.100"
              />
              <Box
                height="10px"
                width="200px"
                borderRadius="4px"
                bg="gray.50"
              />
            </VStack>
            <Box width="36px" height="20px" borderRadius="full" bg="gray.100" />
          </HStack>
        ))}
      </VStack>
    );
  }

  if (error) {
    return (
      <VStack py="8" gap="3">
        <Text fontSize="sm" color="red.500" textAlign="center">
          Unable to load notification preferences. Please try again.
        </Text>
      </VStack>
    );
  }

  if (!preferences || preferences.length === 0) {
    return (
      <VStack py="8" gap="3">
        <Text fontSize="sm" color="gray.500" textAlign="center">
          No notification preferences available.
        </Text>
      </VStack>
    );
  }

  return (
    <Box>
      <Text fontSize="sm" fontWeight="500" color="gray.600" mb="3">
        Email Notifications
      </Text>
      <Box
        borderWidth="1px"
        borderColor="gray.200"
        borderRadius="lg"
        overflow="hidden"
      >
        {preferences.map((pref) => (
          <PreferenceRow
            key={pref.type}
            preference={pref}
            isUpdating={
              updateMutation.isPending &&
              updateMutation.variables?.type === pref.type
            }
            onToggle={handleToggle}
          />
        ))}
      </Box>
    </Box>
  );
};
