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
import {
  ArrowLeft,
  Calendar,
  FileText,
  Gavel,
  Scale,
  User,
} from "lucide-react";
import { useState } from "react";
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
  formatDate,
  relationTypeLabel,
} from "../utils/matterHelpers";

import { SectionCard, SegmentedTabs } from "../components/ui";
import { CourtCaseEvents } from "../components/CourtCaseEvents";
import { StageChangeMenu } from "../components/StageChangeMenu";
import {
  CourtCaseStageBadge,
  CourtCaseStatusBadge,
  RelationTypeBadge,
} from "../components/MatterBadges";
import { CourtEventFormModal } from "../components/CourtEventFormModal";
import { CourtEventDetailsModal } from "../components/CourtEventDetailsModal";
import { EventHeldModal } from "../components/EventHeldModal";
import { JudgmentModal } from "../components/JudgmentModal";
import { CaseHearingStatus } from "../components/HearingStatus/CaseHearingStatus";
import { useCaseHearingStatus } from "@/shared/hooks/useScraper";

type Tab = "overview" | "events" | "roles" | "hearing";

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

  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CourtEvent | null>(null);
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);
  const [heldEvent, setHeldEvent] = useState<CourtEvent | null>(null);
  const [isJudgmentOpen, setIsJudgmentOpen] = useState(false);

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
    <Stack gap={8} padding={8} bg="gray.50" minH="100vh">
      {/* Header */}
      <Box
        bg="white"
        borderRadius="xl"
        border="1px solid"
        borderColor="gray.200"
        boxShadow="sm"
        p={6}
      >
        <HStack gap={2} mb={4}>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => navigate(`/cases/${matterNumber ?? ""}`)}
          >
            <ArrowLeft size={14} /> Matter
          </Button>
          <Text fontSize="sm" color="gray.500">
            /
          </Text>
          <Text fontSize="sm" color="gray.900" fontWeight="600">
            {courtCase.ourCourtCaseRef}
          </Text>
        </HStack>

        <HStack
          justify="space-between"
          align="flex-start"
          flexWrap="wrap"
          gap={4}
        >
          <Stack gap={3}>
            <Text
              fontSize="2xl"
              fontWeight="700"
              color="gray.900"
              fontFamily="monospace"
            >
              {courtCase.ourCourtCaseRef}
            </Text>
            <HStack gap={2} flexWrap="wrap">
              <RelationTypeBadge relation={courtCase.relationType} />
              <CourtCaseStatusBadge status={courtCase.status} />
              <CourtCaseStageBadge stage={courtCase.stage} />
            </HStack>
          </Stack>
          <HStack gap={2}>
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
            {!courtCase.judgmentSummary && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsJudgmentOpen(true)}
              >
                <Gavel size={14} /> Record Judgment
              </Button>
            )}
          </HStack>
        </HStack>

        <Box
          bg="gray.50"
          borderRadius="lg"
          p={4}
          border="1px solid"
          borderColor="gray.100"
          mt={6}
        >
          <HStack gap={6} flexWrap="wrap">
            <HStack gap={2}>
              <Text fontSize="sm" color="gray.500">
                Court:
              </Text>
              <Text fontSize="sm" fontWeight="600" color="gray.900">
                {courtCase.courtName} ({courtCase.courtLevel})
              </Text>
            </HStack>
            <HStack gap={2}>
              <Text fontSize="sm" color="gray.500">
                Case No.:
              </Text>
              <Text fontSize="sm" fontWeight="600" color="gray.900">
                {courtCase.courtCaseNumber}
              </Text>
            </HStack>
            <HStack gap={2}>
              <Text fontSize="sm" color="gray.500">
                Filed:
              </Text>
              <Text fontSize="sm" fontWeight="600" color="gray.900">
                {formatDate(courtCase.filingDate)}
              </Text>
            </HStack>
            <HStack gap={2}>
              <Text fontSize="sm" color="gray.500">
                Judge:
              </Text>
              <Text fontSize="sm" fontWeight="600" color="gray.900">
                {courtCase.judgeName || "-"}
              </Text>
            </HStack>
            <HStack gap={2}>
              <Text fontSize="sm" color="gray.500">
                Events:
              </Text>
              <Text fontSize="sm" fontWeight="600" color="gray.900">
                {events.length}
              </Text>
            </HStack>
          </HStack>
        </Box>
      </Box>

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
        <VStack gap={6} align="stretch">
          <SectionCard title="Stage" icon={Scale}>
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
              The backend validates every stage transition. Invalid transitions
              show the court&apos;s business rule message.
            </Text>
          </SectionCard>

          <SectionCard title="Case Information" icon={FileText}>
            <Grid
              templateColumns={{
                base: "1fr",
                md: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              }}
              gap={4}
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
                  {courtCase.courtLevel}
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
                  {courtCase.status}
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
          </SectionCard>

          {/* Civil-specific */}
          {(courtCase.mediationDate ||
            courtCase.mediationOutcome ||
            courtCase.writtenStatementDeadline) && (
            <SectionCard title="Civil Case Details" icon={FileText}>
              <Grid
                templateColumns={{
                  base: "1fr",
                  md: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                }}
                gap={4}
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
            </SectionCard>
          )}

          {/* Criminal-specific */}
          {(courtCase.firNumber ||
            courtCase.firDate ||
            courtCase.policeStation ||
            courtCase.investigationAuthority ||
            courtCase.arrestDate ||
            courtCase.chargeSheetDate ||
            courtCase.bailStatus) && (
            <SectionCard title="Criminal Case Details" icon={FileText}>
              <Grid
                templateColumns={{
                  base: "1fr",
                  md: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                }}
                gap={4}
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
            </SectionCard>
          )}

          {/* Judgment */}
          {(courtCase.judgmentDate || courtCase.judgmentSummary) && (
            <SectionCard title="Judgment" icon={Gavel}>
              <Box
                p={4}
                bg="green.50"
                border="1px solid"
                borderColor="green.200"
                borderRadius="lg"
              >
                <Text fontSize="sm" fontWeight="700" color="green.800" mb={1}>
                  Delivered on {formatDate(courtCase.judgmentDate)}
                </Text>
                {courtCase.appealDeadline && (
                  <Text fontSize="sm" color="gray.700" mb={1}>
                    Appeal deadline: {formatDate(courtCase.appealDeadline)}
                  </Text>
                )}
                <Text fontSize="sm" color="gray.700">
                  {courtCase.judgmentSummary}
                </Text>
              </Box>
            </SectionCard>
          )}
        </VStack>
      )}

      {/* Events */}
      {activeTab === "events" && (
        <VStack gap={6} align="stretch">
          <SectionCard title="Case Diary" icon={Calendar}>
            <CourtCaseEvents
              events={events}
              onView={handleOpenEvent}
              onSchedule={() => {
                setSelectedEvent(null);
                setIsEventFormOpen(true);
              }}
            />
          </SectionCard>
        </VStack>
      )}

      {/* Roles */}
      {activeTab === "roles" && (
        <VStack gap={6} align="stretch">
          <SectionCard title="Parties & Roles" icon={User}>
            {parties.length === 0 ? (
              <Box py={8} textAlign="center">
                <Text fontSize="sm" color="gray.500">
                  No roles assigned on this court case
                </Text>
              </Box>
            ) : (
              <VStack gap={3} align="stretch">
                {parties.map((party) => {
                  const role = roles.find((r) => r.matterPartyId === party.id);
                  return (
                    <HStack
                      key={party.id}
                      p={4}
                      bg="gray.50"
                      borderRadius="lg"
                      justify="space-between"
                      flexWrap="wrap"
                      gap={3}
                    >
                      <Text fontSize="sm" fontWeight="600" color="gray.900">
                        {party.fullName}
                      </Text>
                      <HStack gap={2} flexWrap="wrap">
                        {role && (
                          <>
                            <Badge
                              bg="blue.100"
                              color="blue.700"
                              px={3}
                              py={1}
                              borderRadius="full"
                              fontSize="xs"
                              fontWeight="600"
                            >
                              {role.roleType.replace(/_/g, " ")}
                            </Badge>
                            <Badge
                              bg="purple.100"
                              color="purple.700"
                              px={3}
                              py={1}
                              borderRadius="full"
                              fontSize="xs"
                              fontWeight="600"
                            >
                              {role.representation.replace(/_/g, " ")}
                            </Badge>
                          </>
                        )}
                        {party.isOurClient && (
                          <Badge
                            bg="green.100"
                            color="green.700"
                            px={3}
                            py={1}
                            borderRadius="full"
                            fontSize="xs"
                            fontWeight="600"
                          >
                            Our Client
                          </Badge>
                        )}
                      </HStack>
                    </HStack>
                  );
                })}
              </VStack>
            )}
          </SectionCard>
        </VStack>
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
