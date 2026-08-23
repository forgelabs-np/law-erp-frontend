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
  Calendar,
  FileText,
  Gavel,
  History,
  LayoutDashboard,
  Link2,
  Scale,
  Trash2,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  useDeleteMatterMutation,
  useGetMatterQuery,
  useGetMatterTimelineQuery,
  useUpdateMatterMutation,
} from "../api/matter.api";
import {
  useAddCourtCaseMutation,
  useGetCourtCaseEventsQuery,
  useRecordJudgmentMutation,
} from "../api/courtCase.api";
import { useAddMatterPartyMutation } from "../api/matterParty.api";
import {
  useCancelCourtEventMutation,
  useCreateCourtEventMutation,
  useMarkEventHeldMutation,
  useUpdateCourtEventMutation,
} from "../api/courtEvent.api";
import {
  CourtEvent,
  MatterParty,
  PartyEntryRequest,
} from "../types/matter.types";
import {
  courtCaseStageLabel,
  formatDate,
  partyTypeLabel,
  representationLabel,
} from "../utils/matterHelpers";

import { MatterHeaderCard } from "../components/MatterHeaderCard";
import { SectionCard, SegmentedTabs } from "../components/ui";
import { CourtCaseChain } from "../components/CourtCaseChain";
import { MatterTimeline } from "../components/MatterTimeline";
import { CourtCaseEvents } from "../components/CourtCaseEvents";
import {
  CourtCaseStatusBadge,
  CourtCaseStageBadge,
  MatterTypeBadge,
} from "../components/MatterBadges";
import { AddPartyModal } from "../components/AddPartyModal";
import { AddCourtCaseModal } from "../components/AddCourtCaseModal";
import { EditMatterModal } from "../components/EditMatterModal";
import { CourtEventFormModal } from "../components/CourtEventFormModal";
import { CourtEventDetailsModal } from "../components/CourtEventDetailsModal";
import { EventHeldModal } from "../components/EventHeldModal";
import { JudgmentModal } from "../components/JudgmentModal";
import { MatterTeam } from "../components/MatterTeam";

type Tab = "overview" | "courtCases" | "parties" | "events" | "timeline";

