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
  History,
  LayoutDashboard,
  Plus,
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
import { partyTypeLabel, representationLabel } from "../utils/matterHelpers";

import { MatterHeaderCard } from "../components/MatterHeaderCard";
import { SectionCard, SegmentedTabs } from "../components/ui";
import { PartiesWorkspaceCard } from "../components/PartiesWorkspaceCard";
import { CourtCaseChain } from "../components/CourtCaseChain";
import { CaseSummaryCard } from "../components/CaseSummaryCard";
import { MatterTimeline } from "../components/MatterTimeline";
import { CourtCaseEvents } from "../components/CourtCaseEvents";
import { AddPartyModal } from "../components/AddPartyModal";
import { AddCourtCaseModal } from "../components/AddCourtCaseModal";
import { EditMatterModal } from "../components/EditMatterModal";
import { CourtEventFormModal } from "../components/CourtEventFormModal";
import { CourtEventDetailsModal } from "../components/CourtEventDetailsModal";
import { EventHeldModal } from "../components/EventHeldModal";
import { JudgmentModal } from "../components/JudgmentModal";
import { MatterTeam } from "../components/MatterTeam";
import {
  MatterCurrentCourtCaseCard,
  MatterDetailsCard,
} from "../components/overview";
import { useModulePermissions } from "@/shared/hooks/usePermissions";

type Tab = "overview" | "courtCases" | "parties" | "events" | "timeline";

const MatterDetailPage = () => {
  const { matterNumber } = useParams<{ matterNumber: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const { canCreate, canEdit, canDelete } =
    useModulePermissions("CASE_MANAGEMENT");

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
    // { id: "events", label: "Events / Case Diary", icon: Calendar },
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
    <Stack gap={6} padding={4} bg="gray.50" minH="100vh">
      <MatterHeaderCard
        matter={matter}
        onBack={() => navigate("/cases")}
        actions={
          <>
            {currentCourtCase && canCreate && (
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
            {canCreate && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddPartyOpen(true)}
              >
                <User size={14} /> Add Party
              </Button>
            )}
            {canEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditOpen(true)}
              >
                Edit
              </Button>
            )}
            {canDelete && (
              <Button
                variant="outline"
                size="sm"
                colorScheme="red"
                onClick={handleDeleteMatter}
                disabled={deleteMatterMutation.isPending}
              >
                <Trash2 size={14} /> Delete
              </Button>
            )}
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
        <Grid
          templateColumns={{
            base: "1fr",
            lg: "minmax(0, 2.05fr) minmax(0, 1fr)",
          }}
          gap={6}
          alignItems="start"
          w="100%"
        >
          {/* Primary column */}
          <VStack gap={6} align="stretch" minW={0}>
            <MatterDetailsCard
              matter={matter}
              courtCaseCount={courtCases.length}
              partyCount={parties.length}
              eventCount={events.length}
            />

            {currentCourtCase && (
              <MatterCurrentCourtCaseCard
                courtCase={currentCourtCase}
                onRecordJudgment={handleRecordJudgment}
              />
            )}
          </VStack>

          {/* Supporting column */}
          <VStack gap={6} align="stretch" minW={0}>
            <MatterTeam
              matterNumber={matterNumber ?? ""}
              matterTitle={matter.title}
            />
          </VStack>
        </Grid>
      )}

      {/* ==================== Court Cases ==================== */}
      {activeTab === "courtCases" && (
        <VStack gap={6} align="stretch">
          <HStack
            justify="space-between"
            align="flex-start"
            gap={4}
            flexWrap="wrap"
            w="100%"
          >
            <Box minW={0}>
              <Text
                fontSize={{ base: "20px", md: "22px" }}
                fontWeight="700"
                color="gray.900"
                letterSpacing="-0.01em"
              >
                Court Cases
              </Text>
              <Text fontSize="13px" color="gray.500" mt={1}>
                Track the court proceedings and related case history.
              </Text>
            </Box>
            <Button
              variant="primary"
              onClick={() => setIsAddCourtCaseOpen(true)}
            >
              <Plus size={16} /> Add Court Case
            </Button>
          </HStack>

          <Grid
            templateColumns={{
              base: "1fr",
              lg: "minmax(0, 2.15fr) minmax(0, 1fr)",
            }}
            gap={6}
            alignItems="start"
            w="100%"
          >
            <Box minW={0}>
              <CourtCaseChain
                matterNumber={matter.matterNumber}
                courtCases={courtCases}
                currentCourtCaseRef={currentCourtCase?.ourCourtCaseRef}
                onAddCourtCase={() => setIsAddCourtCaseOpen(true)}
              />
            </Box>
            <Box minW={0}>
              <CaseSummaryCard
                courtCases={courtCases}
                currentCourtCase={currentCourtCase}
              />
            </Box>
          </Grid>
        </VStack>
      )}

      {/* ==================== Parties ==================== */}
      {activeTab === "parties" && (
        <PartiesWorkspaceCard
          title="Parties"
          subtitle="Parties attached to this matter and their roles on the current court case."
          parties={parties}
          roles={currentRoles}
          onAddParty={canCreate ? () => setIsAddPartyOpen(true) : undefined}
          entityType="matter"
        />
      )}

      {/* ==================== Events ==================== */}
      {activeTab === "events" && (
        <CourtCaseEvents
          events={events}
          onView={handleOpenEvent}
          onSchedule={() => {
            setSelectedEvent(null);
            setIsEventFormOpen(true);
          }}
          disabledReason={
            currentCourtCase
              ? undefined
              : "Add a court case before scheduling events"
          }
        />
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
          onSchedule={() => {
            setSelectedEvent(null);
            setIsEventFormOpen(true);
          }}
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
