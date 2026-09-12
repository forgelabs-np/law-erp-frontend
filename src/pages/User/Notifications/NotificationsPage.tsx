import {
  Badge,
  Box,
  Button,
  HStack,
  Spinner,
  Stack,
  Tabs as ChakraTabs,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { CheckCheck, Megaphone } from "lucide-react";
import { useState, useCallback } from "react";

import {
  useNotificationsQuery,
  useMarkAllNotificationsAsReadMutation,
  useUnreadCountQuery,
} from "@/api/notifications";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { NotificationPreferences } from "@/components/notifications/NotificationPreferences";
import { BroadcastForm } from "@/components/notifications/BroadcastForm";
import { useRole } from "@/shared/hooks/useAuth";
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogCloseTrigger,
} from "@/shared/components/ui/Dialog";

const PAGE_SIZE = 20;

export default function NotificationsPage() {
  const role = useRole();
  const roleCode =
    typeof role === "string" ? role : ((role as { code?: string })?.code ?? "");

  const isFirmAdmin = roleCode.toUpperCase() === "FIRM_ADMIN";

  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(0);

  const {
    open: broadcastOpen,
    onOpen: onBroadcastOpen,
    onClose: onBroadcastClose,
  } = useDisclosure();

  const {
    open: prefsOpen,
    onOpen: onPrefsOpen,
    onClose: onPrefsClose,
  } = useDisclosure();

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

  const { data: unreadCount = 0 } = useUnreadCountQuery();
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
    <Stack gap={6} padding={2}>
      {/* Header */}
      <HStack
        justifyContent="space-between"
        alignItems="flex-start"
        flexWrap="wrap"
        gap={4}
      >
        <Stack gap={1}>
          <HStack gap={3} alignItems="center">
            <Text textStyle="heading_4">Notifications</Text>
            {unreadCount > 0 && (
              <Badge
                bg="red.500"
                color="white"
                fontSize="xs"
                borderRadius="full"
                minW="22px"
                h="22px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontWeight="600"
                lineHeight="1"
                px="1.5"
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </Badge>
            )}
          </HStack>
          <Text textStyle="paragraph_regular" color="gray.500">
            Stay up to date with your latest alerts and activity.
          </Text>
        </Stack>

        <HStack gap={2} flexShrink={0}>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllRead}
              loading={markAllMutation.isPending}
              disabled={markAllMutation.isPending}
            >
              <CheckCheck size={16} />
              <Text ml="1" display={{ base: "none", sm: "inline" }}>
                Mark all read
              </Text>
            </Button>
          )}
          {isFirmAdmin && (
            <Button variant="primary" size="sm" onClick={onBroadcastOpen}>
              <Megaphone size={16} />
              <Text ml="1" display={{ base: "none", sm: "inline" }}>
                Create Announcement
              </Text>
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onPrefsOpen}
            color="gray.600"
          >
            Preferences
          </Button>
        </HStack>
      </HStack>

      {/* Tabs + Content */}
      <Box>
        <ChakraTabs.Root
          value={activeTab}
          onValueChange={handleTabChange}
          variant="line"
          size="sm"
        >
          <ChakraTabs.List gap={4}>
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

        {/* Notification list */}
        <Box mt="4">
          {isLoading ? (
            <VStack py="8" gap="3">
              {Array.from({ length: 5 }).map((_, i) => (
                <HStack
                  key={i}
                  width="full"
                  py="3"
                  px="4"
                  gap="3"
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor="gray.100"
                  opacity={1 - i * 0.15}
                >
                  <Box
                    width="36px"
                    height="36px"
                    borderRadius="lg"
                    bg="gray.100"
                  />
                  <VStack alignItems="flex-start" gap="1.5" flex="1">
                    <Box
                      height="12px"
                      width={`${55 + i * 5}%`}
                      borderRadius="4px"
                      bg="gray.100"
                    />
                    <Box
                      height="10px"
                      width={`${75 - i * 6}%`}
                      borderRadius="4px"
                      bg="gray.50"
                    />
                    <Box
                      height="8px"
                      width="60px"
                      borderRadius="4px"
                      bg="gray.50"
                    />
                  </VStack>
                </HStack>
              ))}
            </VStack>
          ) : notifications.length === 0 ? (
            <VStack py="16" gap="4">
              <Box
                width="56px"
                height="56px"
                borderRadius="full"
                bg="gray.50"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <CheckCheck size={28} color="var(--chakra-colors-gray-400)" />
              </Box>
              <VStack gap="1">
                <Text
                  fontSize="sm"
                  fontWeight="500"
                  color="gray.600"
                  textAlign="center"
                >
                  {unreadOnly
                    ? "No unread notifications"
                    : "You're all caught up"}
                </Text>
                <Text fontSize="xs" color="gray.400" textAlign="center">
                  {unreadOnly
                    ? "All notifications have been read"
                    : "There are no notifications to display"}
                </Text>
              </VStack>
            </VStack>
          ) : (
            <VStack alignItems="stretch" gap="1">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                />
              ))}
            </VStack>
          )}

          {/* Pagination */}
          {!isLoading && totalElements > PAGE_SIZE && (
            <HStack
              mt="4"
              py="3"
              px="2"
              justify="space-between"
              borderTop="1px"
              borderColor="gray.100"
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
        </Box>
      </Box>

      {/* Broadcast Dialog */}
      <DialogRoot
        open={broadcastOpen}
        onOpenChange={onBroadcastClose}
        size="lg"
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Announcement</DialogTitle>
            <DialogCloseTrigger />
          </DialogHeader>
          <DialogBody pb="6">
            <BroadcastForm onSuccess={onBroadcastClose} />
          </DialogBody>
        </DialogContent>
      </DialogRoot>

      {/* Preferences Dialog */}
      <DialogRoot open={prefsOpen} onOpenChange={onPrefsClose} size="lg">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notification Preferences</DialogTitle>
            <DialogCloseTrigger />
          </DialogHeader>
          <DialogBody pb="6">
            <NotificationPreferences />
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </Stack>
  );
}
