import {
  Box,
  Button,
  Grid,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  CalendarDays,
  FileText,
  History,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useGetFirmTimelineQuery, useGetMattersQuery, useGetStaleMattersQuery } from "../api/matter.api";
import { useTodayHearings, useUpcomingHearings } from "@/hooks/useCalendarApi";

import {
  formatDate,
  formatDateTime,
  formatTime,
} from "../utils/matterHelpers";
import {
  CourtEventStatusBadge,
  CourtEventTypeBadge,
  MatterStatusBadge,
  MatterTypeBadge,
} from "../components/MatterBadges";
import { NextHearingCard } from "../components/NextHearingCard";
import { TimelineEventRow } from "../components/TimelineEventRow";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
}

const StatCard = ({ label, value, icon, color, onClick }: StatCardProps) => (
  <Box
    p={5}
    bg="white"
    border="1px solid"
    borderColor="gray.200"
    borderRadius="lg"
    boxShadow="sm"
    cursor={onClick ? "pointer" : "default"}
    onClick={onClick}
    _hover={onClick ? { borderColor: "blue.300", boxShadow: "md" } : undefined}
    transition="all 0.15s ease"
  >
    <HStack justify="space-between" align="flex-start">
      <Stack gap={1}>
        <Text fontSize="sm" fontWeight="500" color="gray.500">
          {label}
        </Text>
        <Text fontSize="3xl" fontWeight="700" color="gray.900">
          {value}
        </Text>
      </Stack>
      <Box
        w="10"
        h="10"
        borderRadius="lg"
        bg={`${color}.100`}
        color={`${color}.600`}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {icon}
      </Box>
    </HStack>
  </Box>
);

