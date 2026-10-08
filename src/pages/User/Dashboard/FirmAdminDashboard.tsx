import { Box, Grid, Icon, Stack } from "@chakra-ui/react";
import {
  AlertTriangle,
  BarChart3,
  Banknote,
  CalendarClock,
  CalendarDays,
  FileText,
  FolderOpen,
  History,
  List,
  PieChart,
  RefreshCcw,
  Timer,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

import { useFirmAdminDashboardQuery } from "@/api/dashboard";
import { useFirm } from "@/shared/hooks/useAuth";

import {
  ActivityFeed,
  DashboardErrorState,
  DashboardRefreshButton,
  DashboardSkeleton,
  DonutChart,
  EventList,
  HeroBand,
  InsightBand,
  InvoiceList,
  MetricStrip,
  MiniBarChart,
  Panel,
  PanelSection,
  ProgressRing,
  RenewalList,
  ScalarRow,
  SegmentedControl,
  StackedBar,
  UnsupportedRoleState,
  type DashboardInsight,
  type SegmentOption,
} from "./components";
import {
  formatAmount,
  formatMetric,
  getDashboardErrorMessage,
  getErrorStatus,
  groupEventsByDay,
  isMetric,
  percentOf,
} from "./utils";
import { CHART_COLORS, toStatTiles } from "./types";

type StatusView = "donut" | "bars";
type HearingView = "chart" | "list";

const STATUS_VIEWS: SegmentOption<StatusView>[] = [
  { value: "donut", label: "Donut", icon: PieChart },
  { value: "bars", label: "Bars", icon: BarChart3 },
];

const HEARING_VIEWS: SegmentOption<HearingView>[] = [
  { value: "chart", label: "Load", icon: BarChart3 },
  { value: "list", label: "List", icon: List },
];

/** Operational command centre for FIRM_ADMIN — firm-wide, never "my" data. */
export const FirmAdminDashboard = () => {
  const firm = useFirm();
  const { data, isLoading, isError, error, refetch, isFetching } =
    useFirmAdminDashboardQuery();

  const [statusView, setStatusView] = useState<StatusView>("donut");
  const [hearingView, setHearingView] = useState<HearingView>("chart");

  const isForbidden = getErrorStatus(error) === 403;

  // Stable view model: derived hooks depend on these references, not literals.
  const view = useMemo(
    () => ({
      caseStats: data?.caseStats ?? {},
      invoiceStats: data?.invoiceStats ?? {},
      renewalStats: data?.renewalStats ?? {},
      todayEvents: data?.todayEvents ?? [],
      upcomingHearings: data?.upcomingHearings ?? [],
      overdueInvoices: data?.overdueInvoices ?? [],
      upcomingRenewals: data?.upcomingRenewals ?? [],
      teamCaseload: data?.teamCaseload ?? [],
      recentActivity: data?.recentActivity ?? [],
    }),
    [data]
  );

  const {
    caseStats: stats,
    invoiceStats,
    renewalStats,
    todayEvents,
    upcomingHearings,
    overdueInvoices,
    upcomingRenewals,
    teamCaseload,
    recentActivity,
  } = view;

  const matterSlices = useMemo(
    () =>
      [
        {
          label: "Active",
          value: stats.activeMatters,
          color: CHART_COLORS.green,
        },
        {
          label: "Dormant",
          value: stats.dormantMatters,
          color: CHART_COLORS.amber,
        },
        {
          label: "Closed",
          value: stats.closedMatters,
          color: CHART_COLORS.gray,
        },
      ].filter(
        (slice): slice is { label: string; value: number; color: string } =>
          isMetric(slice.value)
      ),
    [stats]
  );

  const hearingsByDay = useMemo(
    () => groupEventsByDay(upcomingHearings, 10),
    [upcomingHearings]
  );

  const caseloadBars = useMemo(
    () =>
      teamCaseload
        .map((member) => {
          const openCount = member.openMatters ?? member.activeMatters;
          const value = isMetric(openCount)
            ? openCount
            : isMetric(member.totalMatters)
              ? member.totalMatters
              : undefined;
          return {
            label: member.userName ?? "Unnamed",
            value: value ?? 0,
            tooltipLabel: [member.userName, member.role]
              .filter(Boolean)
              .join(" · "),
            hasValue: isMetric(value),
          };
        })
        .filter((item) => item.hasValue)
        .map(({ label, value, tooltipLabel }) => ({
          label,
          value,
          tooltipLabel,
        })),
    [teamCaseload]
  );

  const collectionRing = useMemo(() => {
    if (isMetric(invoiceStats.totalAmount) && invoiceStats.totalAmount > 0) {
      return {
        value: invoiceStats.paidAmount ?? 0,
        max: invoiceStats.totalAmount,
        display: `${percentOf(invoiceStats.paidAmount, invoiceStats.totalAmount)}%`,
        label: "Collected",
      };
    }
    if (
      isMetric(invoiceStats.totalInvoices) &&
      invoiceStats.totalInvoices > 0
    ) {
      return {
        value: invoiceStats.paidInvoices ?? 0,
        max: invoiceStats.totalInvoices,
        display: `${percentOf(invoiceStats.paidInvoices, invoiceStats.totalInvoices)}%`,
        label: "Paid invoices",
      };
    }
    return null;
  }, [invoiceStats]);

  const metrics = useMemo(
    () =>
      toStatTiles([
        {
          label: "Active Matters",
          value: stats.activeMatters,
          icon: <Icon as={CalendarDays} boxSize={5} />,
          tone: "green" as const,
        },
        {
          label: "Dormant",
          value: stats.dormantMatters,
          icon: <Icon as={CalendarClock} boxSize={5} />,
          tone: "orange" as const,
        },
        {
          label: "Closed",
          value: stats.closedMatters,
          icon: <Icon as={FileText} boxSize={5} />,
          tone: "gray" as const,
        },
        {
          label: "Stale Matters",
          value: stats.staleMatters,
          icon: <Icon as={Timer} boxSize={5} />,
          tone: "red" as const,
        },
        {
          label: "Overdue Invoices",
          value: invoiceStats.overdueInvoices,
          icon: <Icon as={Banknote} boxSize={5} />,
          tone: "amber" as const,
        },
        {
          label: "Due This Month",
          value: renewalStats.dueThisMonth,
          icon: <Icon as={RefreshCcw} boxSize={5} />,
          tone: "purple" as const,
        },
      ]),
    [stats, invoiceStats, renewalStats]
  );

  const insights = useMemo(() => {
    const list: DashboardInsight[] = [];
    if (isMetric(stats.staleMatters) && stats.staleMatters > 0) {
      list.push({
        tone: "red",
        label: "Stale matters",
        value: stats.staleMatters,
        hint: "No hearing recorded recently",
        icon: Timer,
      });
    }
    const overdueCount = invoiceStats.overdueInvoices;
    if (isMetric(overdueCount) && overdueCount > 0) {
      list.push({
        tone: "amber",
        label: "Overdue invoices",
        value: overdueCount,
        hint: isMetric(invoiceStats.overdueAmount)
          ? formatAmount(invoiceStats.overdueAmount)
          : undefined,
        icon: Banknote,
      });
    }
    if (isMetric(stats.dormantMatters) && stats.dormantMatters > 0) {
      list.push({
        tone: "orange",
        label: "Dormant matters",
        value: stats.dormantMatters,
        hint: "Consider follow-up",
        icon: CalendarClock,
      });
    }
    if (
      isMetric(renewalStats.overdueRenewals) &&
      renewalStats.overdueRenewals > 0
    ) {
      list.push({
        tone: "purple",
        label: "Overdue renewals",
        value: renewalStats.overdueRenewals,
        hint: "Renewal deadlines passed",
        icon: RefreshCcw,
      });
    }
    return list;
  }, [stats, invoiceStats, renewalStats]);

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

  const hasInvoiceStats =
    isMetric(invoiceStats.totalInvoices) ||
    isMetric(invoiceStats.paidInvoices) ||
    isMetric(invoiceStats.outstandingAmount) ||
    isMetric(invoiceStats.overdueAmount);

  const hasRenewalStats =
    isMetric(renewalStats.totalRenewals) ||
    isMetric(renewalStats.dueThisMonth) ||
    isMetric(renewalStats.overdueRenewals) ||
    isMetric(renewalStats.upcomingRenewals);

  return (
    <Stack gap={6} padding={2}>
      <HeroBand
        eyebrow="Firm overview"
        title={firm?.name ?? "Dashboard"}
        subtitle="Hearings, matters, billing and renewals across the firm."
        primary={{
          label: "Total Matters",
          value: formatMetric(stats.totalMatters),
        }}
        primaryTrend={
          hearingsByDay.length > 1
            ? hearingsByDay.map((day) => day.value)
            : undefined
        }
        stats={[
          {
            label: "Active",
            value: formatMetric(stats.activeMatters),
            icon: <FolderOpen size={12} />,
          },
          {
            label: "Today's hearings",
            value: todayEvents.length,
            icon: <CalendarDays size={12} />,
          },
          {
            label: "Upcoming",
            value: upcomingHearings.length,
            icon: <CalendarClock size={12} />,
          },
          {
            label: "Outstanding",
            value: formatAmount(invoiceStats.outstandingAmount),
            icon: <Banknote size={12} />,
          },
        ]}
        aside={
          isMetric(stats.totalMatters) && stats.totalMatters > 0 ? (
            <ProgressRing
              value={stats.activeMatters ?? 0}
              max={stats.totalMatters}
              label="Active matters"
              color="#7dd3fc"
              display={`${percentOf(stats.activeMatters, stats.totalMatters)}%`}
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

      <MetricStrip metrics={metrics} caption="Firm totals" />

      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={5}>
        <Panel
          title="Matter Portfolio"
          subtitle="Distribution across the firm"
          icon={<Icon as={FileText} boxSize={4} />}
          tone="primary"
          action={
            <SegmentedControl<StatusView>
              options={STATUS_VIEWS}
              value={statusView}
              onChange={setStatusView}
              ariaLabel="Matter status chart type"
            />
          }
        >
          {statusView === "donut" ? (
            <DonutChart
              data={matterSlices}
              centerLabel="Matters"
              centerValue={formatMetric(stats.totalMatters)}
              emptyTitle="No matter data"
              emptyDescription="Matter distribution appears once matters are created."
            />
          ) : (
            <Box pt={2}>
              <StackedBar
                data={matterSlices}
                valueName="matters"
                height={18}
                emptyTitle="No matter data"
                emptyDescription="Matter distribution appears once matters are created."
              />
            </Box>
          )}
        </Panel>

        <Panel
          title="Court Schedule"
          subtitle="Today's events and the hearings ahead"
          icon={<Icon as={CalendarClock} boxSize={4} />}
          tone="purple"
          flush
        >
          <PanelSection
            title="Today"
            subtitle="Hearings and Tarik scheduled today"
            icon={<Icon as={CalendarDays} boxSize={3.5} />}
            tone="teal"
            divided={false}
          >
            <EventList
              events={todayEvents}
              variant="timeline"
              highlightFirst
              emptyTitle="No events today"
              emptyDescription="No hearings or Tarik/Peshi are scheduled for today."
            />
          </PanelSection>

          <PanelSection
            title="Upcoming"
            subtitle="Next scheduled court dates"
            icon={<Icon as={CalendarClock} boxSize={3.5} />}
            tone="purple"
            action={
              <SegmentedControl<HearingView>
                options={HEARING_VIEWS}
                value={hearingView}
                onChange={setHearingView}
                ariaLabel="Upcoming hearings view"
              />
            }
          >
            {hearingView === "chart" ? (
              <MiniBarChart
                data={hearingsByDay}
                valueName="hearings"
                color={CHART_COLORS.purple}
                emptyTitle="No upcoming hearings"
                emptyDescription="Scheduled hearings will appear here."
              />
            ) : (
              <EventList
                events={upcomingHearings}
                emptyTitle="No upcoming hearings"
                emptyDescription="Scheduled hearings will appear here."
              />
            )}
          </PanelSection>
        </Panel>
      </Grid>

      <Panel
        title="Billing & Collections"
        subtitle="Invoices, payments and overdue amounts"
        icon={<Icon as={Banknote} boxSize={4} />}
        tone="teal"
      >
        {hasInvoiceStats ? (
          <Stack gap={5}>
            <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap={4}>
              {collectionRing && (
                <Stack align="center" justify="center">
                  <ProgressRing
                    value={collectionRing.value}
                    max={collectionRing.max}
                    label={collectionRing.label}
                    color={CHART_COLORS.green}
                    display={collectionRing.display}
                  />
                </Stack>
              )}
              <Grid templateColumns="1fr" gap={2.5}>
                {isMetric(invoiceStats.totalInvoices) && (
                  <ScalarRow
                    label="Total Invoices"
                    value={formatMetric(invoiceStats.totalInvoices)}
                    tone="teal"
                  />
                )}
                {isMetric(invoiceStats.unpaidInvoices) && (
                  <ScalarRow
                    label="Unpaid"
                    value={formatMetric(invoiceStats.unpaidInvoices)}
                    tone="amber"
                  />
                )}
                {isMetric(invoiceStats.totalAmount) && (
                  <ScalarRow
                    label="Total Billed"
                    value={formatAmount(invoiceStats.totalAmount)}
                    tone="gray"
                  />
                )}
                {isMetric(invoiceStats.outstandingAmount) && (
                  <ScalarRow
                    label="Outstanding"
                    value={formatAmount(invoiceStats.outstandingAmount)}
                    tone="red"
                  />
                )}
              </Grid>
            </Grid>

            <PanelSection
              title="Overdue invoices"
              subtitle="Past their due date"
              icon={<Icon as={AlertTriangle} boxSize={3.5} />}
              tone="red"
            >
              <InvoiceList
                invoices={overdueInvoices}
                emptyTitle="No overdue invoices"
                emptyDescription="Invoices past their due date will appear here."
              />
            </PanelSection>
          </Stack>
        ) : (
          <ScalarRow label="Billing" value="No invoice data yet" tone="gray" />
        )}
      </Panel>

      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={5}>
        <Panel
          title="Renewals"
          subtitle="Upcoming renewal deadlines"
          icon={<Icon as={RefreshCcw} boxSize={4} />}
          tone="amber"
        >
          <Stack gap={4}>
            {hasRenewalStats ? (
              <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap={3}>
                {isMetric(renewalStats.totalRenewals) && (
                  <ScalarRow
                    label="Total Renewals"
                    value={formatMetric(renewalStats.totalRenewals)}
                    tone="amber"
                  />
                )}
                {isMetric(renewalStats.dueThisMonth) && (
                  <ScalarRow
                    label="Due This Month"
                    value={formatMetric(renewalStats.dueThisMonth)}
                    tone="amber"
                  />
                )}
                {isMetric(renewalStats.overdueRenewals) && (
                  <ScalarRow
                    label="Overdue"
                    value={formatMetric(renewalStats.overdueRenewals)}
                    tone="red"
                  />
                )}
                {isMetric(renewalStats.upcomingRenewals) && (
                  <ScalarRow
                    label="Upcoming"
                    value={formatMetric(renewalStats.upcomingRenewals)}
                    tone="purple"
                  />
                )}
              </Grid>
            ) : null}
            <RenewalList renewals={upcomingRenewals} />
          </Stack>
        </Panel>

        <Panel
          title="Team Load"
          subtitle="Open matters per team member"
          icon={<Icon as={Users} boxSize={4} />}
          tone="primary"
        >
          <MiniBarChart
            data={caseloadBars}
            valueName="open matters"
            horizontal
            height={Math.max(180, caseloadBars.length * 46)}
            color={CHART_COLORS.primary}
            emptyTitle="No assigned team members"
            emptyDescription="Workload appears once matters are assigned."
          />
        </Panel>
      </Grid>

      <Panel
        title="Recent Activity"
        subtitle="Latest changes across the firm"
        icon={<Icon as={History} boxSize={4} />}
        tone="purple"
        flush
      >
        <ActivityFeed activities={recentActivity} maxHeight="420px" />
      </Panel>
    </Stack>
  );
};
