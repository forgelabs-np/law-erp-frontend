import {
  Badge,
  Box,
  Button,
  Collapsible,
  HStack,
  Input,
  Skeleton,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  ChevronDown,
  ChevronRight,
  Clock,
  Globe,
  LogIn,
  LogOut,
  Key,
  Shield,
  ShieldOff,
  User,
  UserCheck,
  UserCog,
  UserPlus,
  UserMinus,
  Activity,
  Search,
  FileText,
  Building2,
  ExternalLink,
} from "lucide-react";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import {
  useUserActivityQuery,
  useUserProfileQuery,
} from "@/api/userManagement";
import NoDataAvailable from "@/shared/components/NoDataAvailable/NoDataAvailable";
import { ROUTES_CONFIG } from "@/shared/config";
import { FormProvider, ReactSelect } from "@/shared/components";
import { InputGroup } from "@/shared/components/ui/InputGroup";

// ─── Activity Action Config ──────────────────────────────────────────────────────
interface ActionConfig {
  icon: typeof LogIn;
  color: string;
  bg: string;
  label: string;
}

const ACTION_CONFIG: Record<string, ActionConfig> = {
  LOGIN: { icon: LogIn, color: "blue.600", bg: "blue.50", label: "Login" },
  LOGOUT: { icon: LogOut, color: "gray.600", bg: "gray.50", label: "Logout" },
  LOGIN_FAILED: {
    icon: AlertCircle,
    color: "red.600",
    bg: "red.50",
    label: "Login Failed",
  },
  PASSWORD_CHANGED: {
    icon: Key,
    color: "purple.600",
    bg: "purple.50",
    label: "Password Changed",
  },
  PASSWORD_RESET: {
    icon: Key,
    color: "purple.600",
    bg: "purple.50",
    label: "Password Reset",
  },
  USER_CREATED: {
    icon: UserPlus,
    color: "green.600",
    bg: "green.50",
    label: "User Created",
  },
  USER_UPDATED: {
    icon: UserCog,
    color: "blue.600",
    bg: "blue.50",
    label: "User Updated",
  },
  USER_DELETED: {
    icon: UserMinus,
    color: "red.600",
    bg: "red.50",
    label: "User Deleted",
  },
  ROLE_UPDATED: {
    icon: Shield,
    color: "orange.600",
    bg: "orange.50",
    label: "Role Updated",
  },
  PERMISSION_UPDATED: {
    icon: ShieldOff,
    color: "purple.600",
    bg: "purple.50",
    label: "Permission Updated",
  },
  PERMISSION_GRANTED: {
    icon: Shield,
    color: "green.600",
    bg: "green.50",
    label: "Permission Granted",
  },
  MODULE_ENABLED: {
    icon: FileText,
    color: "teal.600",
    bg: "teal.50",
    label: "Module Enabled",
  },
  PORTAL_ACCESS: {
    icon: ExternalLink,
    color: "cyan.600",
    bg: "cyan.50",
    label: "Portal Access",
  },
  STATUS_CHANGED: {
    icon: UserCheck,
    color: "yellow.600",
    bg: "yellow.50",
    label: "Status Changed",
  },
  FIRM_CREATED: {
    icon: Building2,
    color: "green.600",
    bg: "green.50",
    label: "Firm Created",
  },
  FIRM_UPDATED: {
    icon: Building2,
    color: "blue.600",
    bg: "blue.50",
    label: "Firm Updated",
  },
};

const getActionConfig = (action: string): ActionConfig => {
  return (
    ACTION_CONFIG[action] || {
      icon: Activity,
      color: "gray.600",
      bg: "gray.100",
      label: action,
    }
  );
};

// ─── Activity Card Component ─────────────────────────────────────────────────────
interface ActivityCardProps {
  activity: any;
}

