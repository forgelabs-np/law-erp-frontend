import { Badge, Box, Grid, HStack, Icon, Stack, Text } from "@chakra-ui/react";
import {
  Banknote,
  CalendarDays,
  ChevronRight,
  FileText,
  FolderOpen,
  History,
  List as ListIcon,
  PieChart,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { DashboardEventItem, useClientDashboardQuery } from "@/api/dashboard";
import {
  formatDate,
  formatTime,
} from "@/pages/User/CaseManagement/utils/matterHelpers";
import { useModulePermissions } from "@/shared/hooks/usePermissions";

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
  MatterList,
  MetricStrip,
  Panel,
  PanelSection,
  ProgressRing,
  ScalarRow,
  SegmentedControl,
  UnsupportedRoleState,
  type DashboardInsight,
  type SegmentOption,
} from "./components";
import {
  formatAmount,
  formatMetric,
  getDashboardErrorMessage,
  getErrorStatus,
  humanizeLabel,
  isMetric,
  percentOf,
  relativeDayLabel,
  toDateParts,
} from "./utils";
import { CHART_COLORS, toStatTiles } from "./types";

type MatterView = "list" | "status";

const MATTER_VIEWS: SegmentOption<MatterView>[] = [
  { value: "list", label: "List", icon: ListIcon },
  { value: "status", label: "Status", icon: PieChart },
];

