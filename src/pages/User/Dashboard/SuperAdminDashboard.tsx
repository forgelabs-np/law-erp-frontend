import { Box, Grid, Icon, Stack } from "@chakra-ui/react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  Building2,
  Calendar,
  Database,
  FileText,
  PieChart,
  TrendingUp,
  Users,
  UsersRound,
} from "lucide-react";
import { useMemo, useState } from "react";

import { toRoleCounts, useSuperAdminDashboardQuery } from "@/api/dashboard";
import { RecentActivity } from "@/pages/User/CaseManagement/components/dashboard/RecentActivity";
import { relativeTime } from "@/pages/User/CaseManagement/utils/matterHelpers";

import {
  DashboardErrorState,
  DashboardRefreshButton,
  DashboardSkeleton,
  DonutChart,
  HeroBand,
  InsightBand,
  MetricStrip,
  MiniBarChart,
  Panel,
  PanelSection,
  ProgressRing,
  ScalarRow,
  SegmentedControl,
  StackedBar,
  TrendChart,
  UnsupportedRoleState,
  type DashboardInsight,
  type SegmentOption,
} from "./components";
import {
  formatMetric,
  getDashboardErrorMessage,
  getErrorStatus,
  isMetric,
  percentOf,
} from "./utils";
import { CHART_COLORS, seriesDelta, toStatTiles, trendSeries } from "./types";

type FirmView = "donut" | "bars";
type RoleView = "bars" | "distribution";

const FIRM_VIEWS: SegmentOption<FirmView>[] = [
  { value: "donut", label: "Donut", icon: PieChart },
  { value: "bars", label: "Bars", icon: BarChart3 },
];

const ROLE_VIEWS: SegmentOption<RoleView>[] = [
  { value: "bars", label: "Bars", icon: BarChart3 },
  { value: "distribution", label: "Share", icon: UsersRound },
];

