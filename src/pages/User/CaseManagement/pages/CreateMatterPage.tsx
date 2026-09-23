import {
  Box,
  Button,
  Center,
  Grid,
  HStack,
  Input,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FileText, Gavel, Scale, User, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

import { useGetEmployeesQuery } from "@/api/employeeManagement";

import { useCourtsByTypeQuery } from "@/shared/hooks/useScraper";
import { CourtType } from "@/shared/types/scraper.types";
import { useCreateMatterMutation } from "../api/matter.api";
import {
  CourtLevel,
  CreateMatterRequest,
  MatterType,
  PartyEntryRequest,
  PartyRepresentation,
  PartyType,
} from "../types/matter.types";
import {
  matterTypeLabel,
  partyTypeLabel,
  representationLabel,
} from "../utils/matterHelpers";
import {
  FormInput,
  FormSection,
  FormTextarea,
  PageHeader,
  Stepper,
  StickyActionBar,
} from "../components/wizard";
import { CaseTypeSelector } from "../components/wizard/CaseTypeSelector";
import { FieldSelect } from "../components/ui";
import { DatePicker } from "@/shared/components/ui";
import { AddPartyModal } from "../components/AddPartyModal";
import { PartyMatchSuggestions } from "../components/PartyMatchSuggestions";
import { useMatchMatterPartyMutation } from "../api/matterParty.api";
import { PartyMatch } from "../types/matter.types";

const STEPS = [
  { id: 1, title: "Basic Information" },
  { id: 2, title: "Original Court Case" },
  { id: 3, title: "Parties" },
  { id: 4, title: "Review & Save" },
];

const COURT_LEVELS: CourtLevel[] = [
  "DISTRICT",
  "HIGH",
  "SUPREME",
  "SPECIALIZED",
];

/** Compact field styling used inside the dense party cards. */
const compactInputProps = {
  size: "sm" as const,
  borderRadius: "md",
  height: "40px",
  fontSize: "14px",
  bg: "white",
  borderColor: "gray.200",
  _placeholder: { color: "gray.400" },
  _hover: { borderColor: "gray.300" },
  _focus: {
    borderColor: "primary.500",
    boxShadow: "0 0 0 3px #E3E7FC",
  },
  transition: "all 0.18s ease",
};

const FieldLabel = ({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) => (
  <Text
    mb={2}
    fontSize="13px"
    fontWeight="600"
    color="gray.700"
    letterSpacing="0.01em"
  >
    {children}
    {required && (
      <Text as="span" color="red.500" ml={1}>
        *
      </Text>
    )}
  </Text>
);

const CompactLabel = ({ children }: { children: React.ReactNode }) => (
  <Text
    mb={1.5}
    fontSize="11px"
    fontWeight="600"
    color="gray.500"
    letterSpacing="0.04em"
    textTransform="uppercase"
  >
    {children}
  </Text>
);

interface PartyDraft extends PartyEntryRequest {
  key: string;
}

const CreateMatterPage = () => {
  const navigate = useNavigate();
  const { data: employeesData } = useGetEmployeesQuery();
  const employees = employeesData?.content ?? [];

  const createMatterMutation = useCreateMatterMutation();

  const [currentStep, setCurrentStep] = useState(0);

  // Step 1 - basic information
  const [matterType, setMatterType] = useState<MatterType>("CIVIL");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedPartnerId, setAssignedPartnerId] = useState("");
  const [advocateId, setAdvocateId] = useState("");

  // Step 2 - original court case
  const [courtLevel, setCourtLevel] = useState<CourtLevel>("DISTRICT");
  const [courtId, setCourtId] = useState<number | null>(null);
  const [courtName, setCourtName] = useState("");
  const [courtCaseNumber, setCourtCaseNumber] = useState("");
  const [filingDate, setFilingDate] = useState("");

  // Map CourtLevel to API courtType
  const courtTypeMap: Record<CourtLevel, CourtType> = {
    DISTRICT: "DISTRICT",
    HIGH: "HIGH_COURT",
    SUPREME: "SUPREME_COURT",
    SPECIALIZED: "DISTRICT",
  };
  const apiCourtType = courtTypeMap[courtLevel];

  // Fetch courts for the selected court type
  const { data: courts = [], isLoading: courtsLoading } =
    useCourtsByTypeQuery(apiCourtType);

  // Handle court level change - clear court selection
  const handleCourtLevelChange = (value: string) => {
    setCourtLevel(value as CourtLevel);
    setCourtId(null);
    setCourtName("");
  };

  // Handle court selection
  const handleCourtSelect = (value: string) => {
    const selectedCourtId = Number(value);
    const selectedCourt = courts.find((c) => c.courtId === selectedCourtId);
    if (selectedCourt) {
      setCourtId(selectedCourt.courtId);
      setCourtName(selectedCourt.courtNameEnglish);
    }
  };

  // Step 3 - parties
  const [parties, setParties] = useState<PartyDraft[]>([]);
  const [isAddPartyOpen, setIsAddPartyOpen] = useState(false);
  const [matchesByParty, setMatchesByParty] = useState<
    Record<string, PartyMatch[]>
  >({});
  const matchPartyMutation = useMatchMatterPartyMutation();
  const matchTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const stepValidation = useMemo(() => {
    return [
      title.trim().length > 0 && matterType !== null,
      courtName.trim().length > 0 && courtCaseNumber.trim().length > 0,
      parties.length > 0 && parties.every((p) => p.fullName.trim().length > 0),
      true,
    ];
  }, [title, matterType, courtName, courtCaseNumber, parties]);

  const handlePartyMatch = (party: PartyDraft) => {
    const mail = party.email ? party.email.trim() : "";
    const isEmailValid =
      mail.length > 0 && yup.string().email().isValidSync(mail);

    if (!isEmailValid) {
      if (matchTimers.current[party.key]) {
        clearTimeout(matchTimers.current[party.key]);
      }
      setMatchesByParty((prev) => ({ ...prev, [party.key]: [] }));
      return;
    }

    // Debounce per party so we don't hit the match API on every keystroke.
    if (matchTimers.current[party.key]) {
      clearTimeout(matchTimers.current[party.key]);
    }
    matchTimers.current[party.key] = setTimeout(() => {
      matchPartyMutation.mutate(
        {
          fullName: party.fullName.trim(),
          mobileNo: party.mobileNo?.trim() || undefined,
          email: mail,
        },
        {
          onSuccess: (response) => {
            setMatchesByParty((prev) => ({
              ...prev,
              [party.key]: response?.data?.data ?? [],
            }));
          },
        }
      );
    }, 500);
  };

  const selectMatch = (partyKey: string, match: PartyMatch) => {
    setParties((prev) =>
      prev.map((p) =>
        p.key === partyKey
          ? {
            ...p,
            fullName: match.fullName,
            mobileNo: match.mobileNo ?? "",
            email: match.email ?? "",
            clientId:
              match.sourceType === "CLIENT" ? match.sourceId : undefined,
            isOurClient: match.sourceType === "CLIENT" ? true : p.isOurClient,
          }
          : p
      )
    );
    setMatchesByParty((prev) => ({ ...prev, [partyKey]: [] }));
  };

  const handleCreate = () => {
    const payload: CreateMatterRequest = {
      matterType,
      title: title.trim(),
      originatingCourtLevel: courtLevel,
      courtName: courtName.trim(),
      courtCaseNumber: courtCaseNumber.trim(),
      filingDate,
      assignedPartnerId: assignedPartnerId || undefined,
      advocateId: advocateId || undefined,
      description: description.trim() || undefined,
      parties: parties.map(({ key: _key, ...party }) => ({
        ...party,
        fullName: party.fullName.trim(),
        mobileNo: party.mobileNo?.trim() || undefined,
        email: party.email?.trim() || undefined,
        clientId: party.clientId || undefined,
      })),
    };

    createMatterMutation.mutate(payload, {
      onSuccess: (response) => {
        navigate(`/cases/${response?.data?.data?.matterNumber}`);
      },
    });
  };

  const defaultRoleForType = (type: MatterType): PartyType =>
    type === "CIVIL" ? "PLAINTIFF" : "ACCUSED";

  const updateParty = (key: string, patch: Partial<PartyDraft>) => {
    setParties((prev) =>
      prev.map((p) => (p.key === key ? { ...p, ...patch } : p))
    );
  };

  return (
    <Stack gap={0} padding={{ base: 4, md: 8 }} maxW="980px" mx="auto" w="100%">
      <PageHeader
        title="Create Matter"
        subtitle="Set up the essential information for this legal matter, its original court case, and the parties involved."
        breadcrumb={["Cases", "Create Matter"]}
      />

      <Stepper steps={STEPS} currentStep={currentStep} />

      {/* Step 1 - Basic Information */}
      {currentStep === 0 && (
        <FormSection
          title="Matter Details"
          description="The core information used to identify and organise this matter."
          icon={FileText}
        >
          <VStack gap={6} align="stretch">
            <Box>
              <FieldLabel required>Matter Type</FieldLabel>
              <CaseTypeSelector
                value={matterType}
                onChange={(type) => {
                  setMatterType(type);
                  setParties((prev) =>
                    prev.map((p) => ({
                      ...p,
                      roleType: defaultRoleForType(type),
                    }))
                  );
                }}
              />
            </Box>

            <Box borderTop="1px solid" borderColor="gray.100" pt={6}>
              <FormInput
                label="Matter Title"
                required
                emphasis
                value={title}
                onChange={setTitle}
                placeholder="e.g. ABC Industries vs XYZ Ltd."
                helperText="Use a concise, descriptive name that clearly identifies the dispute or case."
              />
            </Box>

            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={5}>
              <Box>
                <FieldLabel>Assigned Partner</FieldLabel>
                <FieldSelect
                  size="lg"
                  value={assignedPartnerId}
                  onChange={setAssignedPartnerId}
                  placeholder="No partner assigned"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.fullName}
                    </option>
                  ))}
                </FieldSelect>
              </Box>
              <Box>
                <FieldLabel>Assigned Advocate</FieldLabel>
                <FieldSelect
                  size="lg"
                  value={advocateId}
                  onChange={setAdvocateId}
                  placeholder="No advocate assigned"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.fullName}
                    </option>
                  ))}
                </FieldSelect>
              </Box>
            </Grid>

            <Box borderTop="1px solid" borderColor="gray.100" pt={6}>
              <FormTextarea
                label="Description"
                value={description}
                onChange={setDescription}
                placeholder="Add any background, key facts, or context that helps the team understand this matter."
                rows={5}
              />
            </Box>
          </VStack>
        </FormSection>
      )}

      {/* Step 2 - Original Court Case */}
      {currentStep === 1 && (
        <FormSection
          title="Original Court Case"
          description="The original court case is created together with the matter."
          icon={Scale}
        >
          <VStack gap={6} align="stretch">
            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={5}>
              <Box>
                <FieldLabel required>Court Level</FieldLabel>
                <FieldSelect
                  size="lg"
                  value={courtLevel}
                  onChange={handleCourtLevelChange}
                >
                  {COURT_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level
                        .toLowerCase()
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                    </option>
                  ))}
                </FieldSelect>
              </Box>
              <Box>
                <FieldLabel required>Court Name</FieldLabel>
                <FieldSelect
                  size="lg"
                  value={courtId?.toString() ?? ""}
                  onChange={handleCourtSelect}
                  placeholder={
                    courtsLoading
                      ? "Loading courts..."
                      : courts.length === 0
                        ? "No courts available for this level"
                        : "Select a court"
                  }
                  disabled={courtsLoading || courts.length === 0}
                >
                  {courts.map((court) => (
                    <option key={court.courtId} value={court.courtId}>
                      {court.courtNameEnglish}
                    </option>
                  ))}
                </FieldSelect>
                <Text fontSize="12px" color="gray.500" mt={2} lineHeight="1.5">
                  Courts are filtered by the selected court level.
                </Text>
              </Box>
            </Grid>

            <Box borderTop="1px solid" borderColor="gray.100" pt={6}>
              <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={5}>
                <FormInput
                  label="Court Case Number"
                  required
                  value={courtCaseNumber}
                  onChange={setCourtCaseNumber}
                  placeholder="e.g. C-123/082"
                  helperText="The case number assigned by the court."
                />
                <Box>
                  <FieldLabel>Filing Date</FieldLabel>
                  <DatePicker
                    value={filingDate}
                    onChange={setFilingDate}
                    placeholder="Select filing date"
                  />
                  <Text
                    fontSize="12px"
                    color="gray.500"
                    mt={2}
                    lineHeight="1.5"
                  >
                    The date the case was filed at the court.
                  </Text>
                </Box>
              </Grid>
            </Box>
          </VStack>
        </FormSection>
      )}

      {/* Step 3 - Parties */}
      {currentStep === 2 && (
        <FormSection
          title="Parties"
          description="Add the parties of the original court case. Matching clients and parties are suggested to avoid duplicates."
          icon={User}
        >
          <HStack justify="flex-end" mb={5}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddPartyOpen(true)}
            >
              + Add Party
            </Button>
          </HStack>

          {parties.length === 0 ? (
            <Center
              flexDirection="column"
              gap={3}
              py={12}
              px={6}
              border="1px dashed"
              borderColor="gray.300"
              borderRadius="xl"
              bg="gray.50"
            >
              <Center
                w="12"
                h="12"
                borderRadius="full"
                bg="white"
                border="1px solid"
                borderColor="gray.200"
                color="gray.400"
              >
                <User size={20} />
              </Center>
              <VStack gap={1}>
                <Text fontSize="sm" fontWeight="600" color="gray.700">
                  No parties added yet
                </Text>
                <Text fontSize="13px" color="gray.500" textAlign="center">
                  Add at least one party to continue.
                </Text>
              </VStack>
              <Button
                mt={1}
                variant="outline"
                size="sm"
                onClick={() => setIsAddPartyOpen(true)}
              >
                + Add First Party
              </Button>
            </Center>
          ) : (
            <VStack gap={4} align="stretch">
              {parties.map((party) => (
                <Box
                  key={party.key}
                  p={{ base: 4, md: 5 }}
                  bg="white"
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="xl"
                  boxShadow="0 1px 2px rgba(16, 24, 40, 0.04)"
                >
                  <HStack justify="space-between" mb={4} gap={3}>
                    <HStack gap={2.5} minW={0}>
                      <Center
                        w="8"
                        h="8"
                        borderRadius="lg"
                        bg={matterType === "CIVIL" ? "primary.50" : "red.50"}
                        color={
                          matterType === "CIVIL" ? "primary.500" : "red.500"
                        }
                        flexShrink={0}
                      >
                        {matterType === "CIVIL" ? (
                          <Scale size={16} />
                        ) : (
                          <Gavel size={16} />
                        )}
                      </Center>
                      <Text
                        fontSize="14px"
                        fontWeight="600"
                        color="gray.900"
                        truncate
                      >
                        {party.fullName || "New party"}
                      </Text>
                    </HStack>
                    <Button
                      variant="ghost"
                      size="xs"
                      colorScheme="red"
                      aria-label="Remove party"
                      onClick={() =>
                        setParties((prev) =>
                          prev.filter((p) => p.key !== party.key)
                        )
                      }
                    >
                      <X size={15} />
                    </Button>
                  </HStack>

                  <Grid
                    templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
                    gap={4}
                  >
                    <Box>
                      <CompactLabel>Full Name *</CompactLabel>
                      <Input
                        {...compactInputProps}
                        value={party.fullName}
                        onChange={(e) => {
                          updateParty(party.key, { fullName: e.target.value });
                          handlePartyMatch({
                            ...party,
                            fullName: e.target.value,
                          });
                        }}
                        placeholder="Full name"
                      />
                    </Box>
                    <Box>
                      <CompactLabel>Mobile</CompactLabel>
                      <Input
                        {...compactInputProps}
                        value={party.mobileNo ?? ""}
                        onChange={(e) => {
                          updateParty(party.key, { mobileNo: e.target.value });
                          handlePartyMatch({
                            ...party,
                            mobileNo: e.target.value,
                          });
                        }}
                        placeholder="9800000000"
                      />
                    </Box>
                    <Box>
                      <CompactLabel>Email</CompactLabel>
                      <Input
                        {...compactInputProps}
                        value={party.email ?? ""}
                        onChange={(e) => {
                          updateParty(party.key, { email: e.target.value });
                          handlePartyMatch({
                            ...party,
                            email: e.target.value,
                          });
                        }}
                        placeholder="name@mail.com"
                      />
                    </Box>
                    <Box>
                      <CompactLabel>Role *</CompactLabel>
                      <FieldSelect
                        size="sm"
                        value={party.roleType}
                        onChange={(value) =>
                          updateParty(party.key, {
                            roleType: value as PartyType,
                          })
                        }
                      >
                        {(
                          [
                            "PLAINTIFF",
                            "DEFENDANT",
                            "ACCUSED",
                            "APPELLANT",
                            "RESPONDENT",
                            "APPLICANT",
                          ] as PartyType[]
                        ).map((type) => (
                          <option key={type} value={type}>
                            {partyTypeLabel(type)}
                          </option>
                        ))}
                      </FieldSelect>
                    </Box>
                    <Box>
                      <CompactLabel>Representation *</CompactLabel>
                      <FieldSelect
                        size="sm"
                        value={party.representation}
                        onChange={(value) =>
                          updateParty(party.key, {
                            representation: value as PartyRepresentation,
                          })
                        }
                      >
                        {(
                          [
                            "REPRESENTED",
                            "OPPOSING",
                            "SELF",
                          ] as PartyRepresentation[]
                        ).map((rep) => (
                          <option key={rep} value={rep}>
                            {representationLabel(rep)}
                          </option>
                        ))}
                      </FieldSelect>
                    </Box>
                    <Box>
                      <CompactLabel>Our client</CompactLabel>
                      <FieldSelect
                        size="sm"
                        value={party.isOurClient ? "yes" : "no"}
                        onChange={(value) =>
                          updateParty(party.key, {
                            isOurClient: value === "yes",
                          })
                        }
                      >
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </FieldSelect>
                    </Box>
                  </Grid>

                  <Box mt={3}>
                    <PartyMatchSuggestions
                      matches={matchesByParty[party.key] ?? []}
                      onSelectMatch={(match) => selectMatch(party.key, match)}
                      onDismiss={() =>
                        setMatchesByParty((prev) => ({
                          ...prev,
                          [party.key]: [],
                        }))
                      }
                    />
                  </Box>
                </Box>
              ))}
            </VStack>
          )}
        </FormSection>
      )}

      {/* Step 4 - Review */}
      {currentStep === 3 && (
        <FormSection
          title="Review & Save"
          description="Confirm the details below before creating this matter."
          icon={FileText}
        >
          <VStack gap={4} align="stretch">
            <Box
              p={{ base: 4, md: 5 }}
              bg="gray.50"
              borderRadius="xl"
              border="1px solid"
              borderColor="gray.100"
            >
              <HStack gap={2.5} mb={3}>
                <Center
                  w="7"
                  h="7"
                  borderRadius="lg"
                  bg="primary.50"
                  color="primary.500"
                >
                  <FileText size={15} />
                </Center>
                <Text fontSize="13px" fontWeight="700" color="gray.800">
                  Matter
                </Text>
              </HStack>
              <Text fontSize="14px" fontWeight="600" color="gray.900">
                {matterTypeLabel(matterType)} · {title}
              </Text>
              {description && (
                <Text
                  fontSize="13px"
                  color="gray.600"
                  mt={1.5}
                  lineHeight="1.6"
                >
                  {description}
                </Text>
              )}
              {(assignedPartnerId || advocateId) && (
                <HStack gap={4} mt={3} flexWrap="wrap">
                  {assignedPartnerId && (
                    <Text fontSize="12px" color="gray.500">
                      Partner assigned
                    </Text>
                  )}
                  {advocateId && (
                    <Text fontSize="12px" color="gray.500">
                      Advocate assigned
                    </Text>
                  )}
                </HStack>
              )}
            </Box>

            <Box
              p={{ base: 4, md: 5 }}
              bg="gray.50"
              borderRadius="xl"
              border="1px solid"
              borderColor="gray.100"
            >
              <HStack gap={2.5} mb={3}>
                <Center
                  w="7"
                  h="7"
                  borderRadius="lg"
                  bg="primary.50"
                  color="primary.500"
                >
                  <Scale size={15} />
                </Center>
                <Text fontSize="13px" fontWeight="700" color="gray.800">
                  Original Court Case
                </Text>
              </HStack>
              <Text fontSize="14px" fontWeight="600" color="gray.900">
                {courtName}
              </Text>
              <HStack gap={3} mt={1.5} flexWrap="wrap">
                <Text fontSize="13px" color="gray.600">
                  Case no. {courtCaseNumber}
                </Text>
                <Text fontSize="13px" color="gray.400">
                  ·
                </Text>
                <Text fontSize="13px" color="gray.600">
                  Filed {filingDate || "-"}
                </Text>
              </HStack>
            </Box>

            <Box
              p={{ base: 4, md: 5 }}
              bg="gray.50"
              borderRadius="xl"
              border="1px solid"
              borderColor="gray.100"
            >
              <HStack gap={2.5} mb={3}>
                <Center
                  w="7"
                  h="7"
                  borderRadius="lg"
                  bg="primary.50"
                  color="primary.500"
                >
                  <User size={15} />
                </Center>
                <Text fontSize="13px" fontWeight="700" color="gray.800">
                  Parties ({parties.length})
                </Text>
              </HStack>
              <VStack gap={0} align="stretch">
                {parties.map((party) => (
                  <HStack
                    key={party.key}
                    justify="space-between"
                    py={2}
                    gap={4}
                    borderBottom="1px solid"
                    borderColor="gray.200"
                    _last={{ borderBottom: "none", pb: 0 }}
                  >
                    <Text fontSize="13px" fontWeight="600" color="gray.900">
                      {party.fullName}
                    </Text>
                    <Text fontSize="12px" color="gray.500" textAlign="right">
                      {partyTypeLabel(party.roleType)} ·{" "}
                      {representationLabel(party.representation)}
                      {party.isOurClient ? " · Our client" : ""}
                    </Text>
                  </HStack>
                ))}
              </VStack>
            </Box>
          </VStack>
        </FormSection>
      )}

      <StickyActionBar
        onCancel={() => navigate("/cases")}
        onBack={
          currentStep > 0 ? () => setCurrentStep((prev) => prev - 1) : undefined
        }
        onNext={() => {
          if (currentStep === STEPS.length - 1) {
            handleCreate();
          } else {
            setCurrentStep((prev) => prev + 1);
          }
        }}
        isNextDisabled={!stepValidation[currentStep]}
        nextLabel={
          currentStep === STEPS.length - 1 ? "Create Matter" : "Next Step"
        }
      />

      <AddPartyModal
        isOpen={isAddPartyOpen}
        onClose={() => setIsAddPartyOpen(false)}
        isSubmitting={createMatterMutation.isPending}
        onSubmit={(data) => {
          setParties((prev) => [
            ...prev,
            {
              ...data,
              roleType: data.roleType,
              representation: data.representation,
              key: crypto.randomUUID(),
            },
          ]);
          setIsAddPartyOpen(false);
        }}
      />
    </Stack>
  );
};

export default CreateMatterPage;
