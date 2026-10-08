import {
  Badge,
  Box,
  Button,
  Grid,
  HStack,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Calendar, FileText, Gavel, Scale, User } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  useGetCourtCaseQuery,
  useGetCourtCaseEventsQuery,
  useRecordJudgmentMutation,
  useUpdateCourtCaseStageMutation,
} from "../api/courtCase.api";
import { useGetMatterQuery } from "../api/matter.api";
import {
  useCreateCourtEventMutation,
  useUpdateCourtEventMutation,
  useCancelCourtEventMutation,
  useMarkEventHeldMutation,
} from "../api/courtEvent.api";
import { CourtEvent, CourtCaseStage } from "../types/matter.types";
import {
  courtCaseStageLabel,
  courtCaseStatusLabel,
  courtLevelLabel,
  formatDate,
  relationTypeLabel,
} from "../utils/matterHelpers";

import { SectionCard, SegmentedTabs } from "../components/ui";
import { PartiesWorkspaceCard } from "../components/PartiesWorkspaceCard";
import { CourtCaseEvents } from "../components/CourtCaseEvents";
import { StageChangeMenu } from "../components/StageChangeMenu";
import { MatterTeam } from "../components/MatterTeam";
import {
  CaseHearingHistory,
  CasePartiesCard,
  JudgmentCard,
  OverviewCard,
  RelatedCasesCard,
  UpcomingHearingCard,
} from "../components/overview";
import { CourtCaseHeaderCard } from "../components/CourtCaseHeaderCard";
import { CourtEventFormModal } from "../components/CourtEventFormModal";
import { CourtEventDetailsModal } from "../components/CourtEventDetailsModal";
import { EventHeldModal } from "../components/EventHeldModal";
import { JudgmentModal } from "../components/JudgmentModal";
import { CaseHearingStatus } from "../components/HearingStatus/CaseHearingStatus";
import { useCaseHearingStatus } from "@/shared/hooks/useScraper";
import { useModulePermissions } from "@/shared/hooks/usePermissions";

type Tab = "overview" | "events" | "roles" | "hearing";

/** Chronological comparison of two court events (date, then time). */
const compareScheduled = (a: CourtEvent, b: CourtEvent) =>
  a.scheduledDate.localeCompare(b.scheduledDate) ||
  (a.scheduledTime ?? "").localeCompare(b.scheduledTime ?? "");