/** Prominent, interactive summary of the next scheduled court date. */
const NextHearingBanner = ({
  event,
  canOpen,
}: {
  event: DashboardEventItem;
  canOpen: boolean;
}) => {
  const parts = toDateParts(event.scheduledDate);
  const daysLabel = relativeDayLabel(event.scheduledDate);

  const details = [
    event.courtName,
    event.courtRoom ? `Room ${event.courtRoom}` : "",
    event.scheduledTime ? formatTime(event.scheduledTime) : "",
    event.attendingAdvocateName ?? "",
  ].filter(Boolean);

  const body = (
    <HStack gap={5} align="center" flexWrap="wrap">
      <Stack
        gap={0}
        align="center"
        justify="center"
        bg="whiteAlpha.200"
        borderRadius="lg"
        px={4}
        py={2}
        minW="72px"
      >
        <Text color="white" fontSize="3xl" fontWeight={800} lineHeight="1.1">
          {parts?.day ?? "—"}
        </Text>
        <Text
          color="whiteAlpha.800"
          fontSize="xs"
          fontWeight={700}
          letterSpacing="0.08em"
        >
          {parts?.month ?? ""}
        </Text>
      </Stack>

      <Stack gap={1} flex={1} minW="0">
        <Text
          color="whiteAlpha.800"
          fontSize="xs"
          fontWeight={700}
          textTransform="uppercase"
          letterSpacing="0.08em"
        >
          Next Hearing
        </Text>
        <Text color="white" fontSize="xl" fontWeight={700} lineHeight="1.3">
          {event.eventType ? humanizeLabel(event.eventType) : "Court hearing"}
        </Text>
        {event.matterTitle && (
          <Text color="whiteAlpha.800" fontSize="sm" lineClamp={1}>
            {[event.matterTitle, event.matterNumber]
              .filter(Boolean)
              .join(" · ")}
          </Text>
        )}
        {details.length > 0 && (
          <Text color="whiteAlpha.700" fontSize="xs" lineClamp={2}>
            {details.join(" · ")}
          </Text>
        )}
      </Stack>

      <HStack gap={3} flexShrink={0} align="center">
        <Badge
          bg="white"
          color="primary.700"
          px={3}
          py={1}
          borderRadius="full"
          fontSize="xs"
          fontWeight={700}
          whiteSpace="nowrap"
        >
          {daysLabel}
        </Badge>
        {canOpen && <ChevronRight size={16} color="#ffffff" />}
      </HStack>
    </HStack>
  );

  const shell = {
    bgGradient: "to-br",
    gradientFrom: "primary.700",
    gradientVia: "primary.600",
    gradientTo: "primary.500",
    borderRadius: "xl",
    px: 6,
    py: 5,
    boxShadow: "0 8px 24px -12px rgba(0,58,179,0.55)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  } as const;

  if (!canOpen) {
    return <Box {...shell}>{body}</Box>;
  }

  return (
    <Link
      to={`/cases/${event.matterNumber}`}
      style={{ display: "block", textDecoration: "none" }}
    >
      <Box
        {...shell}
        _hover={{
          transform: "translateY(-2px)",
          boxShadow: "0 14px 30px -14px rgba(0,58,179,0.7)",
        }}
      >
        {body}
      </Box>
    </Link>
  );
};

/** Simplified, client-facing dashboard for CLIENT. */
export const ClientDashboard = () => {
  const { canView } = useModulePermissions("CASE_MANAGEMENT");
  const { data, isLoading, isError, error, refetch, isFetching } =
    useClientDashboardQuery();

  const [matterView, setMatterView] = useState<MatterView>("list");

  const isForbidden = getErrorStatus(error) === 403;

  // Stable view model: derived hooks depend on these references, not literals.
  const view = useMemo(
    () => ({
      stats: data?.myMatterStats ?? {},
      invoiceStats: data?.myInvoiceStats ?? {},
      matters: data?.myMatters ?? [],
      upcomingEvents: data?.myUpcomingEvents ?? [],
      outstandingInvoices: data?.myOutstandingInvoices ?? [],
      recentUpdates: data?.myRecentUpdates ?? [],
      nextHearing: data?.myNextHearing ?? null,
    }),
    [data]
  );

  const {
    stats,
    invoiceStats,
    matters,
    upcomingEvents,
    outstandingInvoices,
    recentUpdates,
    nextHearing,
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

  const metrics = useMemo(
    () =>
      toStatTiles([
        {
          label: "Active Matters",
          value: stats.activeMatters,
          icon: <Icon as={FolderOpen} boxSize={5} />,
          tone: "green" as const,
        },
        {
          label: "Closed Matters",
          value: stats.closedMatters,
          icon: <Icon as={FileText} boxSize={5} />,
          tone: "gray" as const,
        },
        {
          label: "Upcoming Events",
          value: upcomingEvents.length,
          icon: <Icon as={CalendarDays} boxSize={5} />,
          tone: "purple" as const,
        },
        {
          label: "Outstanding Invoices",
          value: outstandingInvoices.length,
          icon: <Icon as={Banknote} boxSize={5} />,
          tone: "amber" as const,
        },
      ]),
    [stats, upcomingEvents.length, outstandingInvoices.length]
  );

  const insights = useMemo(() => {
    const list: DashboardInsight[] = [];

    if (nextHearing?.scheduledDate) {
      const days = relativeDayLabel(nextHearing.scheduledDate);
      list.push({
        tone: "primary",
        label: "Next hearing",
        value: days,
        hint: nextHearing.scheduledDate
          ? formatDate(nextHearing.scheduledDate)
          : undefined,
        icon: CalendarDays,
      });
    }

    const outstandingCount = outstandingInvoices.length;
    if (outstandingCount > 0) {
      list.push({
        tone: "amber",
        label: "Outstanding invoices",
        value: outstandingCount,
        hint: isMetric(invoiceStats.outstandingAmount)
          ? formatAmount(invoiceStats.outstandingAmount)
          : undefined,
        icon: Banknote,
      });
    }

    return list;
  }, [nextHearing, outstandingInvoices.length, invoiceStats.outstandingAmount]);

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
    isMetric(invoiceStats.totalAmount) ||
    isMetric(invoiceStats.outstandingAmount);

  const canOpenNextHearing = canView && Boolean(nextHearing?.matterNumber);

  return (
    <Stack gap={6} padding={2}>
      <HeroBand
        eyebrow="Client portal"
        title="My Matters"
        subtitle="Track your cases, upcoming hearings and invoices."
        primary={{
          label: "Total Matters",
          value: formatMetric(stats.totalMatters),
        }}
        stats={[
          {
            label: "Active",
            value: formatMetric(stats.activeMatters),
            icon: <FolderOpen size={12} />,
          },
          {
            label: "Upcoming events",
            value: upcomingEvents.length,
            icon: <CalendarDays size={12} />,
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

      <InsightBand insights={insights} caption="At a glance" />

      {nextHearing && (
        <NextHearingBanner event={nextHearing} canOpen={canOpenNextHearing} />
      )}

      <MetricStrip metrics={metrics} caption="My matters" />

      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={5}>
        <Panel
          title="My Matters"
          subtitle="Cases the firm is handling for you"
          icon={<Icon as={FileText} boxSize={4} />}
          tone="primary"
          action={
            <SegmentedControl<MatterView>
              options={MATTER_VIEWS}
              value={matterView}
              onChange={setMatterView}
              ariaLabel="My matters view"
            />
          }
        >
          {matterView === "list" ? (
            <MatterList
              matters={matters}
              emptyTitle="No matters yet"
              emptyDescription="Your matters will appear here once they are opened."
            />
          ) : (
            <DonutChart
              data={matterSlices}
              centerLabel="Matters"
              centerValue={formatMetric(stats.totalMatters)}
              emptyTitle="No matter data"
              emptyDescription="A status breakdown appears once your matters are opened."
            />
          )}
        </Panel>

        <Panel
          title="Upcoming Events"
          subtitle="Your next court dates"
          icon={<Icon as={CalendarDays} boxSize={4} />}
          tone="purple"
        >
          <EventList
            events={upcomingEvents}
            variant="timeline"
            highlightFirst
            emptyTitle="No upcoming events"
            emptyDescription="Your next hearings and court dates will appear here."
          />
        </Panel>
      </Grid>

      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={5}>
        <Panel
          title="Billing & Invoices"
          subtitle="Your invoices and payments"
          icon={<Icon as={Banknote} boxSize={4} />}
          tone="teal"
        >
          {hasInvoiceStats ? (
            <Stack gap={5}>
              <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap={4}>
                {isMetric(invoiceStats.totalAmount) &&
                  invoiceStats.totalAmount > 0 && (
                    <Stack align="center" justify="center">
                      <ProgressRing
                        value={invoiceStats.paidAmount ?? 0}
                        max={invoiceStats.totalAmount}
                        label="Paid"
                        color={CHART_COLORS.green}
                        display={`${percentOf(invoiceStats.paidAmount, invoiceStats.totalAmount)}%`}
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
                title="Outstanding invoices"
                subtitle="Awaiting payment"
                icon={<Icon as={Banknote} boxSize={3.5} />}
                tone="amber"
              >
                <InvoiceList
                  invoices={outstandingInvoices}
                  emptyTitle="No outstanding invoices"
                  emptyDescription="Nothing is awaiting payment right now."
                />
              </PanelSection>
            </Stack>
          ) : (
            <ScalarRow
              label="Billing"
              value="No invoice data yet"
              tone="gray"
            />
          )}
        </Panel>

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
            emptyDescription="Updates on your matters will appear here."
            maxHeight="420px"
          />
        </Panel>
      </Grid>
    </Stack>
  );
};
