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
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Scale,
  Calendar,
  Building,
  User,
  FileText,
  Hash,
  Clipboard,
  Clock,
  Notebook,
  ArrowLeft,
  LayoutDashboard,
  Users,
  History,
  Plus,
  MapPin,
} from "lucide-react";

import { Case, CaseStage, CreatePartyRequest } from "../types/case.types";
import {
  useGetCaseQuery,
  useUpdateCaseMutation,
  useUpdateCaseStageMutation,
  useDeleteCaseMutation,
} from "../api/case.api";
import { useAddPartyMutation, useDeletePartyMutation } from "../api/party.api";
import { useGetCaseTimelineQuery } from "../api/timeline.api";
import {
  useGetCaseHearingsQuery,
  useCreateHearingMutation,
  useUpdateHearingMutation,
  useDeleteHearingMutation,
} from "../api/hearing.api";
import { getNextStages } from "../utils/stageTransitions";
import { isFieldVisible } from "../utils/caseFieldVisibility";
import { toastFail } from "@/shared/toast";

import { CaseStageBadge } from "../components/CaseStageBadge";
import { CaseStatusBadge } from "../components/CaseStatusBadge";
import { CaseTypeBadge } from "../components/CaseTypeBadge";
import { StageTransitionMenu } from "../components/StageTransitionMenu";
import { HearingDetailsModal } from "../components/HearingDetailsModal";
import { HearingFormModal } from "../components/HearingFormModal";
import { HearingTimeline } from "../components/HearingTimeline";
import {
  SectionCard,
  InfoCard,
  PageHeaderCard,
  SegmentedTabs,
  DescriptionBlock,
} from "../components/ui";
import { Hearing } from "../types/hearing.types";

type Tab = "overview" | "parties" | "hearings" | "timeline";