/** Platform-wide dashboard for SUPER_ADMIN. */
export const SuperAdminDashboard = () => {
  const { data, isLoading, isError, error, refetch, isFetching } =
    useSuperAdminDashboardQuery();

  const [firmView, setFirmView] = useState<FirmView>("donut");
  const [roleView, setRoleView] = useState<RoleView>("bars");

  const isForbidden = getErrorStatus(error) === 403;

  // Stable view model: derived hooks depend on these references, not literals.
  const view = useMemo(
    () => ({
      firmStats: data?.firmStats ?? {},
      userStats: data?.userStats ?? {},
      caseStats: data?.caseStats ?? {},
      scraperStats: data?.scraperStats ?? {},
      trialAlerts: data?.trialAlerts ?? {},
      matterTrends: data?.matterTrends ?? [],
      recentActivity: data?.recentActivity ?? [],
    }),
    [data]
  );

  const {
    firmStats,
    userStats,
    caseStats,
    scraperStats,
    trialAlerts,
    matterTrends,
    recentActivity,
  } = view;

  /** Chronological copy of the real trend series. */
  const orderedTrends = useMemo(
    () =>
      [...matterTrends].sort((left, right) =>
        (left.date ?? "").localeCompare(right.date ?? "")
      ),
    [matterTrends]
  );

  const totalSpark = useMemo(
    () => trendSeries(orderedTrends, (point) => point.totalMatters),
    [orderedTrends]
  );
  const activeSpark = useMemo(
    () => trendSeries(orderedTrends, (point) => point.activeMatters),
    [orderedTrends]
  );
  const closedSpark = useMemo(
    () => trendSeries(orderedTrends, (point) => point.closedMatters),
    [orderedTrends]
  );

  const roleCounts = useMemo(
    () => toRoleCounts(userStats.byRole),
    [userStats.byRole]
  );

  const inactiveFirms = useMemo(() => {
    const { totalFirms, activeFirms, suspendedFirms, trialFirms } = firmStats;
    if (
      !isMetric(totalFirms) ||
      !isMetric(activeFirms) ||
      !isMetric(suspendedFirms) ||
      !isMetric(trialFirms)
    ) {
      return undefined;
    }
    return Math.max(0, totalFirms - activeFirms - suspendedFirms - trialFirms);
  }, [firmStats]);

  const firmSlices = useMemo(
    () =>
      [
        {
          label: "Active",
          value: firmStats.activeFirms,
          color: CHART_COLORS.green,
        },
        {
          label: "Trial",
          value: firmStats.trialFirms,
          color: CHART_COLORS.purple,
        },
        {
          label: "Suspended",
          value: firmStats.suspendedFirms,
          color: CHART_COLORS.amber,
        },
        { label: "Inactive", value: inactiveFirms, color: CHART_COLORS.red },
      ].filter(
        (slice): slice is { label: string; value: number; color: string } =>
          isMetric(slice.value)
      ),
    [firmStats, inactiveFirms]
  );

  const metrics = useMemo(
    () =>
      toStatTiles([
        {
          label: "Total Matters",
          value: caseStats.totalMatters,
          icon: <Icon as={FileText} boxSize={5} />,
          tone: "primary" as const,
          spark: totalSpark,
          delta: seriesDelta(totalSpark),
        },
        {
          label: "Active Matters",
          value: caseStats.activeMatters,
          icon: <Icon as={TrendingUp} boxSize={5} />,
          tone: "teal" as const,
          spark: activeSpark,
          delta: seriesDelta(activeSpark),
        },
        {
          label: "Closed Matters",
          value: caseStats.closedMatters,
          icon: <Icon as={FileText} boxSize={5} />,
          tone: "gray" as const,
          spark: closedSpark,
          delta: seriesDelta(closedSpark),
        },
        {
          label: "Total Users",
          value: userStats.totalUsers,
          icon: <Icon as={Users} boxSize={5} />,
          tone: "purple" as const,
        },
        {
          label: "Active Users",
          value: userStats.activeUsers,
          icon: <Icon as={Activity} boxSize={5} />,
          tone: "green" as const,
        },
      ]),
    [caseStats, userStats, totalSpark, activeSpark, closedSpark]
  );

  const insights = useMemo(() => {
    const list: DashboardInsight[] = [];
    if (
      isMetric(trialAlerts.expiringThisWeek) &&
      trialAlerts.expiringThisWeek > 0
    ) {
      list.push({
        tone: "amber",
        label: "Trials expiring this week",
        value: trialAlerts.expiringThisWeek,
        hint: "Follow up before they lapse",
        icon: Calendar,
      });
    }
    if (isMetric(trialAlerts.expired) && trialAlerts.expired > 0) {
      list.push({
        tone: "red",
        label: "Trials expired",
        value: trialAlerts.expired,
        hint: "Convert or suspend these firms",
        icon: AlertTriangle,
      });
    }
    if (isMetric(firmStats.suspendedFirms) && firmStats.suspendedFirms > 0) {
      list.push({
        tone: "orange",
        label: "Suspended firms",
        value: firmStats.suspendedFirms,
        hint: "Review outstanding issues",
        icon: Building2,
      });
    }
    return list;
  }, [trialAlerts, firmStats]);

  const roleBars = useMemo(
    () => roleCounts.map((role) => ({ label: role.label, value: role.value })),
    [roleCounts]
  );

  const roleSlices = useMemo(
    () =>
      roleCounts.map((role, index) => ({
        label: role.label,
        value: role.value,
        color: [
          CHART_COLORS.primary,
          CHART_COLORS.green,
          CHART_COLORS.purple,
          CHART_COLORS.amber,
          CHART_COLORS.teal,
          CHART_COLORS.gray,
        ][index % 6],
      })),
    [roleCounts]
  );

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

  // Adapted to the shape the existing RecentActivity component expects.
  const activity = recentActivity.map((item) => ({
    summary: item.summary ?? "",
    action: item.action ?? "",
    entityType: item.entityType ?? "",
    userName: item.userName ?? "",
    createdAt: item.createdAt ?? "",
  }));

  const hasScraperData =
    isMetric(scraperStats.courtsTracked) ||
    isMetric(scraperStats.totalHearings) ||
    isMetric(scraperStats.totalMatches) ||
    Boolean(scraperStats.lastScrapeTime);

  return (
    <Stack gap={6} padding={0}>
      <HeroBand
        eyebrow="Platform overview"
        title="Dashboard"
        subtitle="Firms, users, matters and court data across the platform."
        primary={{
          label: "Total Firms",
          value: formatMetric(firmStats.totalFirms),
        }}
        primaryTrend={totalSpark}
        stats={[
          {
            label: "Active firms",
            value: formatMetric(firmStats.activeFirms),
            icon: <Building2 size={12} />,
          },
          {
            label: "Total users",
            value: formatMetric(userStats.totalUsers),
            icon: <Users size={12} />,
          },
          {
            label: "Total matters",
            value: formatMetric(caseStats.totalMatters),
            icon: <FileText size={12} />,
          },
          {
            label: "Courts",
            value: formatMetric(scraperStats.courtsTracked),
            icon: <Database size={12} />,
          },
        ]}
        aside={
          isMetric(firmStats.totalFirms) && firmStats.totalFirms > 0 ? (
            <ProgressRing
              value={firmStats.activeFirms ?? 0}
              max={firmStats.totalFirms}
              label="Active firms"
              color="#276be1"
              display={`${percentOf(firmStats.activeFirms, firmStats.totalFirms)}%`}
            />
          ) : undefined
        }
        action={
          <DashboardRefreshButton
            onDark
            isFetching={isFetching}
            onClick={() => void refetch()}
          />
        }
      />

      <InsightBand insights={insights} caption="Needs attention" />

      <MetricStrip metrics={metrics} caption="Platform totals" />

      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={5}>
        <Panel
          title="Firm Status"
          subtitle="Where every firm stands right now"
          icon={<Icon as={Building2} boxSize={4} />}
          tone="primary"
          action={
            <SegmentedControl<FirmView>
              options={FIRM_VIEWS}
              value={firmView}
              onChange={setFirmView}
              ariaLabel="Firm status chart type"
            />
          }
        >
          {firmView === "donut" ? (
            <DonutChart
              data={firmSlices}
              centerLabel="Total firms"
              centerValue={formatMetric(firmStats.totalFirms)}
              emptyTitle="No firm data"
              emptyDescription="Firm status will appear once firms are onboarded."
            />
          ) : (
            <MiniBarChart
              data={firmSlices.map((slice) => ({
                label: slice.label,
                value: slice.value,
              }))}
              colors={firmSlices.map((slice) => slice.color)}
              valueName="firms"
              height={230}
              emptyTitle="No firm data"
              emptyDescription="Firm status will appear once firms are onboarded."
            />
          )}
        </Panel>

        <Panel
          title="Users by Role"
          subtitle="Accounts across all roles"
          icon={<Icon as={Users} boxSize={4} />}
          tone="purple"
          action={
            <SegmentedControl<RoleView>
              options={ROLE_VIEWS}
              value={roleView}
              onChange={setRoleView}
              ariaLabel="User distribution view"
            />
          }
        >
          {roleView === "bars" ? (
            <MiniBarChart
              data={roleBars}
              valueName="users"
              height={230}
              colors={roleSlices.map((slice) => slice.color)}
              emptyTitle="No user distribution"
              emptyDescription="A per-role breakdown appears once users are created."
            />
          ) : (
            <Box pt={2}>
              <StackedBar
                data={roleSlices}
                valueName="users"
                height={18}
                emptyTitle="No user distribution"
                emptyDescription="A per-role breakdown appears once users are created."
              />
            </Box>
          )}
        </Panel>
      </Grid>

      <Panel
        title="Matter Trends"
        subtitle="Toggle a series to isolate it — hover the chart for exact figures"
        icon={<Icon as={TrendingUp} boxSize={4} />}
        tone="teal"
      >
        <TrendChart data={matterTrends} height={280} />
      </Panel>

      <Panel
        title="Platform Operations"
        subtitle="Court data sync and the trials that need attention"
        icon={<Icon as={Database} boxSize={4} />}
        tone="blue"
        flush
      >
        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={0}>
          <PanelSection
            title="Court data sync"
            subtitle="Scraper health and coverage"
            icon={<Icon as={Database} boxSize={3.5} />}
            tone="blue"
            divided={false}
          >
            {hasScraperData ? (
              <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap={3}>
                {isMetric(scraperStats.courtsTracked) && (
                  <ScalarRow
                    label="Courts Tracked"
                    value={formatMetric(scraperStats.courtsTracked)}
                    tone="blue"
                  />
                )}
                {isMetric(scraperStats.totalHearings) && (
                  <ScalarRow
                    label="Total Hearings"
                    value={formatMetric(scraperStats.totalHearings)}
                    tone="blue"
                  />
                )}
                {isMetric(scraperStats.totalMatches) && (
                  <ScalarRow
                    label="Matches Found"
                    value={formatMetric(scraperStats.totalMatches)}
                    tone="green"
                  />
                )}
                {scraperStats.lastScrapeTime && (
                  <ScalarRow
                    label="Last Scrape"
                    value={relativeTime(scraperStats.lastScrapeTime)}
                    tone="gray"
                  />
                )}
              </Grid>
            ) : (
              <ScalarRow label="Status" value="No sync data yet" tone="gray" />
            )}
          </PanelSection>

          <Box borderLeft={{ lg: "1px solid" }} borderColor="gray.100">
            <PanelSection
              title="Trial alerts"
              subtitle="Trials that need action"
              icon={<Icon as={Bell} boxSize={3.5} />}
              tone="amber"
              divided={false}
            >
              <Stack gap={4}>
                {(isMetric(trialAlerts.expiringThisWeek) ||
                  isMetric(trialAlerts.expired)) && (
                  <StackedBar
                    data={[
                      {
                        label: "Expiring this week",
                        value: trialAlerts.expiringThisWeek ?? 0,
                        color: CHART_COLORS.amber,
                      },
                      {
                        label: "Expired",
                        value: trialAlerts.expired ?? 0,
                        color: CHART_COLORS.red,
                      },
                    ].filter((slice) => slice.value > 0)}
                    valueName="trials"
                    height={16}
                    legend={false}
                    emptyTitle="No trial alerts"
                    emptyDescription="No trials are expiring or expired."
                  />
                )}
                <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap={3}>
                  <ScalarRow
                    label="Expiring This Week"
                    value={formatMetric(trialAlerts.expiringThisWeek)}
                    tone="amber"
                  />
                  <ScalarRow
                    label="Expired"
                    value={formatMetric(trialAlerts.expired)}
                    tone="red"
                  />
                </Grid>
              </Stack>
            </PanelSection>
          </Box>
        </Grid>
      </Panel>

      {/* Header-less surface: RecentActivity renders its own title and link. */}
      <Panel tone="primary" flush>
        <RecentActivity activities={activity} maxItems={8} maxHeight="420px" />
      </Panel>
    </Stack>
  );
};
