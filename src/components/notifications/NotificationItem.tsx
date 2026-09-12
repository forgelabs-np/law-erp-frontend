import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import {
  Notification,
  useMarkNotificationAsReadMutation,
} from "@/api/notifications";
import { NotificationCategoryIcon } from "./NotificationCategoryIcon";
import { formatNotificationTime } from "./utils";

// Reference type to route mapping
const REFERENCE_ROUTES: Record<string, (id: string) => string> = {
  MATTER: (id) => `/cases/${id}`,
  INVOICE: (id) => `/super-admin/invoices/${id}`,
  COURT_CASE: (id) => `/cases/${id}`,
  COURT_EVENT: (id) => `/cases/${id}`,
};

interface NotificationItemProps {
  notification: Notification;
}

export const NotificationItem = ({ notification }: NotificationItemProps) => {
  const navigate = useNavigate();
  const markAsRead = useMarkNotificationAsReadMutation();

  const handleClick = () => {
    // Mark as read if unread
    if (!notification.read) {
      markAsRead.mutate(notification.id);
    }

    // Navigate to reference if available
    if (notification.referenceType && notification.referenceId) {
      const routeBuilder = REFERENCE_ROUTES[notification.referenceType];
      if (routeBuilder) {
        navigate(routeBuilder(notification.referenceId));
      }
    }
  };

  const isUnread = !notification.read;

  return (
    <HStack
      as="button"
      width="100%"
      textAlign="left"
      alignItems="flex-start"
      gap="3"
      px="3"
      py="2.5"
      borderRadius="lg"
      cursor={
        notification.referenceType && notification.referenceId
          ? "pointer"
          : "default"
      }
      bg={isUnread ? "blue.50" : "transparent"}
      _hover={{ bg: isUnread ? "blue.100" : "gray.50" }}
      transition="background 0.15s"
      onClick={handleClick}
      role="button"
      aria-label={`${notification.read ? "" : "Unread "}notification: ${notification.title}`}
    >
      <NotificationCategoryIcon
        type={notification.type}
        category={notification.category}
      />

      <VStack alignItems="flex-start" gap="0.5" flex="1" minW="0">
        <HStack width="full" justify="space-between" gap="2">
          <Text
            fontSize="sm"
            fontWeight={isUnread ? "600" : "500"}
            color="gray.800"
            lineClamp={1}
            flex="1"
          >
            {notification.title}
          </Text>
          {isUnread && (
            <Box
              width="8px"
              height="8px"
              borderRadius="full"
              bg="blue.500"
              flexShrink={0}
            />
          )}
        </HStack>

        <Text fontSize="xs" color="gray.500" lineClamp={2}>
          {notification.body}
        </Text>

        <Text fontSize="xs" color="gray.400" mt="0.5">
          {formatNotificationTime(notification.createdAt)}
        </Text>
      </VStack>
    </HStack>
  );
};
