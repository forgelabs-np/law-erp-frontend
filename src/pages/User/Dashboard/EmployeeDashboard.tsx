import { Grid, Icon, Stack } from "@chakra-ui/react";
import {
  BarChart3,
  CalendarClock,
  CalendarDays,
  FolderOpen,
  History,
  List,
  Timer,
} from "lucide-react";
import { useMemo, useState } from "react";

import { useEmployeeDashboardQuery } from "@/api/dashboard";

import {
  ActivityFeed,
  DashboardErrorState,
  DashboardRefreshButton,
  DashboardSkeleton,
  EventList,
  HeroBand,
  InsightBand,
  MatterList,
  MetricStrip,
  MiniBarChart,
  Panel,
  SegmentedControl,
  UnsupportedRoleState,
  type DashboardInsight,
  type SegmentOption,
} from "./components";
import {
  formatMetric,
  getDashboardErrorMessage,
  getErrorStatus,
  groupEventsByDay,
  isMetric,
} from "./utils";
import { CHART_COLORS, toStatTiles } from "./types";

type ScheduleView = "chart" | "list";

const SCHEDULE_VIEWS: SegmentOption<ScheduleView>[] = [
  { value: "chart", label: "Load", icon: BarChart3 },
  { value: "list", label: "List", icon: List },
];

/**
 * Personal work dashboard shared by ADVOCATE and PARALEGAL.
 * The backend scopes every collection to the assigned matters.
 */