const CaseDetailPage = () => {
  const { caseNumber } = useParams<{ caseNumber: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Case>>({});
  const [isAddingParty, setIsAddingParty] = useState(false);
  const [newParty, setNewParty] = useState<Partial<CreatePartyRequest>>({
    partyType: "PLAINTIFF",
    representation: "REPRESENTED",
    fullName: "",
    mobileNo: "",
    ourClient: true,
  });

  const [selectedHearing, setSelectedHearing] = useState<Hearing | null>(null);
  const [isHearingDetailsOpen, setIsHearingDetailsOpen] = useState(false);
  const [isHearingFormOpen, setIsHearingFormOpen] = useState(false);
  const [editingHearing, setEditingHearing] = useState<Hearing | null>(null);
  const [hearingFilter, setHearingFilter] = useState<
    "all" | "upcoming" | "completed" | "cancelled"
  >("all");

  const { data: caseData, isLoading: caseLoading } = useGetCaseQuery(
    caseNumber || ""
  );
  const { data: timelineData, isLoading: timelineLoading } =
    useGetCaseTimelineQuery(caseNumber || "");
  const { data: hearingsData, isLoading: hearingsLoading } =
    useGetCaseHearingsQuery(caseNumber || "");

  const updateCaseMutation = useUpdateCaseMutation();
  const updateStageMutation = useUpdateCaseStageMutation();
  const deleteCaseMutation = useDeleteCaseMutation();
  const addPartyMutation = useAddPartyMutation();
  const deletePartyMutation = useDeletePartyMutation();
  const createHearingMutation = useCreateHearingMutation();
  const updateHearingMutation = useUpdateHearingMutation();
  const deleteHearingMutation = useDeleteHearingMutation();

  const caseInfo = caseData;
  const parties = Array.isArray(caseInfo?.parties) ? caseInfo.parties : [];
  const timeline = Array.isArray(timelineData) ? timelineData : [];
  const allHearings = Array.isArray(hearingsData) ? hearingsData : [];

  // Filter hearings based on selected filter
  const filteredHearings = allHearings.filter((hearing) => {
    if (hearingFilter === "all") return true;
    if (hearingFilter === "upcoming")
      return (
        hearing.status === "SCHEDULED" && new Date(hearing.date) >= new Date()
      );
    if (hearingFilter === "completed") return hearing.status === "COMPLETED";
    if (hearingFilter === "cancelled") return hearing.status === "CANCELLED";
    return true;
  });

  const hearings = filteredHearings;

  const handleStageChange = (newStage: CaseStage) => {
    if (!caseNumber || !caseInfo) return;

    updateStageMutation.mutate({
      caseNumber,
      data: { stage: newStage },
    });
  };

  const handleEdit = () => {
    setEditData(caseInfo || {});
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({});
  };

  const handleSaveEdit = () => {
    if (!caseNumber) return;

    // Only include fields that have changed or are explicitly set
    const updateData: any = {};
    if (editData.title !== undefined) updateData.title = editData.title;
    if (editData.courtName !== undefined)
      updateData.courtName = editData.courtName;
    if (editData.courtCaseNumber !== undefined)
      updateData.courtCaseNumber = editData.courtCaseNumber;
    if (editData.filingDate !== undefined)
      updateData.filingDate = editData.filingDate;
    if (editData.filingNumber !== undefined)
      updateData.filingNumber = editData.filingNumber;
    if (editData.description !== undefined)
      updateData.description = editData.description;
    if (editData.caseStage !== undefined)
      updateData.caseStage = editData.caseStage;
    if (editData.status !== undefined) updateData.status = editData.status;

    updateCaseMutation.mutate({
      caseNumber,
      data: updateData,
    });
    setIsEditing(false);
  };

  const handleFieldChange = (field: string, value: any) => {
    setEditData({ ...editData, [field]: value });
  };

  const handleDelete = () => {
    if (!caseNumber) return;

    if (
      confirm(
        "Are you sure you want to delete this case? This action cannot be undone."
      )
    ) {
      deleteCaseMutation.mutate(caseNumber, {
        onSuccess: () => {
          navigate("/cases");
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message || "Failed to delete case";
          toastFail(errorMessage);
        },
      });
    }
  };

  const handleDeleteParty = (partyId: string) => {
    if (!caseNumber) return;

    if (confirm("Are you sure you want to remove this party?")) {
      deletePartyMutation.mutate({ caseNumber, partyId });
    }
  };

  const handleAddParty = () => {
    if (!caseNumber) return;
    if (!newParty.fullName || !newParty.mobileNo) {
      toastFail("Please fill in required fields (Full Name and Mobile Number)");
      return;
    }

    addPartyMutation.mutate(
      {
        caseNumber,
        data: newParty as CreatePartyRequest,
      },
      {
        onSuccess: () => {
          setIsAddingParty(false);
          setNewParty({
            partyType: "PLAINTIFF",
            representation: "REPRESENTED",
            fullName: "",
            mobileNo: "",
            ourClient: true,
          });
        },
      }
    );
  };

  const handleNewPartyChange = (
    field: keyof CreatePartyRequest,
    value: any
  ) => {
    setNewParty({ ...newParty, [field]: value });
  };

  const handleCopyCaseNumber = () => {
    if (caseInfo?.caseNumber) {
      navigator.clipboard.writeText(caseInfo.caseNumber);
    }
  };

  const handleViewHearing = (hearing: Hearing) => {
    setSelectedHearing(hearing);
    setIsHearingDetailsOpen(true);
  };

  const handleEditHearing = (hearing: Hearing) => {
    setEditingHearing(hearing);
    setIsHearingDetailsOpen(false);
    setIsHearingFormOpen(true);
  };

  const handleCreateHearing = () => {
    setEditingHearing(null);
    setIsHearingFormOpen(true);
  };

  const handleHearingSubmit = (data: any) => {
    if (!caseNumber) return;

    if (editingHearing) {
      updateHearingMutation.mutate({
        hearingId: editingHearing.id,
        data,
      });
    } else {
      createHearingMutation.mutate({
        caseNumber,
        data,
      });
    }
    setIsHearingFormOpen(false);
    setEditingHearing(null);
  };

  const handleCancelHearing = (hearingId: string) => {
    if (
      confirm(
        "Are you sure you want to cancel this hearing? This action cannot be undone."
      )
    ) {
      deleteHearingMutation.mutate(hearingId, {
        onSuccess: () => {
          setIsHearingDetailsOpen(false);
        },
      });
    }
  };

  if (caseLoading) {
    return (
      <Stack gap={6} padding={8}>
        {[...Array(5)].map((_, i) => (
          <Box key={i} h="60px" bg="gray.100" borderRadius="md" />
        ))}
      </Stack>
    );
  }

  if (!caseInfo) {
    return (
      <Stack gap={6} padding={8} align="center">
        <Text fontSize="lg" fontWeight="500" color="gray.600">
          Case not found
        </Text>
        <Button variant="outline" onClick={() => navigate("/cases")}>
          Back to Cases
        </Button>
      </Stack>
    );
  }

  const isCivil = caseInfo.caseType === "CIVIL";

  const tabOptions = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "parties", label: "Parties", icon: Users },
    { id: "hearings", label: "Hearings", icon: Calendar },
    { id: "timeline", label: "Timeline", icon: History },
  ];

  const quickInfo = [
    {
      icon: Scale,
      label: "Stage",
      value: caseInfo.caseStage.replace(/_/g, " "),
    },
    {
      icon: Calendar,
      label: "Filing Date",
      value: caseInfo.filingDate
        ? new Date(caseInfo.filingDate).toLocaleDateString()
        : undefined,
    },
    { icon: Hash, label: "Filing Number", value: caseInfo.filingNumber },
    { icon: Building, label: "Court", value: caseInfo.courtName },
    { icon: User, label: "Judge", value: caseInfo.judgeName },
    { icon: FileText, label: "Type", value: caseInfo.caseType },
  ];

  return (
    <Stack gap={8} padding={8} bg="gray.50" minH="100vh">
      {/* Page Header Card */}
      <PageHeaderCard
        caseNumber={caseInfo.caseNumber}
        title={caseInfo.title}
        caseTypeBadge={<CaseTypeBadge type={caseInfo.caseType} />}
        stageBadge={<CaseStageBadge stage={caseInfo.caseStage} />}
        statusBadge={<CaseStatusBadge status={caseInfo.status} />}
        onEdit={handleEdit}
        onDelete={handleDelete}
        quickInfo={quickInfo}
        onCopyCaseNumber={handleCopyCaseNumber}
      />

      {/* Segmented Tabs */}
      <SegmentedTabs
        options={tabOptions}
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId as Tab)}
      />

      {/* Tab Content */}
      {activeTab === "overview" && (
        <VStack gap={6} align="stretch">
          {isEditing ? (
            <SectionCard title="Edit Case" icon={FileText}>
              <VStack gap={4} align="stretch">
                <HStack gap={4}>
                  <VStack align="stretch" gap={1} flex={1}>
                    <Text fontSize="sm" color="gray.600">
                      Title *
                    </Text>
                    <input
                      type="text"
                      value={editData.title || ""}
                      onChange={(e) =>
                        handleFieldChange("title", e.target.value)
                      }
                      style={{
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #e2e8f0",
                        fontSize: "14px",
                      }}
                    />
                  </VStack>

                  <VStack align="stretch" gap={1} flex={1}>
                    <Text fontSize="sm" color="gray.600">
                      Case Stage
                    </Text>
                    <Box
                      border="1px solid"
                      borderColor="gray.200"
                      borderRadius="md"
                      p={2}
                    >
                      <select
                        value={editData.caseStage || caseInfo?.caseStage}
                        onChange={(e) =>
                          handleFieldChange("caseStage", e.target.value)
                        }
                        style={{
                          width: "100%",
                          background: "transparent",
                          outline: "none",
                          cursor: "pointer",
                          fontSize: "14px",
                        }}
                      >
                        <option value="FILED">Filed</option>
                        <option value="UNDER_SUMMONS">Under Summons</option>
                        <option value="RESPONSE_PENDING">
                          Response Pending
                        </option>
                        <option value="MEDIATION">Mediation</option>
                        <option value="EVIDENCE">Evidence</option>
                        <option value="ARGUMENT">Argument</option>
                        <option value="JUDGMENT_AWAITED">
                          Judgment Awaited
                        </option>
                        <option value="JUDGMENT_DELIVERED">
                          Judgment Delivered
                        </option>
                        <option value="APPEAL">Appeal</option>
                        <option value="EXECUTION">Execution</option>
                        <option value="CLOSED">Closed</option>
                        <option value="FIR_REGISTERED">FIR Registered</option>
                        <option value="UNDER_INVESTIGATION">
                          Under Investigation
                        </option>
                        <option value="CHARGE_SHEET_FILED">
                          Charge Sheet Filed
                        </option>
                        <option value="PLEA">Plea</option>
                        <option value="TRIAL">Trial</option>
                        <option value="SENTENCING">Sentencing</option>
                      </select>
                    </Box>
                  </VStack>
                </HStack>

                <HStack gap={4}>
                  <VStack align="stretch" gap={1} flex={1}>
                    <Text fontSize="sm" color="gray.600">
                      Case Status
                    </Text>
                    <Box
                      border="1px solid"
                      borderColor="gray.200"
                      borderRadius="md"
                      p={2}
                    >
                      <select
                        value={editData.status || caseInfo?.status}
                        onChange={(e) =>
                          handleFieldChange("status", e.target.value)
                        }
                        style={{
                          width: "100%",
                          background: "transparent",
                          outline: "none",
                          cursor: "pointer",
                          fontSize: "14px",
                        }}
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="CLOSED">Closed</option>
                        <option value="ARCHIVED">Archived</option>
                      </select>
                    </Box>
                  </VStack>

                  <VStack align="stretch" gap={1} flex={1}>
                    <Text fontSize="sm" color="gray.600">
                      Court Name
                    </Text>
                    <input
                      type="text"
                      value={editData.courtName || ""}
                      onChange={(e) =>
                        handleFieldChange("courtName", e.target.value)
                      }
                      style={{
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #e2e8f0",
                        fontSize: "14px",
                      }}
                    />
                  </VStack>
                </HStack>

                <VStack align="stretch" gap={1}>
                  <Text fontSize="sm" color="gray.600">
                    Court Case Number
                  </Text>
                  <input
                    type="text"
                    value={editData.courtCaseNumber || ""}
                    onChange={(e) =>
                      handleFieldChange("courtCaseNumber", e.target.value)
                    }
                    style={{
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid #e2e8f0",
                      fontSize: "14px",
                    }}
                  />
                </VStack>

                <HStack gap={4}>
                  <VStack align="stretch" gap={1} flex={1}>
                    <Text fontSize="sm" color="gray.600">
                      Filing Date
                    </Text>
                    <input
                      type="date"
                      value={editData.filingDate || ""}
                      onChange={(e) =>
                        handleFieldChange("filingDate", e.target.value)
                      }
                      style={{
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #e2e8f0",
                        fontSize: "14px",
                      }}
                    />
                  </VStack>

                  <VStack align="stretch" gap={1} flex={1}>
                    <Text fontSize="sm" color="gray.600">
                      Filing Number
                    </Text>
                    <input
                      type="text"
                      value={editData.filingNumber || ""}
                      onChange={(e) =>
                        handleFieldChange("filingNumber", e.target.value)
                      }
                      style={{
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #e2e8f0",
                        fontSize: "14px",
                      }}
                    />
                  </VStack>
                </HStack>

                <VStack align="stretch" gap={1}>
                  <Text fontSize="sm" color="gray.600">
                    Description
                  </Text>
                  <textarea
                    value={editData.description || ""}
                    onChange={(e) =>
                      handleFieldChange("description", e.target.value)
                    }
                    style={{
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid #e2e8f0",
                      fontSize: "14px",
                      minHeight: "80px",
                    }}
                  />
                </VStack>

                {/* Civil-specific fields */}
                {isCivil && (
                  <>
                    <VStack align="stretch" gap={1}>
                      <Text fontSize="sm" color="gray.600">
                        Mediation Date
                      </Text>
                      <input
                        type="date"
                        value={editData.mediationDate || ""}
                        onChange={(e) =>
                          handleFieldChange("mediationDate", e.target.value)
                        }
                        style={{
                          padding: "10px",
                          borderRadius: "6px",
                          border: "1px solid #e2e8f0",
                          fontSize: "14px",
                        }}
                      />
                    </VStack>

                    <VStack align="stretch" gap={1}>
                      <Text fontSize="sm" color="gray.600">
                        Mediation Outcome
                      </Text>
                      <input
                        type="text"
                        value={editData.mediationOutcome || ""}
                        onChange={(e) =>
                          handleFieldChange("mediationOutcome", e.target.value)
                        }
                        style={{
                          padding: "10px",
                          borderRadius: "6px",
                          border: "1px solid #e2e8f0",
                          fontSize: "14px",
                        }}
                      />
                    </VStack>

                    <VStack align="stretch" gap={1}>
                      <Text fontSize="sm" color="gray.600">
                        Written Statement Deadline
                      </Text>
                      <input
                        type="date"
                        value={editData.writtenStatementDeadline || ""}
                        onChange={(e) =>
                          handleFieldChange(
                            "writtenStatementDeadline",
                            e.target.value
                          )
                        }
                        style={{
                          padding: "10px",
                          borderRadius: "6px",
                          border: "1px solid #e2e8f0",
                          fontSize: "14px",
                        }}
                      />
                    </VStack>
                  </>
                )}

                {/* Criminal-specific fields */}
                {!isCivil && (
                  <>
                    <HStack gap={4}>
                      <VStack align="stretch" gap={1} flex={1}>
                        <Text fontSize="sm" color="gray.600">
                          FIR Number
                        </Text>
                        <input
                          type="text"
                          value={editData.firNumber || ""}
                          onChange={(e) =>
                            handleFieldChange("firNumber", e.target.value)
                          }
                          style={{
                            padding: "10px",
                            borderRadius: "6px",
                            border: "1px solid #e2e8f0",
                            fontSize: "14px",
                          }}
                        />
                      </VStack>

                      <VStack align="stretch" gap={1} flex={1}>
                        <Text fontSize="sm" color="gray.600">
                          FIR Date
                        </Text>
                        <input
                          type="date"
                          value={editData.firDate || ""}
                          onChange={(e) =>
                            handleFieldChange("firDate", e.target.value)
                          }
                          style={{
                            padding: "10px",
                            borderRadius: "6px",
                            border: "1px solid #e2e8f0",
                            fontSize: "14px",
                          }}
                        />
                      </VStack>
                    </HStack>

                    <VStack align="stretch" gap={1}>
                      <Text fontSize="sm" color="gray.600">
                        Police Station
                      </Text>
                      <input
                        type="text"
                        value={editData.policeStation || ""}
                        onChange={(e) =>
                          handleFieldChange("policeStation", e.target.value)
                        }
                        style={{
                          padding: "10px",
                          borderRadius: "6px",
                          border: "1px solid #e2e8f0",
                          fontSize: "14px",
                        }}
                      />
                    </VStack>

                    <VStack align="stretch" gap={1}>
                      <Text fontSize="sm" color="gray.600">
                        Investigation Authority
                      </Text>
                      <input
                        type="text"
                        value={editData.investigationAuthority || ""}
                        onChange={(e) =>
                          handleFieldChange(
                            "investigationAuthority",
                            e.target.value
                          )
                        }
                        style={{
                          padding: "10px",
                          borderRadius: "6px",
                          border: "1px solid #e2e8f0",
                          fontSize: "14px",
                        }}
                      />
                    </VStack>

                    <HStack gap={4}>
                      <VStack align="stretch" gap={1} flex={1}>
                        <Text fontSize="sm" color="gray.600">
                          Arrest Date
                        </Text>
                        <input
                          type="date"
                          value={editData.arrestDate || ""}
                          onChange={(e) =>
                            handleFieldChange("arrestDate", e.target.value)
                          }
                          style={{
                            padding: "10px",
                            borderRadius: "6px",
                            border: "1px solid #e2e8f0",
                            fontSize: "14px",
                          }}
                        />
                      </VStack>

                      <VStack align="stretch" gap={1} flex={1}>
                        <Text fontSize="sm" color="gray.600">
                          Charge Sheet Date
                        </Text>
                        <input
                          type="date"
                          value={editData.chargeSheetDate || ""}
                          onChange={(e) =>
                            handleFieldChange("chargeSheetDate", e.target.value)
                          }
                          style={{
                            padding: "10px",
                            borderRadius: "6px",
                            border: "1px solid #e2e8f0",
                            fontSize: "14px",
                          }}
                        />
                      </VStack>
                    </HStack>

                    <VStack align="stretch" gap={1}>
                      <Text fontSize="sm" color="gray.600">
                        Bail Status
                      </Text>
                      <select
                        value={editData.bailStatus || ""}
                        onChange={(e) =>
                          handleFieldChange(
                            "bailStatus",
                            e.target.value || undefined
                          )
                        }
                        style={{
                          padding: "10px",
                          borderRadius: "6px",
                          border: "1px solid #e2e8f0",
                          fontSize: "14px",
                        }}
                      >
                        <option value="">Select bail status</option>
                        <option value="GRANTED">Granted</option>
                        <option value="DENIED">Denied</option>
                        <option value="PENDING">Pending</option>
                      </select>
                    </VStack>
                  </>
                )}
              </VStack>

              <HStack gap={2} justify="flex-end" pt={4}>
                <Button variant="outline" onClick={handleCancelEdit}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleSaveEdit}>
                  Save Changes
                </Button>
              </HStack>
            </SectionCard>
          ) : (
            <>
              {/* Section 1: Case Summary */}
              <SectionCard title="Case Summary" icon={FileText}>
                <Grid
                  templateColumns={{
                    base: "1fr",
                    md: "repeat(2, 1fr)",
                    lg: "repeat(3, 1fr)",
                  }}
                  gap={4}
                >
                  <InfoCard label="Title" value={caseInfo.title} />
                  <InfoCard label="Court Name" value={caseInfo.courtName} />
                  <InfoCard
                    label="Court Case Number"
                    value={caseInfo.courtCaseNumber}
                  />
                  <InfoCard
                    label="Filing Date"
                    value={
                      caseInfo.filingDate
                        ? new Date(caseInfo.filingDate).toLocaleDateString()
                        : undefined
                    }
                  />
                  <InfoCard
                    label="Filing Number"
                    value={caseInfo.filingNumber}
                  />
                  <InfoCard label="Judge" value={caseInfo.judgeName} />
                </Grid>

                <DescriptionBlock content={caseInfo.description} />
              </SectionCard>

              {/* Section 2: Type-specific Details */}
              {(isCivil &&
                (caseInfo.mediationDate ||
                  caseInfo.mediationOutcome ||
                  caseInfo.writtenStatementDeadline)) ||
              (!isCivil &&
                (caseInfo.firNumber ||
                  caseInfo.firDate ||
                  caseInfo.policeStation ||
                  caseInfo.investigationAuthority ||
                  caseInfo.arrestDate ||
                  caseInfo.chargeSheetDate ||
                  caseInfo.bailStatus)) ? (
                <SectionCard
                  title={
                    isCivil ? "Civil Case Details" : "Criminal Case Details"
                  }
                  icon={Notebook}
                >
                  <Grid
                    templateColumns={{
                      base: "1fr",
                      md: "repeat(2, 1fr)",
                      lg: "repeat(3, 1fr)",
                    }}
                    gap={4}
                  >
                    {isCivil && (
                      <>
                        <InfoCard
                          label="Mediation Date"
                          value={
                            caseInfo.mediationDate
                              ? new Date(
                                  caseInfo.mediationDate
                                ).toLocaleDateString()
                              : undefined
                          }
                        />
                        <InfoCard
                          label="Mediation Outcome"
                          value={caseInfo.mediationOutcome}
                        />
                        <InfoCard
                          label="Written Statement Deadline"
                          value={
                            caseInfo.writtenStatementDeadline
                              ? new Date(
                                  caseInfo.writtenStatementDeadline
                                ).toLocaleDateString()
                              : undefined
                          }
                        />
                      </>
                    )}

                    {!isCivil && (
                      <>
                        <InfoCard
                          label="FIR Number"
                          value={caseInfo.firNumber}
                        />
                        <InfoCard
                          label="FIR Date"
                          value={
                            caseInfo.firDate
                              ? new Date(caseInfo.firDate).toLocaleDateString()
                              : undefined
                          }
                        />
                        <InfoCard
                          label="Police Station"
                          value={caseInfo.policeStation}
                        />
                        <InfoCard
                          label="Investigation Authority"
                          value={caseInfo.investigationAuthority}
                        />
                        <InfoCard
                          label="Arrest Date"
                          value={
                            caseInfo.arrestDate
                              ? new Date(
                                  caseInfo.arrestDate
                                ).toLocaleDateString()
                              : undefined
                          }
                        />
                        <InfoCard
                          label="Charge Sheet Date"
                          value={
                            caseInfo.chargeSheetDate
                              ? new Date(
                                  caseInfo.chargeSheetDate
                                ).toLocaleDateString()
                              : undefined
                          }
                        />
                        <InfoCard
                          label="Bail Status"
                          value={caseInfo.bailStatus}
                        />
                      </>
                    )}
                  </Grid>
                </SectionCard>
              ) : null}
            </>
          )}
        </VStack>
      )}

      {activeTab === "parties" && (
        <VStack gap={6} align="stretch">
          <SectionCard title="Parties" icon={Users}>
            <HStack justify="space-between" mb={4}>
              <Text fontSize="sm" color="gray.500">
                {parties.length} {parties.length === 1 ? "party" : "parties"} in
                this case
              </Text>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddingParty(!isAddingParty)}
              >
                {isAddingParty ? "Cancel" : "+ Add Party"}
              </Button>
            </HStack>

            {isAddingParty && (
              <Box
                p={4}
                bg="blue.50"
                borderRadius="lg"
                border="1px solid"
                borderColor="blue.200"
                mb={4}
              >
                <VStack gap={4} align="stretch">
                  <Text fontSize="sm" fontWeight="600" color="gray.900">
                    Add New Party
                  </Text>

                  <Grid
                    templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                    gap={4}
                  >
                    <VStack align="stretch" gap={1}>
                      <Text fontSize="sm" color="gray.600">
                        Party Type *
                      </Text>
                      <Box
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="md"
                        p={2}
                      >
                        <select
                          value={newParty.partyType}
                          onChange={(e) =>
                            handleNewPartyChange("partyType", e.target.value)
                          }
                          style={{
                            width: "100%",
                            background: "transparent",
                            outline: "none",
                            cursor: "pointer",
                            fontSize: "14px",
                          }}
                        >
                          <option value="PLAINTIFF">Plaintiff</option>
                          <option value="DEFENDANT">Defendant</option>
                          <option value="ACCUSED">Accused</option>
                          <option value="APPELLANT">Appellant</option>
                          <option value="RESPONDENT">Respondent</option>
                          <option value="APPLICANT">Applicant</option>
                        </select>
                      </Box>
                    </VStack>

                    <VStack align="stretch" gap={1}>
                      <Text fontSize="sm" color="gray.600">
                        Representation *
                      </Text>
                      <Box
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="md"
                        p={2}
                      >
                        <select
                          value={newParty.representation}
                          onChange={(e) =>
                            handleNewPartyChange(
                              "representation",
                              e.target.value
                            )
                          }
                          style={{
                            width: "100%",
                            background: "transparent",
                            outline: "none",
                            cursor: "pointer",
                            fontSize: "14px",
                          }}
                        >
                          <option value="REPRESENTED">Represented</option>
                          <option value="OPPOSING">Opposing</option>
                          <option value="SELF">Self</option>
                        </select>
                      </Box>
                    </VStack>

                    <VStack align="stretch" gap={1}>
                      <Text fontSize="sm" color="gray.600">
                        Full Name *
                      </Text>
                      <input
                        type="text"
                        value={newParty.fullName}
                        onChange={(e) =>
                          handleNewPartyChange("fullName", e.target.value)
                        }
                        placeholder="Enter full name"
                        style={{
                          padding: "10px",
                          borderRadius: "6px",
                          border: "1px solid #e2e8f0",
                          fontSize: "14px",
                        }}
                      />
                    </VStack>

                    <VStack align="stretch" gap={1}>
                      <Text fontSize="sm" color="gray.600">
                        Mobile Number *
                      </Text>
                      <input
                        type="text"
                        value={newParty.mobileNo}
                        onChange={(e) =>
                          handleNewPartyChange("mobileNo", e.target.value)
                        }
                        placeholder="Enter mobile number"
                        style={{
                          padding: "10px",
                          borderRadius: "6px",
                          border: "1px solid #e2e8f0",
                          fontSize: "14px",
                        }}
                      />
                    </VStack>

                    <VStack align="stretch" gap={1}>
                      <Text fontSize="sm" color="gray.600">
                        Email
                      </Text>
                      <input
                        type="email"
                        value={newParty.email || ""}
                        onChange={(e) =>
                          handleNewPartyChange("email", e.target.value)
                        }
                        placeholder="Enter email"
                        style={{
                          padding: "10px",
                          borderRadius: "6px",
                          border: "1px solid #e2e8f0",
                          fontSize: "14px",
                        }}
                      />
                    </VStack>

                    <VStack align="stretch" gap={1}>
                      <Text fontSize="sm" color="gray.600">
                        Address
                      </Text>
                      <input
                        type="text"
                        value={newParty.address || ""}
                        onChange={(e) =>
                          handleNewPartyChange("address", e.target.value)
                        }
                        placeholder="Enter address"
                        style={{
                          padding: "10px",
                          borderRadius: "6px",
                          border: "1px solid #e2e8f0",
                          fontSize: "14px",
                        }}
                      />
                    </VStack>
                  </Grid>

                  <HStack gap={2} justify="flex-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsAddingParty(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleAddParty}
                      disabled={addPartyMutation.isPending}
                    >
                      {addPartyMutation.isPending ? "Adding..." : "Add Party"}
                    </Button>
                  </HStack>
                </VStack>
              </Box>
            )}

            {caseLoading ? (
              <VStack gap={3}>
                {[...Array(3)].map((_, i) => (
                  <Box key={i} h="80px" bg="gray.100" borderRadius="md" />
                ))}
              </VStack>
            ) : parties.length === 0 ? (
              <Box py={8} textAlign="center">
                <Text fontSize="sm" color="gray.500">
                  No parties added to this case
                </Text>
              </Box>
            ) : (
              <VStack gap={3} align="stretch">
                {parties.map((party: any) => (
                  <Box
                    key={party.id}
                    p={5}
                    bg="gray.50"
                    borderRadius="lg"
                    border="1px solid"
                    borderColor="gray.100"
                    _hover={{ bg: "gray.100", transition: "all 0.2s ease" }}
                  >
                    <HStack justify="space-between" align="flex-start">
                      <VStack align="stretch" gap={3}>
                        <HStack gap={2} flexWrap="wrap">
                          <Badge
                            bg="blue.100"
                            color="blue.700"
                            px={3}
                            py={1}
                            borderRadius="full"
                            fontSize="xs"
                            fontWeight="600"
                          >
                            {party.partyType}
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
                            {party.representation}
                          </Badge>
                          {party.ourClient && (
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

                        <Text fontSize="base" fontWeight="600" color="gray.900">
                          {party.fullName}
                        </Text>

                        <VStack align="stretch" gap={1}>
                          {party.mobileNo && (
                            <HStack gap={2}>
                              <User size={14} color="#6b7280" />
                              <Text fontSize="sm" color="gray.600">
                                {party.mobileNo}
                              </Text>
                            </HStack>
                          )}
                          {party.email && (
                            <HStack gap={2}>
                              <Clipboard size={14} color="#6b7280" />
                              <Text fontSize="sm" color="gray.600">
                                {party.email}
                              </Text>
                            </HStack>
                          )}
                          {party.address && (
                            <HStack gap={2}>
                              <Building size={14} color="#6b7280" />
                              <Text fontSize="sm" color="gray.600">
                                {party.address}
                              </Text>
                            </HStack>
                          )}
                          {party.notes && (
                            <Text
                              fontSize="sm"
                              color="gray.500"
                              fontStyle="italic"
                              mt={2}
                            >
                              {party.notes}
                            </Text>
                          )}
                        </VStack>
                      </VStack>

                      <HStack gap={2}>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleDeleteParty(party.id)}
                        >
                          Remove
                        </Button>
                      </HStack>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            )}
          </SectionCard>
        </VStack>
      )}

      {activeTab === "timeline" && (
        <VStack gap={6} align="stretch">
          <SectionCard title="Timeline" icon={History}>
            {timelineLoading ? (
              <VStack gap={3}>
                {[...Array(3)].map((_, i) => (
                  <Box key={i} h="80px" bg="gray.100" borderRadius="md" />
                ))}
              </VStack>
            ) : timeline.length === 0 ? (
              <Box py={8} textAlign="center">
                <Text fontSize="sm" color="gray.500">
                  No timeline events recorded
                </Text>
              </Box>
            ) : (
              <VStack gap={4} align="stretch">
                {timeline.map((event) => (
                  <HStack key={event.id} gap={4} align="flex-start">
                    <Box
                      w="10"
                      h="10"
                      borderRadius="full"
                      bg="blue.100"
                      color="blue.700"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      flexShrink={0}
                    >
                      {event.eventType === "CASE_CREATED" && "🚩"}
                      {event.eventType === "STAGE_CHANGE" && "➡️"}
                      {event.eventType === "PARTY_ADDED" && "👤"}
                      {event.eventType === "CASE_NOTE_ADDED" && "📝"}
                      {event.eventType === "HEARING_SCHEDULED" && "📅"}
                      {event.eventType === "HEARING_HELD" && "✅"}
                      {event.eventType === "HEARING_ADJOURNED" && "⏸️"}
                    </Box>

                    <VStack
                      align="stretch"
                      gap={2}
                      flex={1}
                      pb={4}
                      borderBottom="1px solid"
                      borderColor="gray.100"
                    >
                      <HStack justify="space-between" align="center">
                        <Text fontSize="base" fontWeight="600" color="gray.900">
                          {event.title}
                        </Text>
                        <HStack gap={2} align="center">
                          <Clock size={14} color="#9ca3af" />
                          <Text fontSize="xs" color="gray.500">
                            {new Date(event.createdAt).toLocaleString()}
                          </Text>
                        </HStack>
                      </HStack>
                      {event.description && (
                        <Text fontSize="sm" color="gray.700" lineHeight="1.6">
                          {event.description}
                        </Text>
                      )}
                      <Text fontSize="xs" color="gray.400">
                        By {event.createdBy}
                      </Text>
                    </VStack>
                  </HStack>
                ))}
              </VStack>
            )}
          </SectionCard>
        </VStack>
      )}

      {activeTab === "hearings" && (
        <VStack gap={6} align="stretch">
          <SectionCard title="Hearings" icon={Calendar}>
            <HStack justify="space-between" mb={4}>
              <HStack gap={4}>
                <Text fontSize="sm" color="gray.500">
                  {hearings.length}{" "}
                  {hearings.length === 1 ? "hearing" : "hearings"} scheduled
                </Text>
                <HStack gap={2}>
                  {["all", "upcoming", "completed", "cancelled"].map(
                    (filter) => (
                      <Button
                        key={filter}
                        variant={hearingFilter === filter ? "solid" : "outline"}
                        size="xs"
                        onClick={() => setHearingFilter(filter as any)}
                        colorScheme={hearingFilter === filter ? "blue" : "gray"}
                      >
                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                      </Button>
                    )
                  )}
                </HStack>
              </HStack>
              <Button variant="outline" size="sm" onClick={handleCreateHearing}>
                <Plus size={16} style={{ marginRight: 8 }} />
                Schedule Hearing
              </Button>
            </HStack>

            {hearingsLoading ? (
              <VStack gap={3}>
                {[...Array(3)].map((_, i) => (
                  <Box key={i} h="100px" bg="gray.100" borderRadius="md" />
                ))}
              </VStack>
            ) : hearings.length === 0 ? (
              <Box py={12} textAlign="center">
                <Calendar
                  size={48}
                  color="#d1d5db"
                  style={{ margin: "0 auto 16px" }}
                />
                <Text fontSize="lg" fontWeight="600" mb={2}>
                  No Hearings Scheduled
                </Text>
                <Text fontSize="sm" color="gray.500" mb={6}>
                  Schedule the first hearing for this case
                </Text>
                <Button colorScheme="blue" onClick={handleCreateHearing}>
                  <Plus size={16} style={{ marginRight: 8 }} />
                  Schedule First Hearing
                </Button>
              </Box>
            ) : (
              <HearingTimeline
                hearings={hearings}
                onViewDetails={handleViewHearing}
                onEdit={handleEditHearing}
                onCancel={handleCancelHearing}
              />
            )}
          </SectionCard>
        </VStack>
      )}

      {/* Hearing Modals */}
      <HearingDetailsModal
        hearing={selectedHearing}
        isOpen={isHearingDetailsOpen}
        onClose={() => setIsHearingDetailsOpen(false)}
        onEdit={handleEditHearing}
        onCancel={handleCancelHearing}
      />

      <HearingFormModal
        isOpen={isHearingFormOpen}
        onClose={() => setIsHearingFormOpen(false)}
        onSubmit={handleHearingSubmit}
        initialData={editingHearing}
        caseNumber={caseNumber || ""}
      />

      {/* Back Button */}
      <Button
        variant="outline"
        onClick={() => navigate("/cases")}
        alignSelf="flex-start"
      >
        <HStack gap={2}>
          <ArrowLeft size={16} />
          <span>Back to Cases</span>
        </HStack>
      </Button>
    </Stack>
  );
};

export default CaseDetailPage;