const CaseDashboardPage = () => {
  const navigate = useNavigate();

  // Reused for both the Total Matters card and the compact Recent Matters list.
  const { data: allMatters } = useGetMattersQuery({ page: 0, size: 6 });
  const { data: activeMatters } = useGetMattersQuery({
    page: 0,
    size: 1,
    status: "ACTIVE",
  });
  const { data: staleData } = useGetStaleMattersQuery({ days: 90, page: 0, size: 1 });
  const { data: todayEvents = [] } = useTodayHearings();
  const { data: upcomingEvents = [] } = useUpcomingHearings({ days: 7 });
  const { data: recentActivity } = useGetFirmTimelineQuery({ page: 0, size: 3 });

  const activityEvents = recentActivity?.content ?? [];
  const activityTotal = recentActivity?.totalElements;
  const nextHearing = upcomingEvents[0];
  const recentMatters = allMatters?.content ?? [];

  return (
    <Stack gap={6} padding={8}>
      <HStack justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={4}>
        <Stack gap={2}>
          <Text textStyle="heading_4">Case Management</Text>
          <Text textStyle="paragraph_regular" color="gray.500">
            Manage matters, court cases and Tarik/Peshi
          </Text>
        </Stack>
        <HStack gap={2}>
          <Button variant="outline" onClick={() => navigate("/cases")}>
            View All Matters
          </Button>
          <Button variant="ghost" onClick={() => navigate("/firm-activity")}>
            Firm Activity
          </Button>
          <Button variant="ghost" onClick={() => navigate("/stale-matters")}>
            Stale Matters
          </Button>
          <Button variant="primary" onClick={() => navigate("/cases/create")}>
            <Plus size={16} color="white" /> New Matter
          </Button>
        </HStack>
      </HStack>

      {/* Stats */}
      <Grid
        templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }}
        gap={4}
      >
        <StatCard
          label="Total Matters"
          value={allMatters?.totalElements ?? "-"}
          icon={<FileText size={20} />}
          color="blue"
          onClick={() => navigate("/cases")}
        />
        <StatCard
          label="Active Matters"
          value={activeMatters?.totalElements ?? "-"}
          icon={<Activity size={20} />}
          color="green"
          onClick={() => navigate("/cases")}
        />
        <StatCard
          label="Today's Events"
          value={todayEvents.length}
          icon={<CalendarDays size={20} />}
          color="purple"
          onClick={() => navigate("/task-calendar")}
        />
        <StatCard
          label="Stale (90+ days)"
          value={staleData?.totalElements ?? "-"}
          icon={<AlertTriangle size={20} />}
          color="red"
          onClick={() => navigate("/stale-matters")}
        />
      </Grid>

      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6}>
        {/* Today's events */}
        <Stack gap={4}>
          <HStack justify="space-between">
            <HStack gap={2}>
              <CalendarClock size={18} color="#6b7280" />
              <Text fontSize="lg" fontWeight="600" color="gray.900">
                Today's Events
              </Text>
            </HStack>
            <Button variant="ghost" size="sm" onClick={() => navigate("/task-calendar")}>
              Open Calendar <ArrowRight size={14} />
            </Button>
          </HStack>

          {todayEvents.length === 0 ? (
            <Box p={6} bg="white" border="1px solid" borderColor="gray.200" borderRadius="lg" textAlign="center">
              <Text fontSize="sm" color="gray.500">
                No court events today
              </Text>
            </Box>
          ) : (
            <Stack gap={3}>
              {todayEvents.map((event) => (
                <Box
                  key={event.id}
                  p={4}
                  bg="white"
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="lg"
                  cursor="pointer"
                  onClick={() => navigate(`/cases/${event.matterNumber}`)}
                  _hover={{ borderColor: "blue.300" }}
                >
                  <HStack justify="space-between" flexWrap="wrap" gap={2}>
                    <Stack gap={1}>
                      <Text fontSize="sm" fontWeight="600" color="gray.900">
                        {event.matterTitle}
                      </Text>
                      <Text fontSize="xs" color="gray.500" fontFamily="monospace">
                        {event.matterNumber} · {event.ourCourtCaseRef}
                      </Text>
                    </Stack>
                    <HStack gap={2}>
                      <CourtEventTypeBadge type={event.eventType} />
                      <CourtEventStatusBadge status={event.status} />
                    </HStack>
                  </HStack>
                  <HStack gap={4} mt={2}>
                    <Text fontSize="sm" color="gray.600">
                      {formatTime(event.scheduledTime) ||
                        formatDate(event.scheduledDate)}
                    </Text>
                    {event.courtRoom && (
                      <Text fontSize="sm" color="gray.600">
                        {event.courtRoom}
                      </Text>
                    )}
                  </HStack>
                </Box>
              ))}
            </Stack>
          )}

          {/* Upcoming */}
          {upcomingEvents.length > 0 && (
            <>
              <Text fontSize="lg" fontWeight="600" color="gray.900">
                Upcoming (7 days)
              </Text>
              <Stack gap={3}>
                {upcomingEvents.slice(0, 5).map((event) => (
                  <Box
                    key={event.id}
                    p={4}
                    bg="white"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="lg"
                    cursor="pointer"
                    onClick={() => navigate(`/cases/${event.matterNumber}`)}
                    _hover={{ borderColor: "blue.300" }}
                  >
                    <HStack justify="space-between" flexWrap="wrap" gap={2}>
                      <Stack gap={1}>
                        <Text fontSize="sm" fontWeight="600" color="gray.900">
                          {event.matterTitle}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {formatDate(event.scheduledDate)}{" "}
                          {event.scheduledTime ? `· ${formatTime(event.scheduledTime)}` : ""}
                        </Text>
                      </Stack>
                      <CourtEventTypeBadge type={event.eventType} />
                    </HStack>
                  </Box>
                ))}
              </Stack>
            </>
          )}
        </Stack>

        {/* Recent activity */}
        <Stack gap={4}>
          <HStack justify="space-between" align="flex-end">
            <HStack gap={2}>
              <History size={18} color="#6b7280" />
              <Text fontSize="lg" fontWeight="600" color="gray.900">
                Recent Activity
              </Text>
            </HStack>
            <Text fontSize="sm" color="gray.500">
              {activityTotal ?? 0} {activityTotal === 1 ? "event" : "events"}
            </Text>
          </HStack>

          {nextHearing ? (
            <NextHearingCard
              event={nextHearing}
              // onViewEvent={() => navigate(`/cases/${nextHearing.matterNumber}`)}
              context={`${nextHearing.matterTitle} · ${nextHearing.matterNumber}`}
            />
          ) : (
            <Box
              p={5}
              bg="gray.50"
              border="1px dashed"
              borderColor="gray.200"
              borderRadius="lg"
            >
              <HStack gap={3}>
                <CalendarClock size={18} color="#6b7280" />
                <Stack gap={0.5}>
                  <Text fontSize="sm" fontWeight="600" color="gray.700">
                    No upcoming hearing scheduled
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    No Tarik/Peshi scheduled in the next 7 days.
                  </Text>
                </Stack>
              </HStack>
            </Box>
          )}

          <Box
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="lg"
            boxShadow="sm"
            p={4}
          >
            {activityEvents.length === 0 ? (
              <Box py={8} textAlign="center">
                <Text fontSize="sm" color="gray.500">
                  No recent activity
                </Text>
              </Box>
            ) : (
              <Box maxH="360px" overflowY="auto" position="relative" pr={1}>
                {activityEvents.length > 1 && (
                  <Box
                    position="absolute"
                    left="19px"
                    top="8"
                    bottom="5"
                    w="2px"
                    bg="gray.200"
                    zIndex={0}
                  />
                )}
                <Stack gap={0}>
                  {activityEvents.map((event) => (
                    <TimelineEventRow
                      key={event.id}
                      event={event}
                      timeLabel={formatDateTime(event.createdAt)}
                      descriptionLineClamp={2}
                      onClick={() => navigate(`/cases/${event.matterNumber}`)}
                    />
                  ))}
                </Stack>
              </Box>
            )}
          </Box>

          {activityEvents.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              alignSelf="flex-start"
              onClick={() => navigate("/firm-activity")}
            >
              View all activity <ArrowRight size={14} />
            </Button>
          )}
        </Stack>
      </Grid>

      {/* Recent matters */}
      <Stack gap={4}>
        <HStack justify="space-between">
          <Text fontSize="lg" fontWeight="600" color="gray.900">
            Recent Matters
          </Text>
          <Button variant="ghost" size="sm" onClick={() => navigate("/cases")}>
            View All <ArrowRight size={14} />
          </Button>
        </HStack>

        {recentMatters.length === 0 ? (
          <Box
            p={6}
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="lg"
            textAlign="center"
          >
            <Text fontSize="sm" color="gray.500">
              No matters created yet
            </Text>
          </Box>
        ) : (
          <Stack gap={2}>
            {recentMatters.map((matter) => (
              <Box
                key={matter.matterNumber}
                p={4}
                bg="white"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="lg"
                cursor="pointer"
                onClick={() => navigate(`/cases/${matter.matterNumber}`)}
                _hover={{ borderColor: "blue.300" }}
              >
                <HStack justify="space-between" flexWrap="wrap" gap={2}>
                  <HStack gap={3} flex={1} minW="200px">
                    <Text
                      fontSize="sm"
                      fontWeight="600"
                      color="gray.900"
                      fontFamily="monospace"
                    >
                      {matter.matterNumber}
                    </Text>
                    <Text fontSize="sm" color="gray.700" lineClamp={1}>
                      {matter.title}
                    </Text>
                  </HStack>
                  <HStack gap={2}>
                    <MatterTypeBadge type={matter.matterType} />
                    <MatterStatusBadge status={matter.status} />
                    <Text fontSize="xs" color="gray.400">
                      {formatDate(matter.updatedAt)}
                    </Text>
                    <ArrowRight size={14} color="#6b7280" />
                  </HStack>
                </HStack>
              </Box>
            ))}
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

export default CaseDashboardPage;