export const EmployeeDashboard = () => {
  const { data, isLoading, isError, error, refetch, isFetching } =
    useEmployeeDashboardQuery();

  const [scheduleView, setScheduleView] = useState<ScheduleView>("chart");

  const isForbidden = getErrorStatus(error) === 403;

  // Stable view model: derived hooks depend on these references, not literals.
  const view = useMemo(
    () => ({
      stats: data?.myCaseStats ?? {},
      todayEvents: data?.myTodayEvents ?? [],
      upcomingHearings: data?.myUpcomingHearings ?? [],
      upcomingDeadlines: data?.myUpcomingDeadlines ?? [],
      staleMatters: data?.myStaleMatters ?? [],
      recentUpdates: data?.recentUpdates ?? [],
    }),
    [data]
  );

  const {
    stats,
    todayEvents,
    upcomingHearings,
    upcomingDeadlines,
    staleMatters,
    recentUpdates,
  } = view;

  const scheduleBars = useMemo(
    () => groupEventsByDay([...upcomingHearings, ...upcomingDeadlines], 10),
    [upcomingHearings, upcomingDeadlines]
  );

  /** Presentation-only merge of the two real collections, nearest first. */
  const scheduleItems = useMemo(
    () =>
      [...upcomingHearings, ...upcomingDeadlines].sort((left, right) =>
        (left.scheduledDate ?? "").localeCompare(right.scheduledDate ?? "")
      ),
    [upcomingHearings, upcomingDeadlines]
  );

  const metrics = useMemo(
    () =>
      toStatTiles([
        {
          label: "Open Matters",
          value: stats.openMatters,
          icon: <Icon as={FolderOpen} boxSize={5} />,
          tone: "primary" as const,
        },
        {
          label: "Upcoming Hearings",
          value: stats.upcomingHearings,
          icon: <Icon as={CalendarClock} boxSize={5} />,
          tone: "purple" as const,
        },
        {
          label: "Stale Matters",
          value: stats.staleMatters,
          icon: <Icon as={Timer} boxSize={5} />,
          tone: "red" as const,
        },
        {
          label: "Today's Events",
          value: todayEvents.length,
          icon: <Icon as={CalendarDays} boxSize={5} />,
          tone: "teal" as const,
        },
        {
          label: "Open Deadlines",
          value: upcomingDeadlines.length,
          icon: <Icon as={Timer} boxSize={5} />,
          tone: "amber" as const,
        },
      ]),
    [stats, todayEvents.length, upcomingDeadlines.length]
  );

  const insights = useMemo(() => {
    const list: DashboardInsight[] = [];

    if (todayEvents.length > 0) {
      list.push({
        tone: "primary",
        label: "Events today",
        value: todayEvents.length,
        hint: "Check your hearing schedule",
        icon: CalendarDays,
      });
    }

    if (isMetric(stats.staleMatters) && stats.staleMatters > 0) {
      list.push({
        tone: "red",
        label: "Stale matters",
        value: stats.staleMatters,
        hint: "No recent court activity",
        icon: Timer,
      });
    }

    if (upcomingDeadlines.length > 0) {
      list.push({
        tone: "amber",
        label: "Upcoming deadlines",
        value: upcomingDeadlines.length,
        hint: "Deadlines for your assignments",
        icon: Timer,
      });
    }

    return list;
  }, [todayEvents.length, stats, upcomingDeadlines.length]);

  if (isLoading) return <DashboardSkeleton />;
  if (isForbidden) return <UnsupportedRoleState />;
  if (isError) {
    return (
      <DashboardErrorState
        message={getDashboardErrorMessage(error)}
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <Stack gap={6} padding={2}>
      <HeroBand
        eyebrow="My work"
        title="My Work"
        subtitle="Your hearings, deadlines and assigned matters in one place."
        primary={{
          label: "Open Matters",
          value: formatMetric(stats.openMatters),
        }}
        primaryTrend={
          scheduleBars.length > 1
            ? scheduleBars.map((day) => day.value)
            : undefined
        }
        stats={[
          {
            label: "Events today",
            value: todayEvents.length,
            icon: <CalendarDays size={12} />,
          },
          {
            label: "Upcoming hearings",
            value: formatMetric(stats.upcomingHearings),
            icon: <CalendarClock size={12} />,
          },
          {
            label: "Deadlines",
            value: upcomingDeadlines.length,
            icon: <Timer size={12} />,
          },
          {
            label: "Stale",
            value: formatMetric(stats.staleMatters),
            icon: <Timer size={12} />,
          },
        ]}
        action={
          <DashboardRefreshButton
            onDark
            isFetching={isFetching}
            onClick={() => void refetch()}
          />
        }
      />

      <InsightBand insights={insights} caption="Your priorities" />

      <MetricStrip metrics={metrics} caption="My workload" />

      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={5}>
        <Panel
          title="Today's Schedule"
          subtitle="Your court schedule for today"
          icon={<Icon as={CalendarDays} boxSize={4} />}
          tone="primary"
        >
          <EventList
            events={todayEvents}
            variant="timeline"
            highlightFirst
            emptyTitle="No events today"
            emptyDescription="You have no hearings or Tarik/Peshi scheduled today."
          />
        </Panel>

        <Panel
          title="My Schedule"
          subtitle="Hearings and deadlines ahead"
          icon={<Icon as={CalendarClock} boxSize={4} />}
          tone="purple"
          action={
            <SegmentedControl<ScheduleView>
              options={SCHEDULE_VIEWS}
              value={scheduleView}
              onChange={setScheduleView}
              ariaLabel="Schedule view"
            />
          }
        >
          {scheduleView === "chart" ? (
            <MiniBarChart
              data={scheduleBars}
              valueName="items"
              color={CHART_COLORS.primary}
              emptyTitle="Nothing scheduled"
              emptyDescription="Your upcoming hearings and deadlines will appear here."
            />
          ) : (
            <EventList
              events={scheduleItems}
              emptyTitle="Nothing scheduled"
              emptyDescription="Your upcoming hearings and deadlines will appear here."
            />
          )}
        </Panel>
      </Grid>

      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={5}>
        <Panel
          title="Upcoming Hearings"
          subtitle="Next court dates for your matters"
          icon={<Icon as={CalendarClock} boxSize={4} />}
          tone="purple"
        >
          <EventList
            events={upcomingHearings}
            emptyTitle="No upcoming hearings"
            emptyDescription="Your next scheduled hearings will appear here."
          />
        </Panel>

        <Panel
          title="Stale Matters"
          subtitle="Needing your attention"
          icon={<Icon as={Timer} boxSize={4} />}
          tone="red"
        >
          <MatterList
            matters={staleMatters}
            emptyTitle="No stale matters"
            emptyDescription="Matters with no recent activity will appear here."
          />
        </Panel>
      </Grid>

      <Panel
        title="Recent Updates"
        subtitle="Latest activity on your matters"
        icon={<Icon as={History} boxSize={4} />}
        tone="primary"
        flush
      >
        <ActivityFeed
          activities={recentUpdates}
          emptyTitle="No recent updates"
          emptyDescription="Updates on your assigned matters will appear here."
          maxHeight="420px"
        />
      </Panel>
    </Stack>
  );
};