const ActivityCard = ({ activity }: ActivityCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = getActionConfig(activity.action || "");
  const ActionIcon = config.icon;

  const time = activity.createdAt
    ? format(parseISO(activity.createdAt), "HH:mm")
    : "";

  const relativeDate = activity.createdAt
    ? (() => {
        const date = parseISO(activity.createdAt);
        if (isToday(date)) return "Today";
        if (isYesterday(date)) return "Yesterday";
        return format(date, "MMM d, yyyy");
      })()
    : "";

  return (
    <Box
      bg="white"
      borderRadius="lg"
      border="1px solid"
      borderColor="gray.100"
      p={4}
      boxShadow="sm"
      _hover={{
        boxShadow: "md",
        borderColor: "gray.200",
        transform: "translateX(2px)",
      }}
      transition="all 0.2s ease"
      cursor="pointer"
      onClick={() => setIsExpanded(!isExpanded)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsExpanded(!isExpanded);
        }
      }}
      aria-expanded={isExpanded}
      aria-label={`Activity: ${config.label}`}
    >
      <HStack gap={3} align="flex-start">
        {/* Icon Dot */}
        <Box
          bg={config.bg}
          borderRadius="full"
          p={2.5}
          flexShrink={0}
          mt={0.5}
          aria-hidden="true"
        >
          <ActionIcon size={16} color={"black"} />
        </Box>

        {/* Content */}
        <Stack gap={1} flex={1} minW={0}>
          <HStack gap={2} flexWrap="wrap">
            <Badge
              bg={config.bg}
              color={config.color}
              px="2"
              py="0.5"
              borderRadius="md"
              fontSize="xs"
              fontWeight="600"
              textTransform="uppercase"
              letterSpacing="0.3px"
            >
              {config.label}
            </Badge>
            <Text fontSize="sm" fontWeight="500" color="gray.700">
              {activity.summary || activity.action || "Activity"}
            </Text>
          </HStack>

          <HStack gap={4} fontSize="xs" color="gray.400">
            <HStack gap={1}>
              <Clock size={12} />
              <Text>{time}</Text>
            </HStack>
            <HStack gap={1}>
              <Calendar size={12} />
              <Text>{relativeDate}</Text>
            </HStack>
            {/* {activity.ipAddress && (
              <HStack gap={1}>
                <Globe size={12} />
                <Text>{activity.ipAddress}</Text>
              </HStack>
            )} */}
          </HStack>

          {/* Expandable Details */}
          <Collapsible.Root open={isExpanded}>
            <Collapsible.Content>
              <Stack
                gap={2}
                mt={3}
                pt={3}
                borderTop="1px solid"
                borderColor="gray.100"
              >
                {activity.entityType && (
                  <HStack gap={2} fontSize="xs">
                    <Text color="gray.500" minW="80px">
                      Entity Type:
                    </Text>
                    <Badge
                      bg="gray.100"
                      color="gray.600"
                      px="2"
                      py="0.5"
                      borderRadius="md"
                      fontSize="xs"
                      fontWeight="500"
                    >
                      {activity.entityType}
                    </Badge>
                  </HStack>
                )}
                {activity.entityId && (
                  <HStack gap={2} fontSize="xs">
                    <Text color="gray.500" minW="80px">
                      Entity ID:
                    </Text>
                    <Text fontFamily="mono" color="gray.600" fontSize="xs">
                      {activity.entityId}
                    </Text>
                  </HStack>
                )}
                {activity.details && (
                  <Text fontSize="xs" color="gray.600">
                    {activity.details}
                  </Text>
                )}
              </Stack>
            </Collapsible.Content>
          </Collapsible.Root>
        </Stack>

        {/* Expand indicator */}
        <Box color="gray.300" flexShrink={0} mt={1}>
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </Box>
      </HStack>
    </Box>
  );
};

// ─── Date Group Component ────────────────────────────────────────────────────────
interface DateGroupProps {
  label: string;
  activities: any[];
}

const DateGroup = ({ label, activities }: DateGroupProps) => {
  return (
    <Stack gap={3}>
      <HStack gap={3}>
        <Text
          fontSize="sm"
          fontWeight="600"
          color="gray.700"
          bg="gray.50"
          px={3}
          py={1.5}
          borderRadius="full"
        >
          {label}
        </Text>
        <Box flex={1} height="1px" bg="gray.100" />
        <Text fontSize="xs" color="gray.400" fontWeight="500">
          {activities.length} {activities.length === 1 ? "event" : "events"}
        </Text>
      </HStack>
      <Stack gap={2} pl={2} position="relative">
        {/* Connecting line */}
        <Box
          position="absolute"
          left="20px"
          top="12px"
          bottom="12px"
          width="2px"
          bg="gray.100"
          zIndex={0}
          aria-hidden="true"
        />
        {activities.map((activity: any) => (
          <Box key={activity.id} position="relative" zIndex={1}>
            <ActivityCard activity={activity} />
          </Box>
        ))}
      </Stack>
    </Stack>
  );
};

// ─── Timeline Components Directory ──────────────────────────────────────────────
// Separate from AuditLogs to provide a unique visual identity:
// - Card-based design (vs. the AuditLogs' timeline-node design)
// - Expandable details inline (vs. AuditLogs' separate drawer)
// - Lighter, more compact cards
// - Inline icons with colored backgrounds
// - Hover animations with translate effect
// ────────────────────────────────────────────────────────────────────────────