const MatterDetailPage = () => {
  const { matterNumber } = useParams<{ matterNumber: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const {
    data: matter,
    isLoading,
    isError,
  } = useGetMatterQuery(matterNumber ?? "");
  const timelineQuery = useGetMatterTimelineQuery(matterNumber ?? "");
  const timelineEvents = timelineQuery.data ?? [];

  const currentCourtCase = matter?.currentCourtCase;
  const courtCaseRef = currentCourtCase?.ourCourtCaseRef ?? "";
  const { data: events = [] } = useGetCourtCaseEventsQuery(courtCaseRef);

  const updateMatterMutation = useUpdateMatterMutation();
  const deleteMatterMutation = useDeleteMatterMutation();
  const addPartyMutation = useAddMatterPartyMutation();
  const addCourtCaseMutation = useAddCourtCaseMutation();
  const createEventMutation = useCreateCourtEventMutation();
  const updateEventMutation = useUpdateCourtEventMutation();
  const cancelEventMutation = useCancelCourtEventMutation();
  const markHeldMutation = useMarkEventHeldMutation();
  const recordJudgmentMutation = useRecordJudgmentMutation();

  // Modal state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddPartyOpen, setIsAddPartyOpen] = useState(false);
  const [isAddCourtCaseOpen, setIsAddCourtCaseOpen] = useState(false);
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

  if (isError || !matter) {
    return (
      <VStack gap={4} padding={8} textAlign="center">
        <Text fontSize="lg" fontWeight="500" color="gray.600">
          Matter not found
        </Text>
        <Button variant="outline" onClick={() => navigate("/cases")}>
          Back to Matters
        </Button>
      </VStack>
    );
  }

  const parties: MatterParty[] = matter.parties ?? [];
  const courtCases = matter.courtCases ?? [];
  const currentRoles = currentCourtCase?.roles ?? [];

  const tabOptions = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "courtCases", label: "Court Cases", icon: Scale },
    { id: "parties", label: "Parties", icon: Users },
    { id: "events", label: "Events / Case Diary", icon: Calendar },
    { id: "timeline", label: "Timeline", icon: History },
  ];

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

  const handleRecordJudgment = () => {
    setIsJudgmentOpen(true);
  };

  const handleDeleteMatter = () => {
    if (
      window.confirm(
        `Are you sure you want to delete matter ${matterNumber}? This action cannot be undone.`
      )
    ) {
      deleteMatterMutation.mutate(matterNumber ?? "", {
        onSuccess: () => {
          navigate("/cases");
        },
      });
    }
  };

  return (
    <Stack gap={8} padding={8} bg="gray.50" minH="100vh">
      <MatterHeaderCard
        matter={matter}
        onBack={() => navigate("/cases")}
        actions={
          <>
            {currentCourtCase && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEventFormOpen(true)}
              >
                <Calendar size={14} /> Schedule Event
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddPartyOpen(true)}
            >
              <User size={14} /> Add Party
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditOpen(true)}
            >
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              colorScheme="red"
              onClick={handleDeleteMatter}
              disabled={deleteMatterMutation.isPending}
            >
              <Trash2 size={14} /> Delete
            </Button>
          </>
        }
      />

      <SegmentedTabs
        options={tabOptions}
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId as Tab)}
      />

      {/* ==================== Overview ==================== */}
      {activeTab === "overview" && (
        <VStack gap={6} align="stretch">
          <SectionCard title="Matter Summary" icon={FileText}>
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
                  Matter Number
                </Text>
                <Text fontSize="base" fontWeight="600" color="gray.900">
                  {matter.matterNumber}
                </Text>
              </Box>
              <Box>
                <Text
                  fontSize="xs"
                  fontWeight="600"
                  color="gray.500"
                  textTransform="uppercase"
                >
                  Type
                </Text>
                <Text fontSize="base" fontWeight="600" color="gray.900">
                  <MatterTypeBadge type={matter.matterType} />
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
                <Text fontSize="base" fontWeight="600" color="gray.900">
                  {matter.status}
                </Text>
              </Box>
              <Box>
                <Text
                  fontSize="xs"
                  fontWeight="600"
                  color="gray.500"
                  textTransform="uppercase"
                >
                  Current Court
                </Text>
                <Text fontSize="base" fontWeight="600" color="gray.900">
                  {currentCourtCase?.courtName ?? matter.courtName ?? "-"}
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
                <Text fontSize="base" fontWeight="600" color="gray.900">
                  {currentCourtCase?.courtCaseNumber ??
                    matter.courtCaseNumber ??
                    "-"}
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
                <Text fontSize="base" fontWeight="600" color="gray.900">
                  {formatDate(matter.filingDate)}
                </Text>
              </Box>
              <Box>
                <Text
                  fontSize="xs"
                  fontWeight="600"
                  color="gray.500"
                  textTransform="uppercase"
                >
                  Court Cases
                </Text>
                <Text fontSize="base" fontWeight="600" color="gray.900">
                  {courtCases.length}
                </Text>
              </Box>
              <Box>
                <Text
                  fontSize="xs"
                  fontWeight="600"
                  color="gray.500"
                  textTransform="uppercase"
                >
                  Parties
                </Text>
                <Text fontSize="base" fontWeight="600" color="gray.900">
                  {parties.length}
                </Text>
              </Box>
              <Box>
                <Text
                  fontSize="xs"
                  fontWeight="600"
                  color="gray.500"
                  textTransform="uppercase"
                >
                  Events
                </Text>
                <Text fontSize="base" fontWeight="600" color="gray.900">
                  {events.length}
                </Text>
              </Box>
            </Grid>
            {matter.description && (
              <Box mt={4}>
                <Text
                  fontSize="xs"
                  fontWeight="600"
                  color="gray.500"
                  textTransform="uppercase"
                  mb={2}
                >
                  Description
                </Text>
                <Text fontSize="base" color="gray.700" lineHeight="1.7">
                  {matter.description}
                </Text>
              </Box>
            )}
          </SectionCard>

          {currentCourtCase && (
            <SectionCard title="Current Court Case" icon={Scale}>
              <HStack gap={2} flexWrap="wrap" mb={4}>
                <CourtCaseStatusBadge status={currentCourtCase.status} />
                <CourtCaseStageBadge stage={currentCourtCase.stage} />
                {currentCourtCase.judgeName && (
                  <Text fontSize="sm" color="gray.600">
                    Judge: {currentCourtCase.judgeName}
                  </Text>
                )}
              </HStack>
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
                    Reference
                  </Text>
                  <Text fontSize="sm" fontWeight="600" fontFamily="monospace">
                    {currentCourtCase.ourCourtCaseRef}
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
                    {currentCourtCase.courtLevel}
                  </Text>
                </Box>
                <Box>
                  <Text
                    fontSize="xs"
                    fontWeight="600"
                    color="gray.500"
                    textTransform="uppercase"
                  >
                    Stage
                  </Text>
                  <Text fontSize="sm" fontWeight="600">
                    {courtCaseStageLabel(currentCourtCase.stage)}
                  </Text>
                </Box>
              </Grid>

              {/* Judgment info */}
              {(currentCourtCase.judgmentDate ||
                currentCourtCase.judgmentSummary) && (
                <Box
                  mt={4}
                  p={4}
                  bg="green.50"
                  border="1px solid"
                  borderColor="green.200"
                  borderRadius="lg"
                >
                  <HStack gap={2} mb={2}>
                    <Gavel size={16} color="#15803d" />
                    <Text fontSize="sm" fontWeight="700" color="green.800">
                      Judgment
                    </Text>
                  </HStack>
                  <Text fontSize="sm" color="gray.800">
                    Delivered on {formatDate(currentCourtCase.judgmentDate)}
                    {currentCourtCase.appealDeadline
                      ? ` · Appeal deadline: ${formatDate(currentCourtCase.appealDeadline)}`
                      : ""}
                  </Text>
                  {currentCourtCase.judgmentSummary && (
                    <Text fontSize="sm" color="gray.700" mt={1}>
                      {currentCourtCase.judgmentSummary}
                    </Text>
                  )}
                </Box>
              )}

              {!currentCourtCase.judgmentSummary && (
                <Button
                  mt={4}
                  variant="outline"
                  size="sm"
                  onClick={handleRecordJudgment}
                >
                  <Gavel size={14} /> Record Judgment
                </Button>
              )}
            </SectionCard>
          )}

          {/* Matter Team */}
          <MatterTeam
            matterNumber={matterNumber ?? ""}
            matterTitle={matter.title}
          />
        </VStack>
      )}

      {/* ==================== Court Cases ==================== */}
      {activeTab === "courtCases" && (
        <VStack gap={6} align="stretch">
          <SectionCard title="Court Case Chain" icon={Link2}>
            <CourtCaseChain
              matterNumber={matter.matterNumber}
              courtCases={courtCases}
              currentCourtCaseRef={currentCourtCase?.ourCourtCaseRef}
              onAddCourtCase={() => setIsAddCourtCaseOpen(true)}
            />
          </SectionCard>
        </VStack>
      )}

      {/* ==================== Parties ==================== */}
      {activeTab === "parties" && (
        <VStack gap={6} align="stretch">
          <SectionCard title="Parties" icon={Users}>
            <HStack justify="space-between" mb={4}>
              <Text fontSize="sm" color="gray.500">
                {parties.length} {parties.length === 1 ? "party" : "parties"} on
                this matter
              </Text>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddPartyOpen(true)}
              >
                + Add Party
              </Button>
            </HStack>

            {parties.length === 0 ? (
              <Box py={8} textAlign="center">
                <Text fontSize="sm" color="gray.500">
                  No parties added to this matter
                </Text>
              </Box>
            ) : (
              <VStack gap={3} align="stretch">
                {parties.map((party) => {
                  const role = currentRoles.find(
                    (r) => r.matterPartyId === party.id
                  );
                  return (
                    <Box
                      key={party.id}
                      p={5}
                      bg="gray.50"
                      borderRadius="lg"
                      border="1px solid"
                      borderColor="gray.100"
                    >
                      <HStack
                        justify="space-between"
                        align="flex-start"
                        flexWrap="wrap"
                        gap={3}
                      >
                        <VStack align="stretch" gap={2}>
                          <Text
                            fontSize="base"
                            fontWeight="600"
                            color="gray.900"
                          >
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
                                  {partyTypeLabel(role.roleType)}
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
                                  {representationLabel(role.representation)}
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
                            {party.clientId && (
                              <Badge
                                bg="orange.100"
                                color="orange.700"
                                px={3}
                                py={1}
                                borderRadius="full"
                                fontSize="xs"
                                fontWeight="600"
                              >
                                Linked
                              </Badge>
                            )}
                          </HStack>
                        </VStack>
                        <Stack gap={1} align="flex-end" textAlign="right">
                          {party.mobileNo && (
                            <Text fontSize="sm" color="gray.600">
                              {party.mobileNo}
                            </Text>
                          )}
                          {party.email && (
                            <Text fontSize="sm" color="gray.600">
                              {party.email}
                            </Text>
                          )}
                        </Stack>
                      </HStack>
                      {!role && (
                        <Text fontSize="xs" color="gray.400" mt={2}>
                          No role on the current court case
                        </Text>
                      )}
                    </Box>
                  );
                })}
              </VStack>
            )}
          </SectionCard>
        </VStack>
      )}

      {/* ==================== Events ==================== */}
      {activeTab === "events" && (
        <VStack gap={6} align="stretch">
          <SectionCard title="Case Diary" icon={Calendar}>
            {!currentCourtCase ? (
              <Box py={8} textAlign="center">
                <Text fontSize="sm" color="gray.500">
                  Add a court case before scheduling events
                </Text>
              </Box>
            ) : (
              <CourtCaseEvents
                events={events}
                onView={handleOpenEvent}
                onSchedule={() => setIsEventFormOpen(true)}
              />
            )}
          </SectionCard>
        </VStack>
      )}

      {/* ==================== Timeline ==================== */}
      {activeTab === "timeline" && (
        <MatterTimeline
          events={timelineEvents}
          isLoading={timelineQuery.isLoading}
          courtEvents={events}
          courtName={currentCourtCase?.courtName}
          matterNumber={matter.matterNumber}
          nextEvent={matter.nextEvent}
          onSchedule={() => setIsEventFormOpen(true)}
          onViewEvent={handleOpenEvent}
        />
      )}

      {/* ==================== Modals ==================== */}
      <EditMatterModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        isSubmitting={updateMatterMutation.isPending}
        matter={matter}
        onSubmit={(data) => {
          updateMatterMutation.mutate(
            { matterNumber: matter.matterNumber, data },
            { onSuccess: () => setIsEditOpen(false) }
          );
        }}
      />

      <AddPartyModal
        isOpen={isAddPartyOpen}
        onClose={() => setIsAddPartyOpen(false)}
        isSubmitting={addPartyMutation.isPending}
        onSubmit={(data: PartyEntryRequest) => {
          addPartyMutation.mutate(
            { matterNumber: matter.matterNumber, data },
            { onSuccess: () => setIsAddPartyOpen(false) }
          );
        }}
      />

      <AddCourtCaseModal
        isOpen={isAddCourtCaseOpen}
        onClose={() => setIsAddCourtCaseOpen(false)}
        isSubmitting={addCourtCaseMutation.isPending}
        parentCourtCaseId={currentCourtCase?.id ?? ""}
        parties={parties}
        onSubmit={(data) => {
          addCourtCaseMutation.mutate(
            { matterNumber: matter.matterNumber, data },
            { onSuccess: () => setIsAddCourtCaseOpen(false) }
          );
        }}
      />

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
        onRecordJudgment={handleRecordJudgment}
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

export default MatterDetailPage;
