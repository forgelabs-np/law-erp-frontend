import {
  Box,
  Button,
  HStack,
  Spinner,
  Tabs as ChakraTabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import { CheckCheck } from "lucide-react";
import { useState, useCallback } from "react";

import {
  useNotificationsQuery,
  useMarkAllNotificationsAsReadMutation,
} from "@/api/notifications";
import { NotificationItem } from "./NotificationItem";

const PAGE_SIZE = 20;

interface NotificationPanelProps {
  unreadCount: number;
  onClose: () => void;
}

export const NotificationPanel = ({
  unreadCount,
  onClose,
}: NotificationPanelProps) => {
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(0);

  const unreadOnly = activeTab === "unread";

  const {
    data: notificationPage,
    isLoading,
    isFetching,
  } = useNotificationsQuery({
    unreadOnly,
    page,
    size: PAGE_SIZE,
  });

  const markAllMutation = useMarkAllNotificationsAsReadMutation();

  const notifications = notificationPage?.content ?? [];
  const totalPages = notificationPage?.totalPages ?? 0;
  const isFirst = notificationPage?.first ?? true;
  const isLast = notificationPage?.last ?? true;
  const totalElements = notificationPage?.totalElements ?? 0;

  const handleTabChange = useCallback((details: { value: string }) => {
    setActiveTab(details.value);
    setPage(0);
  }, []);

  const handlePrevPage = useCallback(() => {
    setPage((p) => Math.max(0, p - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setPage((p) => Math.min(totalPages - 1, p + 1));
  }, [totalPages]);

  const handleMarkAllRead = useCallback(() => {
    markAllMutation.mutate();
  }, [markAllMutation]);

  return (
    <Box
      position="fixed"
      top="0"
      right="0"
      bottom="0"
      width="100%"
      maxWidth="420px"
      bg="white"
      boxShadow="-4px 0 24px rgba(0, 0, 0, 0.12)"
      zIndex="1500"
      display="flex"
      flexDirection="column"
      animation="slideInRight 0.2s ease-out"
    >
      {/* Header */}
      <HStack
        px="4"
        py="3"
        borderBottom="1px"
        borderColor="gray.100"
        justify="space-between"
        flexShrink="0"
      >
        <Text fontWeight="600" fontSize="md" color="gray.800">
          Notifications
        </Text>
        <HStack gap="1">
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="xs"
              onClick={handleMarkAllRead}
              loading={markAllMutation.isPending}
              disabled={markAllMutation.isPending}
              color="blue.600"
              _hover={{ bg: "blue.50" }}
              aria-label="Mark all notifications as read"
            >
              <CheckCheck size={14} />
              <Text ml="1" fontSize="xs">
                Mark all read
              </Text>
            </Button>
          )}
          <Button
            variant="ghost"
            size="xs"
            p="1.5"
            borderRadius="md"
            onClick={onClose}
            aria-label="Close notifications"
            _hover={{ bg: "gray.100" }}
          >
            <Text fontSize="lg" lineHeight="1" color="gray.500">
              &times;
            </Text>
          </Button>
        </HStack>
      </HStack>

      {/* Tabs */}
      <ChakraTabs.Root
        value={activeTab}
        onValueChange={handleTabChange}
        variant="line"
        size="sm"
      >
        <ChakraTabs.List px="4" pt="1" gap="4" flexShrink="0">
          <ChakraTabs.Trigger
            value="all"
            _selected={{ color: "blue.600", borderBottomColor: "blue.600" }}
            fontSize="sm"
            fontWeight="500"
          >
            All
          </ChakraTabs.Trigger>
          <ChakraTabs.Trigger
            value="unread"
            _selected={{ color: "blue.600", borderBottomColor: "blue.600" }}
            fontSize="sm"
            fontWeight="500"
          >
            Unread
            {unreadCount > 0 && (
              <Text
                as="span"
                ml="1.5"
                bg="blue.100"
                color="blue.700"
                fontSize="10px"
                fontWeight="600"
                px="1.5"
                borderRadius="full"
                lineHeight="1.5"
              >
                {unreadCount}
              </Text>
            )}
          </ChakraTabs.Trigger>
        </ChakraTabs.List>
      </ChakraTabs.Root>

      {/* Content */}
      <Box flex="1" overflowY="auto" minH="0">
        {isLoading ? (
          <VStack py="12" gap="3">
            {Array.from({ length: 5 }).map((_, i) => (
              <HStack
                key={i}
                width="full"
                px="4"
                py="2.5"
                gap="3"
                opacity={1 - i * 0.15}
              >
                <Box
                  width="30px"
                  height="30px"
                  borderRadius="lg"
                  bg="gray.100"
                />
                <VStack alignItems="flex-start" gap="1" flex="1">
                  <Box
                    height="12px"
                    width={`${60 + i * 5}%`}
                    borderRadius="4px"
                    bg="gray.100"
                  />
                  <Box
                    height="10px"
                    width={`${80 - i * 8}%`}
                    borderRadius="4px"
                    bg="gray.50"
                  />
                </VStack>
              </HStack>
            ))}
          </VStack>
        ) : notifications.length === 0 ? (
          <VStack py="12" gap="3" px="4">
            <Box
              width="48px"
              height="48px"
              borderRadius="full"
              bg="gray.50"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <CheckCheck size={24} color="var(--chakra-colors-gray-400)" />
            </Box>
            <Text
              fontSize="sm"
              fontWeight="500"
              color="gray.600"
              textAlign="center"
            >
              {unreadOnly ? "No unread notifications" : "You're all caught up"}
            </Text>
            <Text fontSize="xs" color="gray.400" textAlign="center">
              {unreadOnly
                ? "All notifications have been read"
                : "There are no notifications to display"}
            </Text>
          </VStack>
        ) : (
          <VStack alignItems="stretch" gap="0.5" p="2">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))}
          </VStack>
        )}
      </Box>

      {/* Pagination Footer */}
      {!isLoading && totalElements > PAGE_SIZE && (
        <HStack
          px="4"
          py="2.5"
          borderTop="1px"
          borderColor="gray.100"
          justify="space-between"
          flexShrink="0"
        >
          <Text fontSize="xs" color="gray.500">
            Page {page + 1} of {totalPages}
          </Text>
          <HStack gap="1">
            {isFetching && <Spinner size="xs" />}
            <Button
              variant="ghost"
              size="xs"
              onClick={handlePrevPage}
              disabled={isFirst || isFetching}
              fontSize="xs"
            >
              Previous
            </Button>
            <Button
              variant="ghost"
              size="xs"
              onClick={handleNextPage}
              disabled={isLast || isFetching}
              fontSize="xs"
            >
              Next
            </Button>
          </HStack>
        </HStack>
      )}

      {/* Inline keyframes for slide-in animation */}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </Box>
  );
};
