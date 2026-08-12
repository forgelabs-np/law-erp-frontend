import {
  Box,
  Button,
  Grid,
  HStack,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Building,
  Calendar,
  Hash,
  Notebook,
  UserPlus,
  Shield,
} from "lucide-react";

import {
  CaseType,
  CreateCaseRequest,
  CreatePartyRequest,
} from "../types/case.types";

interface PartyWithId extends CreatePartyRequest {
  id: string;
}

import { useCreateCaseMutation } from "../api/case.api";
import { useMatchPartyMutation } from "../api/party.api";
import { getInitialStage } from "../utils/stageTransitions";
import { toastFail, toastSuccess } from "@/shared/toast";

import {
  PageHeader,
  Stepper,
  FormSection,
  FormInput,
  FormTextarea,
  CaseTypeSelector,
  PartyForm,
  StickyActionBar,
} from "../components/wizard";

type Step = 1 | 2 | 3;

const CreateCasePage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const createCaseMutation = useCreateCaseMutation();
  const matchPartyMutation = useMatchPartyMutation();

  const [caseType, setCaseType] = useState<CaseType>("CIVIL");
  const [formData, setFormData] = useState<CreateCaseRequest>({
    caseType: "CIVIL",
    title: "",
  });
  const [plaintiffs, setPlaintiffs] = useState<PartyWithId[]>([]);
  const [defendants, setDefendants] = useState<PartyWithId[]>([]);
  const [partyMatches, setPartyMatches] = useState<any[]>([]);
  const [expandedPartyIds, setExpandedPartyIds] = useState<Set<string>>(
    new Set()
  );

  const handleTypeChange = (type: CaseType) => {
    setCaseType(type);
    setFormData({ ...formData, caseType: type });
  };

  const handleFieldChange = (field: keyof CreateCaseRequest, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAddParty = (
    type: "plaintiff" | "defendant",
    party: CreatePartyRequest
  ) => {
    const newParty: PartyWithId = {
      ...party,
      id: `${Date.now()}-${Math.random()}`,
    };
    if (type === "plaintiff") {
      setPlaintiffs([...plaintiffs, newParty]);
      setExpandedPartyIds(new Set([...expandedPartyIds, newParty.id]));
    } else {
      setDefendants([...defendants, newParty]);
      setExpandedPartyIds(new Set([...expandedPartyIds, newParty.id]));
    }
  };

  const handleUpdateParty = (
    type: "plaintiff" | "defendant",
    partyId: string,
    updatedParty: CreatePartyRequest
  ) => {
    if (type === "plaintiff") {
      setPlaintiffs(
        plaintiffs.map((p) =>
          p.id === partyId ? { ...updatedParty, id: partyId } : p
        )
      );
    } else {
      setDefendants(
        defendants.map((p) =>
          p.id === partyId ? { ...updatedParty, id: partyId } : p
        )
      );
    }
  };

  const handleDeleteParty = (
    type: "plaintiff" | "defendant",
    partyId: string
  ) => {
    if (type === "plaintiff") {
      setPlaintiffs(plaintiffs.filter((p) => p.id !== partyId));
      setExpandedPartyIds(
        new Set([...expandedPartyIds].filter((id) => id !== partyId))
      );
    } else {
      setDefendants(defendants.filter((p) => p.id !== partyId));
      setExpandedPartyIds(
        new Set([...expandedPartyIds].filter((id) => id !== partyId))
      );
    }
  };

  const handleTogglePartyExpand = (partyId: string) => {
    const newExpanded = new Set(expandedPartyIds);
    if (newExpanded.has(partyId)) {
      newExpanded.delete(partyId);
    } else {
      newExpanded.add(partyId);
    }
    setExpandedPartyIds(newExpanded);
  };

  const handleMatchParty = async (
    fullName: string,
    mobileNo?: string,
    email?: string
  ) => {
    if (!fullName) return;

    try {
      const result = await matchPartyMutation.mutateAsync({
        fullName,
        mobileNo,
        email,
      });
      setPartyMatches(result?.data?.data || []);
    } catch (error) {
      // Match failures are expected, handle silently
      setPartyMatches([]);
    }
  };

  const validateStep = (step: Step): boolean => {
    if (step === 1) {
      return !!formData.title;
    }
    if (step === 2) {
      return true; // Type-specific fields are optional
    }
    if (step === 3) {
      return true; // Parties are optional
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      toastFail("Please fill in required fields");
      return;
    }
    setCurrentStep((currentStep + 1) as Step);
  };

  const handleBack = () => {
    setCurrentStep((currentStep - 1) as Step);
  };

  const handleSubmit = async () => {
    try {
      const payload: CreateCaseRequest = {
        ...formData,
        plaintiffs: plaintiffs.length > 0 ? plaintiffs : undefined,
        defendants: defendants.length > 0 ? defendants : undefined,
      };

      const result = await createCaseMutation.mutateAsync(payload);

      if (result?.data?.data?.caseNumber) {
        toastSuccess(
          `Case ${result.data.data.caseNumber} created successfully`
        );
        navigate(`/cases/${result.data.data.caseNumber}`);
      }
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const isCivil = caseType === "CIVIL";

  const steps = [
    { id: 1, title: "Case Type & Basic Information" },
    { id: 2, title: "Additional Details" },
    { id: 3, title: "Review & Confirm" },
  ];

  const getNextLabel = () => {
    if (currentStep === 3) return "Create Case";
    return "Next Step";
  };

  const isNextDisabled = () => {
    if (currentStep === 1) return !formData.title;
    if (currentStep === 3) return createCaseMutation.isPending;
    return false;
  };

  return (
    <Stack gap={8} padding={8} bg="gray.50" minH="100vh">
      {/* Page Header */}
      <PageHeader
        title="Create New Case"
        subtitle="Complete the form in multiple steps to create a new legal case"
        breadcrumb={["Cases", "Create New Case"]}
      />

      {/* Stepper */}
      <Stepper steps={steps} currentStep={currentStep - 1} />

      {/* Main Card */}
      <Box
        bg="white"
        borderRadius="16px"
        border="1px solid"
        borderColor="gray.200"
        boxShadow="sm"
        p={8}
        maxW="900px"
        mx="auto"
      >
        {/* Step 1: Case Type & Basic Information */}
        {currentStep === 1 && (
          <VStack gap={6} align="stretch">
            <FormSection
              title="Step 1: Case Type & Basic Information"
              icon={FileText}
            >
              {/* Case Type Selector */}
              <VStack align="stretch" gap={3} mb={6}>
                <Text fontSize="14px" fontWeight="500" color="gray.700">
                  Case Type *
                </Text>
                <CaseTypeSelector
                  value={caseType}
                  onChange={handleTypeChange}
                />
              </VStack>

              {/* Basic Information */}
              <Grid
                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                gap={4}
                mb={4}
              >
                <FormInput
                  label="Title"
                  value={formData.title}
                  onChange={(value) => handleFieldChange("title", value)}
                  placeholder="Enter case title"
                  icon={FileText}
                  required
                  helperText="A descriptive title for the case"
                />
                <FormInput
                  label="Court Name"
                  value={formData.courtName || ""}
                  onChange={(value) => handleFieldChange("courtName", value)}
                  placeholder="Enter court name"
                  icon={Building}
                  helperText="The court where the case is filed"
                />
              </Grid>

              <Grid
                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                gap={4}
                mb={4}
              >
                <FormInput
                  label="Court Case Number"
                  value={formData.courtCaseNumber || ""}
                  onChange={(value) =>
                    handleFieldChange("courtCaseNumber", value)
                  }
                  placeholder="Enter court case number"
                  icon={Hash}
                />
                <Box />
              </Grid>

              {/* Filing Information */}
              <FormSection title="Filing Information" icon={Calendar}>
                <Grid
                  templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                  gap={4}
                >
                  <FormInput
                    label="Filing Date"
                    value={formData.filingDate || ""}
                    onChange={(value) => handleFieldChange("filingDate", value)}
                    type="date"
                    icon={Calendar}
                  />
                  <FormInput
                    label="Filing Number"
                    value={formData.filingNumber || ""}
                    onChange={(value) =>
                      handleFieldChange("filingNumber", value)
                    }
                    placeholder="Enter filing number"
                    icon={Hash}
                  />
                </Grid>
              </FormSection>

              {/* Description */}
              <FormTextarea
                label="Description"
                value={formData.description || ""}
                onChange={(value) => handleFieldChange("description", value)}
                placeholder="Provide a detailed description of the case"
                icon={FileText}
                helperText="Include relevant details about the case"
                rows={5}
                showCharCount
                maxLength={2000}
              />
            </FormSection>

            <StickyActionBar
              onCancel={() => navigate("/cases")}
              onNext={handleNext}
              isNextDisabled={isNextDisabled()}
              nextLabel={getNextLabel()}
            />
          </VStack>
        )}

        {/* Step 2: Type-specific Details */}
        {currentStep === 2 && (
          <VStack gap={6} align="stretch">
            <FormSection
              title={`Step 2: ${isCivil ? "Civil Case Details" : "Criminal Case Details"}`}
              icon={Notebook}
            >
              {isCivil ? (
                <Grid
                  templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                  gap={4}
                >
                  <FormInput
                    label="Mediation Date"
                    value={formData.mediationDate || ""}
                    onChange={(value) =>
                      handleFieldChange("mediationDate", value)
                    }
                    type="date"
                    icon={Calendar}
                  />
                  <FormInput
                    label="Mediation Outcome"
                    value={formData.mediationOutcome || ""}
                    onChange={(value) =>
                      handleFieldChange("mediationOutcome", value)
                    }
                    placeholder="Enter mediation outcome"
                    icon={FileText}
                  />
                  <FormInput
                    label="Written Statement Deadline"
                    value={formData.writtenStatementDeadline || ""}
                    onChange={(value) =>
                      handleFieldChange("writtenStatementDeadline", value)
                    }
                    type="date"
                    icon={Calendar}
                  />
                </Grid>
              ) : (
                <Grid
                  templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                  gap={4}
                >
                  <FormInput
                    label="FIR Number"
                    value={formData.firNumber || ""}
                    onChange={(value) => handleFieldChange("firNumber", value)}
                    placeholder="Enter FIR number"
                    icon={Hash}
                  />
                  <FormInput
                    label="FIR Date"
                    value={formData.firDate || ""}
                    onChange={(value) => handleFieldChange("firDate", value)}
                    type="date"
                    icon={Calendar}
                  />
                  <FormInput
                    label="Police Station"
                    value={formData.policeStation || ""}
                    onChange={(value) =>
                      handleFieldChange("policeStation", value)
                    }
                    placeholder="Enter police station"
                    icon={Building}
                  />
                  <FormInput
                    label="Investigation Authority"
                    value={formData.investigationAuthority || ""}
                    onChange={(value) =>
                      handleFieldChange("investigationAuthority", value)
                    }
                    placeholder="Enter investigation authority"
                    icon={Shield}
                  />
                  <FormInput
                    label="Arrest Date"
                    value={formData.arrestDate || ""}
                    onChange={(value) => handleFieldChange("arrestDate", value)}
                    type="date"
                    icon={Calendar}
                  />
                  <FormInput
                    label="Charge Sheet Date"
                    value={formData.chargeSheetDate || ""}
                    onChange={(value) =>
                      handleFieldChange("chargeSheetDate", value)
                    }
                    type="date"
                    icon={Calendar}
                  />
                  <Box gridColumn={{ base: "1", md: "span 2" }}>
                    <VStack align="stretch" gap={2}>
                      <Text fontSize="14px" fontWeight="500" color="gray.700">
                        Bail Status
                      </Text>
                      <Box
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="md"
                        p={2}
                      >
                        <select
                          value={formData.bailStatus || ""}
                          onChange={(e) =>
                            handleFieldChange(
                              "bailStatus",
                              e.target.value || undefined
                            )
                          }
                          style={{
                            width: "100%",
                            background: "transparent",
                            outline: "none",
                            cursor: "pointer",
                            fontSize: "15px",
                          }}
                        >
                          <option value="">Select bail status</option>
                          <option value="GRANTED">Granted</option>
                          <option value="DENIED">Denied</option>
                          <option value="PENDING">Pending</option>
                        </select>
                      </Box>
                    </VStack>
                  </Box>
                </Grid>
              )}
            </FormSection>

            <StickyActionBar
              onCancel={() => navigate("/cases")}
              onNext={handleNext}
              onBack={handleBack}
              isNextDisabled={isNextDisabled()}
              nextLabel={getNextLabel()}
            />
          </VStack>
        )}

        {/* Step 3: Parties */}
        {currentStep === 3 && (
          <VStack gap={6} align="stretch">
            <FormSection title="Step 3: Add Parties" icon={UserPlus}>
              <Text fontSize="14px" color="gray.600" mb={4}>
                Add {isCivil ? "plaintiffs and defendants" : "accused"} to this
                case (optional)
              </Text>

              {/* Plaintiffs/Accused */}
              <VStack align="stretch" gap={3} mb={6}>
                <HStack justify="space-between" align="center">
                  <Text fontSize="16px" fontWeight="600" color="gray.900">
                    {isCivil ? "Plaintiffs" : "Accused"}
                  </Text>
                  <Text fontSize="13px" color="gray.500">
                    {plaintiffs.length}{" "}
                    {plaintiffs.length === 1 ? "person" : "people"}
                  </Text>
                </HStack>

                {plaintiffs.length === 0 ? (
                  <Box
                    py={8}
                    textAlign="center"
                    bg="gray.50"
                    borderRadius="lg"
                    border="1px dashed"
                    borderColor="gray.300"
                  >
                    <Text fontSize="14px" color="gray.500">
                      No {isCivil ? "plaintiffs" : "accused"} added yet
                    </Text>
                  </Box>
                ) : (
                  <VStack gap={2}>
                    {plaintiffs.map((party) => (
                      <PartyForm
                        key={party.id}
                        party={party}
                        onChange={(updatedParty) =>
                          handleUpdateParty("plaintiff", party.id, updatedParty)
                        }
                        onDelete={() =>
                          handleDeleteParty("plaintiff", party.id)
                        }
                        partyTypeLabel={isCivil ? "Plaintiff" : "Accused"}
                        isExpanded={expandedPartyIds.has(party.id)}
                        onToggleExpand={() => handleTogglePartyExpand(party.id)}
                      />
                    ))}
                  </VStack>
                )}

                <Button
                  variant="outline"
                  onClick={() => {
                    const newParty: CreatePartyRequest = {
                      partyType: isCivil ? "PLAINTIFF" : "ACCUSED",
                      representation: "REPRESENTED",
                      fullName: "",
                      mobileNo: "",
                      ourClient: true,
                    };
                    handleAddParty("plaintiff", newParty);
                  }}
                >
                  + Add {isCivil ? "Plaintiff" : "Accused"}
                </Button>
              </VStack>

              {/* Defendants */}
              <VStack align="stretch" gap={3}>
                <HStack justify="space-between" align="center">
                  <Text fontSize="16px" fontWeight="600" color="gray.900">
                    Defendants
                  </Text>
                  <Text fontSize="13px" color="gray.500">
                    {defendants.length}{" "}
                    {defendants.length === 1 ? "person" : "people"}
                  </Text>
                </HStack>

                {defendants.length === 0 ? (
                  <Box
                    py={8}
                    textAlign="center"
                    bg="gray.50"
                    borderRadius="lg"
                    border="1px dashed"
                    borderColor="gray.300"
                  >
                    <Text fontSize="14px" color="gray.500">
                      No defendants added yet
                    </Text>
                  </Box>
                ) : (
                  <VStack gap={2}>
                    {defendants.map((party) => (
                      <PartyForm
                        key={party.id}
                        party={party}
                        onChange={(updatedParty) =>
                          handleUpdateParty("defendant", party.id, updatedParty)
                        }
                        onDelete={() =>
                          handleDeleteParty("defendant", party.id)
                        }
                        partyTypeLabel="Defendant"
                        isExpanded={expandedPartyIds.has(party.id)}
                        onToggleExpand={() => handleTogglePartyExpand(party.id)}
                      />
                    ))}
                  </VStack>
                )}

                <Button
                  variant="outline"
                  onClick={() => {
                    const newParty: CreatePartyRequest = {
                      partyType: "DEFENDANT",
                      representation: "OPPOSING",
                      fullName: "",
                      mobileNo: "",
                      ourClient: false,
                    };
                    handleAddParty("defendant", newParty);
                  }}
                >
                  + Add Defendant
                </Button>
              </VStack>
            </FormSection>

            <StickyActionBar
              onCancel={() => navigate("/cases")}
              onNext={handleSubmit}
              onBack={handleBack}
              isNextDisabled={isNextDisabled()}
              nextLabel={getNextLabel()}
            />
          </VStack>
        )}
      </Box>
    </Stack>
  );
};

export default CreateCasePage;
