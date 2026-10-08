import {
  Badge,
  Box,
  Button,
  HStack,
  Skeleton,
  Stack,
  Tabs as ChakraTabs,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { Bell, CheckCheck, Megaphone, Settings } from "lucide-react";
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
import { Pagination } from "@/shared/components/datatable/pagination";
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogCloseTrigger,
} from "@/shared/components/ui/Dialog";

const PAGE_SIZE = 20;
const SKELETON_ROWS = 5;

/** Tinted icon tile used for the page header and empty/error states. */
const IconTile = ({
  icon: Icon,
  size = 20,
  tone = "brand",
}: {
  icon: typeof Bell;
  size?: number;
  tone?: "brand" | "muted";
}) => (
  <Box
    w="10"
    h="10"
    borderRadius="xl"
    bg={tone === "brand" ? "primary.50" : "gray.50"}
    color={tone === "brand" ? "primary.500" : "gray.400"}
    display="grid"
    placeItems="center"
    flexShrink={0}
  >
    <Icon size={size} />
  </Box>
);

export default function NotificationsPage() {
  const role = useRole();
  const roleCode =
    typeof role === "string" ? role : ((role as { code?: string })?.code ?? "");

  const isFirmAdmin = roleCode.toUpperCase() === "FIRM_ADMIN";

  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);

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
    isError,
  } = useNotificationsQuery({
    unreadOnly,
    page,
    size: pageSize,
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

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setPage(0);
  }, []);

  const handleMarkAllRead = useCallback(() => {
    markAllMutation.mutate();
  }, [markAllMutation]);

  return (
    <Stack gap={6} padding={2} w="100%" maxW="100%" minW={0}>
      {/* ---------------- Page header ---------------- */}
      <HStack
        justifyContent="space-between"
        alignItems="flex-start"
        flexWrap="wrap"
        gap={4}
      >
        <HStack gap={3} alignItems="center" minW={0}>
          <IconTile icon={Bell} />
          <Stack gap={0.5} minW={0}>
            <HStack gap={2.5} alignItems="center">
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
                  aria-label={`${unreadCount} unread notifications`}
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Badge>
              )}
            </HStack>
            <Text textStyle="paragraph_regular" color="gray.500">
              Stay up to date with your latest alerts and activity.
            </Text>
          </Stack>
        </HStack>

        <HStack gap={2} flexWrap="wrap" flexShrink={0}>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllRead}
              loading={markAllMutation.isPending}
              disabled={markAllMutation.isPending}
              color="gray.600"
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
          <Button variant="outline" size="sm" onClick={onPrefsOpen}>
            <Settings size={16} />
            <Text ml="1" display={{ base: "none", sm: "inline" }}>
              Preferences
            </Text>
          </Button>
        </HStack>
      </HStack>

      {/* ---------------- Notification centre card ---------------- */}
      <Box
        bg="white"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="xl"
      >
        <ChakraTabs.Root
          value={activeTab}
          onValueChange={handleTabChange}
          variant="line"
          size="sm"
        >
          <ChakraTabs.List
            px={{ base: 4, md: 5 }}
            gap={6}
            borderBottomWidth="1px"
            borderColor="gray.100"
          >
            <ChakraTabs.Trigger
              value="all"
              _selected={{
                color: "primary.500",
                borderBottomColor: "primary.500",
              }}
              fontSize="sm"
              fontWeight="500"
            >
              All
            </ChakraTabs.Trigger>
            <ChakraTabs.Trigger
              value="unread"
              _selected={{
                color: "primary.500",
                borderBottomColor: "primary.500",
              }}
              fontSize="sm"
              fontWeight="500"
            >
              Unread
              {unreadCount > 0 && (
                <Text
                  as="span"
                  ml="1.5"
                  bg="primary.50"
                  color="primary.600"
                  fontSize="10px"
                  fontWeight="600"
                  px="1.5"
                  borderRadius="full"
                  lineHeight="1.5"
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Text>
              )}
            </ChakraTabs.Trigger>
          </ChakraTabs.List>
        </ChakraTabs.Root>

        {/* Notification list */}
        {isLoading ? (
          <Box>
            {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
              <HStack
                key={i}
                alignItems="flex-start"
                gap="3.5"
                px={{ base: 4, md: 5 }}
                py="4"
                borderTopWidth={i === 0 ? "0" : "1px"}
                borderColor="gray.100"
              >
                <Skeleton boxSize="42px" borderRadius="lg" flexShrink={0} />
                <VStack alignItems="flex-start" gap="2" flex="1" minW="0">
                  <HStack width="full" justify="space-between" gap="3">
                    <Skeleton height="12px" width={`${45 + i * 4}%`} />
                    <Skeleton height="10px" width="56px" />
                  </HStack>
                  <Skeleton height="10px" width={`${70 - i * 5}%`} />
                </VStack>
              </HStack>
            ))}
          </Box>
        ) : isError ? (
          <VStack py={{ base: 12, md: 16 }} px={6} gap={3} textAlign="center">
            <IconTile icon={Bell} tone="muted" />
            <VStack gap={1}>
              <Text fontSize="sm" fontWeight="500" color="gray.600">
                Unable to load notifications
              </Text>
              <Text fontSize="xs" color="gray.400">
                Something went wrong while fetching your notifications. Please
                try again later.
              </Text>
            </VStack>
          </VStack>
        ) : notifications.length === 0 ? (
          <VStack py={{ base: 12, md: 16 }} px={6} gap={3} textAlign="center">
            <IconTile icon={CheckCheck} size={22} tone="muted" />
            <VStack gap={1}>
              <Text fontSize="sm" fontWeight="500" color="gray.600">
                {unreadOnly
                  ? "No unread notifications"
                  : "You're all caught up"}
              </Text>
              <Text fontSize="xs" color="gray.400">
                {unreadOnly
                  ? "All notifications have been read"
                  : "There are no notifications to display"}
              </Text>
            </VStack>
          </VStack>
        ) : (
          <Box>
            {notifications.map((notification, index) => (
              <Box
                key={notification.id}
                borderTopWidth={index === 0 ? "0" : "1px"}
                borderColor="gray.100"
              >
                <NotificationItem notification={notification} variant="feed" />
              </Box>
            ))}
          </Box>
        )}

        {/* Pagination */}
        {!isLoading && !isError && totalElements > 0 && (
          <Box borderTopWidth="1px" borderColor="gray.100">
            <Pagination
              currentPage={page + 1}
              pageCount={Math.max(1, totalPages)}
              pageSize={pageSize}
              onPaginationChange={(nextPage) => setPage(nextPage - 1)}
              setPageSize={handlePageSizeChange}
              isFirstPage={isFirst}
              isLastPage={isLast}
            />
          </Box>
        )}
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