const CourtCaseDetailPage = () => {
  const { matterNumber, courtCaseRef } = useParams<{
    matterNumber: string;
    courtCaseRef: string;
  }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const {
    data: courtCase,
    isLoading,
    isError,
  } = useGetCourtCaseQuery(courtCaseRef ?? "");
  const { data: events = [] } = useGetCourtCaseEventsQuery(courtCaseRef ?? "");
  const { data: matter } = useGetMatterQuery(matterNumber ?? "");

  // Hearing status query - using courtCaseNumber as caseNoInternal
  const caseNoInternal = courtCase?.courtCaseNumber;
  const {
    data: hearingStatus,
    isLoading: hearingLoading,
    refetch: refetchHearing,
  } = useCaseHearingStatus(caseNoInternal ?? "");
  const [isRefreshingHearing, setIsRefreshingHearing] = useState(false);

  const updateStageMutation = useUpdateCourtCaseStageMutation();
  const recordJudgmentMutation = useRecordJudgmentMutation();
  const createEventMutation = useCreateCourtEventMutation();
  const updateEventMutation = useUpdateCourtEventMutation();
  const cancelEventMutation = useCancelCourtEventMutation();
  const markHeldMutation = useMarkEventHeldMutation();

  const { canCreate, canEdit, canUpdateStatus } =
    useModulePermissions("CASE_MANAGEMENT");

  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CourtEvent | null>(null);
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);
  const [heldEvent, setHeldEvent] = useState<CourtEvent | null>(null);
  const [isJudgmentOpen, setIsJudgmentOpen] = useState(false);

  // ---------------------------------------------------------------------
  // Overview tab derivations - read-only views over already-loaded data.
  // ---------------------------------------------------------------------

  /** Earliest future SCHEDULED event on this court case. */
  const upcomingEvent = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return events
      .filter(
        (event) =>
          event.status === "SCHEDULED" &&
          event.scheduledDate?.slice(0, 10) >= today
      )
      .sort(compareScheduled)[0];
  }, [events]);

  /** Held/adjourned event whose nextEventId points at the upcoming hearing. */
  const previousEvent = useMemo(
    () =>
      upcomingEvent
        ? events.find((event) => event.nextEventId === upcomingEvent.id)
        : undefined,
    [events, upcomingEvent]
  );

  /** 1-based hearing number within the case chain, when derivable. */
  const sequence = useMemo(
    () =>
      upcomingEvent
        ? events.filter(
            (event) =>
              event.status !== "CANCELED" &&
              event.scheduledDate <= upcomingEvent.scheduledDate
          ).length
        : undefined,
    [events, upcomingEvent]
  );

  if (isLoading) {
    return (
      <Stack gap={6} padding={8}>
        {[...Array(5)].map((_, i) => (
          <Box key={i} h="60px" bg="gray.100" borderRadius="md" />
        ))}
      </Stack>
    );
  }

  if (isError || !courtCase) {
    return (
      <VStack gap={4} padding={8} textAlign="center">
        <Text fontSize="lg" fontWeight="500" color="gray.600">
          Court case not found
        </Text>
        <Button
          variant="outline"
          onClick={() => navigate(`/cases/${matterNumber ?? ""}`)}
        >
          Back to Matter
        </Button>
      </VStack>
    );
  }

  const roles = courtCase.roles ?? [];
  const parties = roles
    .map((role) => role.party)
    .filter((party): party is NonNullable<typeof party> => !!party);

  const handleStageChange = (stage: CourtCaseStage) => {
    if (!courtCaseRef) return;
    updateStageMutation.mutate({ courtCaseRef, data: { stage } });
  };

  const handleOpenEvent = (event: CourtEvent) => {
    setSelectedEvent(event);
    setIsEventDetailsOpen(true);
  };

  const handleEditEvent = (event: CourtEvent) => {
    setSelectedEvent(event);
    setIsEventDetailsOpen(false);
    setIsEventFormOpen(true);
  };

  const handleCancelEvent = (eventId: string) => {
    if (window.confirm("Are you sure you want to cancel this event?")) {
      cancelEventMutation.mutate(eventId, {
        onSuccess: () => setIsEventDetailsOpen(false),
      });
    }
  };

  const handleMarkHeld = (event: CourtEvent) => {
    setHeldEvent(event);
    setIsEventDetailsOpen(false);
  };

  const handleRefreshHearing = async () => {
    setIsRefreshingHearing(true);
    await refetchHearing();
    setIsRefreshingHearing(false);
  };

  return (
    <Stack gap={6} padding={8} bg="gray.50" minH="100vh">
      <CourtCaseHeaderCard
        courtCase={courtCase}
        eventCount={events.length}
        onBack={() => navigate(`/cases/${matterNumber ?? ""}`)}
        actions={
          <>
            {canCreate && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedEvent(null);
                  setIsEventFormOpen(true);
                }}
              >
                <Calendar size={14} /> Schedule Event
              </Button>
            )}
            {canCreate && !courtCase.judgmentSummary && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsJudgmentOpen(true)}
              >
                <Gavel size={14} /> Record Judgment
              </Button>
            )}
          </>
        }
      />

      <SegmentedTabs
        options={[
          { id: "overview", label: "Overview", icon: Scale },
          { id: "events", label: "Events", icon: Calendar },
          { id: "roles", label: "Parties & Roles", icon: User },
          { id: "hearing", label: "Hearing Status", icon: Calendar },
        ]}
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId as Tab)}
      />

      {/* Overview */}
      {activeTab === "overview" && (
        <Grid
          templateColumns={{
            base: "1fr",
            lg: "minmax(0, 2.05fr) minmax(0, 1fr)",
          }}
          gap={6}
          alignItems="start"
          w="100%"
        >
          <VStack gap={6} align="stretch" minW={0}>
            <UpcomingHearingCard
              event={upcomingEvent}
              previousEvent={previousEvent}
              sequence={sequence}
              onViewEvent={handleOpenEvent}
            />
            <OverviewCard
              title="Procedural Stage"
              description="Where this case currently stands in the procedural lifecycle."
              icon={Scale}
            >
              <HStack justify="space-between" flexWrap="wrap" gap={4}>
                <Box>
                  <Text fontSize="sm" color="gray.500" mb={1}>
                    Current stage
                  </Text>
                  <Text fontSize="lg" fontWeight="700" color="gray.900">
                    {courtCaseStageLabel(courtCase.stage)}
                  </Text>
                </Box>
                <StageChangeMenu
                  currentStage={courtCase.stage}
                  matterType={matter?.matterType ?? "CIVIL"}
                  disabled={
                    courtCase.status === "CLOSED" ||
                    courtCase.status === "DECIDED"
                  }
                  onStageChange={handleStageChange}
                />
              </HStack>
              <Text fontSize="xs" color="gray.500" mt={3}>
                The backend validates every stage transition. Invalid
                transitions show the court&apos;s business rule message.
              </Text>
            </OverviewCard>

            <OverviewCard
              title="Court Case Information"
              description="Key identifiers and details recorded for this proceeding."
              icon={FileText}
            >
              <Grid
                templateColumns={{
                  base: "1fr",
                  md: "repeat(2, minmax(0, 1fr))",
                  lg: "repeat(3, minmax(0, 1fr))",
                }}
                gap={4}
                wordBreak="break-word"
              >
                <Box>
                  <Text
                    fontSize="xs"
                    fontWeight="600"
                    color="gray.500"
                    textTransform="uppercase"
                  >
                    Relation
                  </Text>
                  <Text fontSize="sm" fontWeight="600">
                    {relationTypeLabel(courtCase.relationType)}
                  </Text>
                </Box>
                <Box>
                  <Text
                    fontSize="xs"
                    fontWeight="600"
                    color="gray.500"
                    textTransform="uppercase"
                  >
                    Court Level
                  </Text>
                  <Text fontSize="sm" fontWeight="600">
                    {courtLevelLabel(courtCase.courtLevel)}
                  </Text>
                </Box>
                <Box>
                  <Text
                    fontSize="xs"
                    fontWeight="600"
                    color="gray.500"
                    textTransform="uppercase"
                  >
                    Status
                  </Text>
                  <Text fontSize="sm" fontWeight="600">
                    {courtCaseStatusLabel(courtCase.status)}
                  </Text>
                </Box>
                <Box>
                  <Text
                    fontSize="xs"
                    fontWeight="600"
                    color="gray.500"
                    textTransform="uppercase"
                  >
                    Court Name
                  </Text>
                  <Text fontSize="sm" fontWeight="600">
                    {courtCase.courtName}
                  </Text>
                </Box>
                <Box>
                  <Text
                    fontSize="xs"
                    fontWeight="600"
                    color="gray.500"
                    textTransform="uppercase"
                  >
                    Court Case Number
                  </Text>
                  <Text fontSize="sm" fontWeight="600">
                    {courtCase.courtCaseNumber}
                  </Text>
                </Box>
                <Box>
                  <Text
                    fontSize="xs"
                    fontWeight="600"
                    color="gray.500"
                    textTransform="uppercase"
                  >
                    Filing Date
                  </Text>
                  <Text fontSize="sm" fontWeight="600">
                    {formatDate(courtCase.filingDate)}
                  </Text>
                </Box>
                <Box>
                  <Text
                    fontSize="xs"
                    fontWeight="600"
                    color="gray.500"
                    textTransform="uppercase"
                  >
                    Advocate
                  </Text>
                  <Text fontSize="sm" fontWeight="600">
                    {courtCase.advocateId ? "Assigned" : "-"}
                  </Text>
                </Box>
                <Box>
                  <Text
                    fontSize="xs"
                    fontWeight="600"
                    color="gray.500"
                    textTransform="uppercase"
                  >
                    Judge
                  </Text>
                  <Text fontSize="sm" fontWeight="600">
                    {courtCase.judgeName || "-"}
                  </Text>
                </Box>
                {courtCase.partyIsState !== undefined && (
                  <Box>
                    <Text
                      fontSize="xs"
                      fontWeight="600"
                      color="gray.500"
                      textTransform="uppercase"
                    >
                      Party is State
                    </Text>
                    <Text fontSize="sm" fontWeight="600">
                      {courtCase.partyIsState ? "Yes" : "No"}
                    </Text>
                  </Box>
                )}
              </Grid>
            </OverviewCard>

            {/* Civil-specific */}
            {(courtCase.mediationDate ||
              courtCase.mediationOutcome ||
              courtCase.writtenStatementDeadline) && (
              <OverviewCard
                title="Civil Case Details"
                description="Mediation and pleading milestones recorded on this case."
                icon={FileText}
              >
                <Grid
                  templateColumns={{
                    base: "1fr",
                    md: "repeat(2, minmax(0, 1fr))",
                    lg: "repeat(3, minmax(0, 1fr))",
                  }}
                  gap={4}
                  wordBreak="break-word"
                >
                  <Box>
                    <Text
                      fontSize="xs"
                      fontWeight="600"
                      color="gray.500"
                      textTransform="uppercase"
                    >
                      Mediation Date
                    </Text>
                    <Text fontSize="sm" fontWeight="600">
                      {formatDate(courtCase.mediationDate)}
                    </Text>
                  </Box>
                  <Box>
                    <Text
                      fontSize="xs"
                      fontWeight="600"
                      color="gray.500"
                      textTransform="uppercase"
                    >
                      Mediation Outcome
                    </Text>
                    <Text fontSize="sm" fontWeight="600">
                      {courtCase.mediationOutcome || "-"}
                    </Text>
                  </Box>
                  <Box>
                    <Text
                      fontSize="xs"
                      fontWeight="600"
                      color="gray.500"
                      textTransform="uppercase"
                    >
                      Written Statement Deadline
                    </Text>
                    <Text fontSize="sm" fontWeight="600">
                      {formatDate(courtCase.writtenStatementDeadline)}
                    </Text>
                  </Box>
                </Grid>
              </OverviewCard>
            )}

            {/* Criminal-specific */}
            {(courtCase.firNumber ||
              courtCase.firDate ||
              courtCase.policeStation ||
              courtCase.investigationAuthority ||
              courtCase.arrestDate ||
              courtCase.chargeSheetDate ||
              courtCase.bailStatus) && (
              <OverviewCard
                title="Criminal Case Details"
                description="Investigation and charge-sheet details recorded on this case."
                icon={FileText}
              >
                <Grid
                  templateColumns={{
                    base: "1fr",
                    md: "repeat(2, minmax(0, 1fr))",
                    lg: "repeat(3, minmax(0, 1fr))",
                  }}
                  gap={4}
                  wordBreak="break-word"
                >
                  <Box>
                    <Text
                      fontSize="xs"
                      fontWeight="600"
                      color="gray.500"
                      textTransform="uppercase"
                    >
                      FIR Number
                    </Text>
                    <Text fontSize="sm" fontWeight="600">
                      {courtCase.firNumber || "-"}
                    </Text>
                  </Box>
                  <Box>
                    <Text
                      fontSize="xs"
                      fontWeight="600"
                      color="gray.500"
                      textTransform="uppercase"
                    >
                      FIR Date
                    </Text>
                    <Text fontSize="sm" fontWeight="600">
                      {formatDate(courtCase.firDate)}
                    </Text>
                  </Box>
                  <Box>
                    <Text
                      fontSize="xs"
                      fontWeight="600"
                      color="gray.500"
                      textTransform="uppercase"
                    >
                      Police Station
                    </Text>
                    <Text fontSize="sm" fontWeight="600">
                      {courtCase.policeStation || "-"}
                    </Text>
                  </Box>
                  <Box>
                    <Text
                      fontSize="xs"
                      fontWeight="600"
                      color="gray.500"
                      textTransform="uppercase"
                    >
                      Investigation Authority
                    </Text>
                    <Text fontSize="sm" fontWeight="600">
                      {courtCase.investigationAuthority || "-"}
                    </Text>
                  </Box>
                  <Box>
                    <Text
                      fontSize="xs"
                      fontWeight="600"
                      color="gray.500"
                      textTransform="uppercase"
                    >
                      Arrest Date
                    </Text>
                    <Text fontSize="sm" fontWeight="600">
                      {formatDate(courtCase.arrestDate)}
                    </Text>
                  </Box>
                  <Box>
                    <Text
                      fontSize="xs"
                      fontWeight="600"
                      color="gray.500"
                      textTransform="uppercase"
                    >
                      Charge Sheet Date
                    </Text>
                    <Text fontSize="sm" fontWeight="600">
                      {formatDate(courtCase.chargeSheetDate)}
                    </Text>
                  </Box>
                  <Box>
                    <Text
                      fontSize="xs"
                      fontWeight="600"
                      color="gray.500"
                      textTransform="uppercase"
                    >
                      Bail Status
                    </Text>
                    <Text fontSize="sm" fontWeight="600">
                      {courtCase.bailStatus || "-"}
                    </Text>
                  </Box>
                </Grid>
              </OverviewCard>
            )}

            {/* Judgment */}
            {(courtCase.judgmentDate || courtCase.judgmentSummary) && (
              <JudgmentCard courtCase={courtCase} />
            )}

            <CaseHearingHistory events={events} onViewEvent={handleOpenEvent} />
          </VStack>

          {/* ==================== Sidebar ==================== */}
          <VStack gap={6} align="stretch" minW={0}>
            <CasePartiesCard roles={roles} parties={parties} />
            <MatterTeam
              matterNumber={matterNumber ?? ""}
              matterTitle={matter?.title}
            />
            <RelatedCasesCard
              courtCases={matter?.courtCases ?? []}
              currentCourtCaseRef={courtCase.ourCourtCaseRef}
              onOpenCase={(ref) =>
                navigate(`/cases/${matterNumber ?? ""}/court-cases/${ref}`)
              }
            />
          </VStack>
        </Grid>
      )}

      {/* Events */}
      {activeTab === "events" && (
        <CourtCaseEvents
          events={events}
          onView={handleOpenEvent}
          onSchedule={() => {
            setSelectedEvent(null);
            setIsEventFormOpen(true);
          }}
        />
      )}

      {/* Roles */}
      {activeTab === "roles" && (
        <PartiesWorkspaceCard
          title="Parties & Roles"
          subtitle="Parties attached to this court case along with their procedural roles and representation."
          parties={parties}
          roles={roles}
          entityType="court case"
        />
      )}

      {/* Hearing Status */}
      {activeTab === "hearing" && (
        <CaseHearingStatus
          data={hearingStatus ?? null}
          isLoading={hearingLoading}
          onRefresh={handleRefreshHearing}
          isRefreshing={isRefreshingHearing}
        />
      )}

      {/* Modals */}
      <CourtEventFormModal
        isOpen={isEventFormOpen}
        onClose={() => {
          setIsEventFormOpen(false);
          setSelectedEvent(null);
        }}
        isSubmitting={
          createEventMutation.isPending || updateEventMutation.isPending
        }
        initialData={selectedEvent}
        onSubmit={(data) => {
          if (selectedEvent) {
            updateEventMutation.mutate(
              { eventId: selectedEvent.id, data },
              { onSuccess: () => setIsEventFormOpen(false) }
            );
          } else if (courtCaseRef) {
            createEventMutation.mutate(
              { courtCaseRef, data },
              { onSuccess: () => setIsEventFormOpen(false) }
            );
          }
        }}
      />

      <CourtEventDetailsModal
        event={selectedEvent}
        isOpen={isEventDetailsOpen}
        onClose={() => setIsEventDetailsOpen(false)}
        onEdit={handleEditEvent}
        onCancel={handleCancelEvent}
        onMarkHeld={handleMarkHeld}
      />

      <EventHeldModal
        isOpen={!!heldEvent}
        onClose={() => setHeldEvent(null)}
        isSubmitting={markHeldMutation.isPending}
        event={heldEvent}
        onRecordJudgment={() => setIsJudgmentOpen(true)}
        onSubmit={(data) => {
          if (!heldEvent) return;
          markHeldMutation.mutate(
            { eventId: heldEvent.id, data },
            { onSuccess: () => setHeldEvent(null) }
          );
        }}
      />

      <JudgmentModal
        isOpen={isJudgmentOpen}
        onClose={() => setIsJudgmentOpen(false)}
        isSubmitting={recordJudgmentMutation.isPending}
        parties={parties}
        onSubmit={(data) => {
          if (!courtCaseRef) return;
          recordJudgmentMutation.mutate(
            { courtCaseRef, data },
            { onSuccess: () => setIsJudgmentOpen(false) }
          );
        }}
      />
    </Stack>
  );
};

export default CourtCaseDetailPage;