const ACTION_FILTER_OPTIONS = [
  { label: "All Actions", value: "" },
  { label: "Login", value: "LOGIN" },
  { label: "Logout", value: "LOGOUT" },
  { label: "Password Changed", value: "PASSWORD_CHANGED" },
  { label: "Password Reset", value: "PASSWORD_RESET" },
  { label: "User Created", value: "USER_CREATED" },
  { label: "User Updated", value: "USER_UPDATED" },
  { label: "Role Updated", value: "ROLE_UPDATED" },
  { label: "Permission Updated", value: "PERMISSION_UPDATED" },
  { label: "Status Changed", value: "STATUS_CHANGED" },
];

const ACTIVITY_PAGE_SIZE = 10;

export const UserActivityPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [actionFilter, setActionFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const filterFormMethods = useForm({ defaultValues: { action: "" } });

  const {
    data: activityData,
    isLoading,
    isError,
    refetch,
  } = useUserActivityQuery(userId ?? "");
  const { data: userProfile } = useUserProfileQuery(userId ?? "");
  console.log(activityData, "dattttt");

  const filteredActivities = useMemo(() => {
    let activities = Array.isArray(activityData) ? activityData : [];

    if (actionFilter) {
      activities = activities.filter((a: any) => a.action === actionFilter);
    }

    if (dateFrom) {
      activities = activities.filter(
        (a: any) => a.createdAt && a.createdAt >= dateFrom
      );
    }

    if (dateTo) {
      activities = activities.filter(
        (a: any) => a.createdAt && a.createdAt <= dateTo + "T23:59:59"
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      activities = activities.filter(
        (a: any) =>
          a.summary?.toLowerCase().includes(query) ||
          a.action?.toLowerCase().includes(query) ||
          a.ipAddress?.toLowerCase().includes(query)
      );
    }

    // Sort by createdAt descending
    activities.sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return activities;
  }, [activityData, actionFilter, dateFrom, dateTo, searchQuery]);

  const paginatedActivities = filteredActivities.slice(
    0,
    (currentPage + 1) * ACTIVITY_PAGE_SIZE
  );

  const groupedActivities = useMemo(() => {
    const groups: Record<string, any[]> = {};

    paginatedActivities.forEach((activity: any) => {
      if (!activity.createdAt) return;
      const date = parseISO(activity.createdAt);
      let key: string;

      if (isToday(date)) key = "Today";
      else if (isYesterday(date)) key = "Yesterday";
      else key = format(date, "MMMM d, yyyy");

      if (!groups[key]) groups[key] = [];
      groups[key].push(activity);
    });

    return groups;
  }, [paginatedActivities]);

  const hasMore = paginatedActivities.length < filteredActivities.length;

  // Get unique action types from data for the filter
  const uniqueActions = useMemo(() => {
    if (!Array.isArray(activityData)) return ACTION_FILTER_OPTIONS;
    const actions = new Set(
      activityData.map((a: any) => a.action).filter(Boolean)
    );
    const dynamicOptions = [
      { label: "All Actions", value: "" },
      ...Array.from(actions).map((action) => ({
        label: ACTION_CONFIG[action as string]?.label || (action as string),
        value: action as string,
      })),
    ];
    return dynamicOptions;
  }, [activityData]);

  // ─── Error State ───────────────────────────────────────────────────────────
  if (isError) {
    return (
      <Stack gap={6} p={8}>
        <Button
          variant="ghost"
          alignSelf="flex-start"
          onClick={() => navigate(ROUTES_CONFIG.USER.USER_MANAGEMENT)}
          size="sm"
        >
          Back to Users
        </Button>
        <Box textAlign="center" py={16}>
          <Box
            bg="red.50"
            borderRadius="full"
            p={6}
            mb={4}
            display="inline-block"
          >
            <AlertCircle size={48} color="red.400" />
          </Box>
          <Text fontSize="lg" color="red.500" mb={4}>
            Failed to load user activity
          </Text>
          <Button
            onClick={() => refetch()}
            colorScheme="blue"
            variant="outline"
          >
            Retry
          </Button>
        </Box>
      </Stack>
    );
  }

  // ─── Main Render ───────────────────────────────────────────────────────────
  return (
    <Stack gap={6} p={8}>
      {/* Back button */}
      <Button
        variant="ghost"
        alignSelf="flex-start"
        onClick={() => navigate(ROUTES_CONFIG.USER.USER_MANAGEMENT)}
        size="sm"
        // leftIcon={<ArrowLeft size={16} />}
      >
        Back to Users
      </Button>

      {/* Header */}
      <Box
        bg="white"
        borderRadius="2xl"
        border="1px solid"
        borderColor="gray.200"
        p={6}
      >
        <HStack
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={4}
        >
          <Stack gap={1}>
            <Text textStyle="heading_4">User Activity</Text>
            <Text textStyle="paragraph_regular" color="gray.500">
              Track user actions and system events
            </Text>
          </Stack>
          <Box bg="gray.50" px={4} py={2} borderRadius="lg">
            <Text fontSize="sm" fontWeight="600" color="gray.600">
              Total Events: {filteredActivities.length}
            </Text>
          </Box>
        </HStack>
      </Box>

      {/* User Info Card */}
      {userProfile && (
        <Box
          bg="white"
          borderRadius="xl"
          border="1px solid"
          borderColor="gray.200"
          p={4}
        >
          <HStack gap={4} flexWrap={{ base: "wrap", md: "nowrap" }}>
            <HStack gap={3} flex={1}>
              <Box bg="blue.800" borderRadius="full" p={3} flexShrink={0}>
                <User size={20} color="white" />
              </Box>
              <Stack gap={0}>
                <Text fontWeight="600" fontSize="sm" color="gray.800">
                  {userProfile.fullName}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  @{userProfile.username} · {userProfile.email}
                </Text>
              </Stack>
            </HStack>
            <HStack gap={4}>
              <Stack gap={0} align="center">
                <Text fontWeight="700" fontSize="md" color="gray.800">
                  {(userProfile as any).actionsThisMonth ?? 0}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  Actions
                </Text>
              </Stack>
              <Stack gap={0} align="center">
                <Text fontWeight="700" fontSize="md" color="gray.800">
                  {filteredActivities.length}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  Events
                </Text>
              </Stack>
            </HStack>
          </HStack>
        </Box>
      )}

      {/* Filters */}
      <Box
        bg="white"
        borderRadius="lg"
        border="1px solid"
        borderColor="gray.200"
        p={4}
      >
        <FormProvider methods={filterFormMethods}>
          <Stack
            direction={{ base: "column", md: "row" }}
            gap={3}
            alignItems={{ md: "flex-end" }}
          >
            <Box minW="180px">
              <ReactSelect
                name="action"
                label=""
                placeholder="All Actions"
                options={uniqueActions}
                extraOnChange={(value) => {
                  setActionFilter(value as string);
                  setCurrentPage(0);
                }}
              />
            </Box>
            <Box>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setCurrentPage(0);
                }}
                placeholder="From Date"
                size="sm"
                height="40px"
              />
            </Box>
            <Box>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value);
                  setCurrentPage(0);
                }}
                placeholder="To Date"
                size="sm"
                height="40px"
              />
            </Box>
            <Box flex={1}>
              <InputGroup
                startElement={
                  <Box pl={2} color="gray.400">
                    <Search size={16} />
                  </Box>
                }
              >
                <Input
                  placeholder="Search in activity..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(0);
                  }}
                  height="40px"
                />
              </InputGroup>
            </Box>
            {(actionFilter || dateFrom || dateTo || searchQuery) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setActionFilter("");
                  setDateFrom("");
                  setDateTo("");
                  setSearchQuery("");
                  setCurrentPage(0);
                  filterFormMethods.reset({ action: "" });
                }}
              >
                Clear
              </Button>
            )}
          </Stack>
        </FormProvider>
      </Box>

      {/* Activity Timeline */}
      {isLoading ? (
        <Stack gap={6}>
          {[1, 2, 3].map((group) => (
            <Stack key={group} gap={3}>
              <Skeleton height="28px" width="120px" borderRadius="full" />
              {[1, 2].map((item) => (
                <Skeleton key={item} height="80px" borderRadius="lg" />
              ))}
            </Stack>
          ))}
        </Stack>
      ) : Object.keys(groupedActivities).length === 0 ? (
        <Box
          bg="white"
          borderRadius="2xl"
          border="1px solid"
          borderColor="gray.200"
          p={16}
        >
          <NoDataAvailable
            content={
              actionFilter || searchQuery || dateFrom || dateTo
                ? "No activity matches your filters"
                : "No user activity recorded yet"
            }
          />
          {(actionFilter || searchQuery || dateFrom || dateTo) && (
            <HStack justify="center" mt={4}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setActionFilter("");
                  setDateFrom("");
                  setDateTo("");
                  setSearchQuery("");
                  setCurrentPage(0);
                }}
              >
                Reset Filters
              </Button>
            </HStack>
          )}
        </Box>
      ) : (
        <Stack gap={8}>
          {Object.entries(groupedActivities).map(([label, activities]) => (
            <DateGroup key={label} label={label} activities={activities} />
          ))}

          {/* Load More */}
          {hasMore && (
            <HStack justify="center" pt={4}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => p + 1)}
                // leftIcon={<ChevronDown size={16} />}
              >
                Show More
              </Button>
            </HStack>
          )}

          {!hasMore && filteredActivities.length > ACTIVITY_PAGE_SIZE && (
            <Text textAlign="center" fontSize="xs" color="gray.400" py={2}>
              All {filteredActivities.length} events loaded
            </Text>
          )}
        </Stack>
      )}
    </Stack>
  );
};
