import {
  Box,
  Button,
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

import { useGetEmployeesQuery } from "@/api/employeeManagement";

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
  FormSection,
  FormTextarea,
  PageHeader,
  Stepper,
  StickyActionBar,
} from "../components/wizard";
import { CaseTypeSelector } from "../components/wizard/CaseTypeSelector";
import { FieldSelect } from "../components/ui";
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
  const [courtName, setCourtName] = useState("");
  const [courtCaseNumber, setCourtCaseNumber] = useState("");
  const [filingDate, setFilingDate] = useState("");

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
    if (!party.fullName.trim() && !party.mobileNo?.trim()) {
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
          email: party.email?.trim() || undefined,
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
    <Stack gap={0} padding={8} maxW="1000px" mx="auto">
      <PageHeader
        title="Create Matter"
        subtitle="Create a matter with its original court case and initial parties"
        breadcrumb={["Cases", "Create Matter"]}
      />

      <Stepper steps={STEPS} currentStep={currentStep} />

      {/* Step 1 - Basic Information */}
      {currentStep === 0 && (
        <FormSection title="Basic Information" icon={FileText}>
          <Text fontSize="sm" color="gray.600" mb={4}>
            What kind of matter is this and who is handling it?
          </Text>
          <CaseTypeSelector
            value={matterType}
            onChange={(type) => {
              setMatterType(type);
              setParties((prev) =>
                prev.map((p) => ({ ...p, roleType: defaultRoleForType(type) }))
              );
            }}
          />
          <VStack gap={4} align="stretch" mt={6}>
            <Box>
              <Text mb={1} fontSize="sm" fontWeight="500">
                Title *
              </Text>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Ram vs Shyam — land boundary dispute"
              />
            </Box>

            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
              <Box>
                <Text mb={1} fontSize="sm" fontWeight="500">
                  Assigned Partner
                </Text>
                <FieldSelect
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
                <Text mb={1} fontSize="sm" fontWeight="500">
                  Assigned Advocate
                </Text>
                <FieldSelect
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

            <FormTextarea
              label="Description"
              value={description}
              onChange={setDescription}
              placeholder="Brief description of the matter"
              rows={3}
            />
          </VStack>
        </FormSection>
      )}

      {/* Step 2 - Original Court Case */}
      {currentStep === 1 && (
        <FormSection title="Original Court Case" icon={Scale}>
          <Text fontSize="sm" color="gray.600" mb={4}>
            The original court case is created together with the matter.
          </Text>
          <VStack gap={4} align="stretch">
            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
              <Box>
                <Text mb={1} fontSize="sm" fontWeight="500">
                  Court Level *
                </Text>
                <FieldSelect
                  value={courtLevel}
                  onChange={(value) => setCourtLevel(value as CourtLevel)}
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
                <Text mb={1} fontSize="sm" fontWeight="500">
                  Court Name *
                </Text>
                <Input
                  value={courtName}
                  onChange={(e) => setCourtName(e.target.value)}
                  placeholder="e.g. Kathmandu District Court"
                />
              </Box>
            </Grid>

            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
              <Box>
                <Text mb={1} fontSize="sm" fontWeight="500">
                  Court Case Number *
                </Text>
                <Input
                  value={courtCaseNumber}
                  onChange={(e) => setCourtCaseNumber(e.target.value)}
                  placeholder="e.g. C-123/082"
                />
              </Box>
              <Box>
                <Text mb={1} fontSize="sm" fontWeight="500">
                  Filing Date
                </Text>
                <Input
                  type="date"
                  value={filingDate}
                  onChange={(e) => setFilingDate(e.target.value)}
                />
              </Box>
            </Grid>
          </VStack>
        </FormSection>
      )}

      {/* Step 3 - Parties */}
      {currentStep === 2 && (
        <FormSection title="Parties" icon={User}>
          <HStack justify="space-between" mb={4}>
            <Text fontSize="sm" color="gray.600">
              Add the parties of the original court case. Matching clients and
              parties are suggested to avoid duplicates.
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
            <Box
              py={10}
              textAlign="center"
              border="1px dashed"
              borderColor="gray.300"
              borderRadius="lg"
            >
              <Text fontSize="sm" color="gray.500">
                No parties added yet
              </Text>
              <Button
                mt={4}
                variant="outline"
                size="sm"
                onClick={() => setIsAddPartyOpen(true)}
              >
                + Add First Party
              </Button>
            </Box>
          ) : (
            <VStack gap={3} align="stretch">
              {parties.map((party) => (
                <Box
                  key={party.key}
                  p={4}
                  bg="white"
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="lg"
                >
                  <HStack justify="space-between" mb={3}>
                    <HStack gap={2}>
                      {matterType === "CIVIL" ? (
                        <Scale size={16} color="#2563eb" />
                      ) : (
                        <Gavel size={16} color="#dc2626" />
                      )}
                      <Text fontSize="sm" fontWeight="600" color="gray.900">
                        {party.fullName || "New party"}
                      </Text>
                    </HStack>
                    <Button
                      variant="ghost"
                      size="xs"
                      colorScheme="red"
                      onClick={() =>
                        setParties((prev) =>
                          prev.filter((p) => p.key !== party.key)
                        )
                      }
                    >
                      <X size={14} />
                    </Button>
                  </HStack>

                  <Grid
                    templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
                    gap={3}
                  >
                    <Box>
                      <Text mb={1} fontSize="xs" color="gray.600">
                        Full Name *
                      </Text>
                      <Input
                        size="sm"
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
                      <Text mb={1} fontSize="xs" color="gray.600">
                        Mobile
                      </Text>
                      <Input
                        size="sm"
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
                      <Text mb={1} fontSize="xs" color="gray.600">
                        Email
                      </Text>
                      <Input
                        size="sm"
                        value={party.email ?? ""}
                        onChange={(e) =>
                          updateParty(party.key, { email: e.target.value })
                        }
                        placeholder="name@mail.com"
                      />
                    </Box>
                    <Box>
                      <Text mb={1} fontSize="xs" color="gray.600">
                        Role *
                      </Text>
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
                      <Text mb={1} fontSize="xs" color="gray.600">
                        Representation *
                      </Text>
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
                      <Text mb={1} fontSize="xs" color="gray.600">
                        Our client
                      </Text>
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

                  <Box mt={2}>
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
        <FormSection title="Review & Save" icon={FileText}>
          <VStack gap={4} align="stretch">
            <Box
              p={4}
              bg="gray.50"
              borderRadius="lg"
              border="1px solid"
              borderColor="gray.100"
            >
              <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                Matter
              </Text>
              <Text fontSize="sm">
                {matterTypeLabel(matterType)} · {title}
              </Text>
              {description && (
                <Text fontSize="sm" color="gray.600" mt={1}>
                  {description}
                </Text>
              )}
              {assignedPartnerId && (
                <Text fontSize="sm" color="gray.600" mt={1}>
                  Partner assigned
                </Text>
              )}
              {advocateId && (
                <Text fontSize="sm" color="gray.600" mt={1}>
                  Advocate assigned
                </Text>
              )}
            </Box>

            <Box
              p={4}
              bg="gray.50"
              borderRadius="lg"
              border="1px solid"
              borderColor="gray.100"
            >
              <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                Original Court Case
              </Text>
              <Text fontSize="sm">
                {courtName} · {courtCaseNumber} · Filed {filingDate || "-"}
              </Text>
            </Box>

            <Box
              p={4}
              bg="gray.50"
              borderRadius="lg"
              border="1px solid"
              borderColor="gray.100"
            >
              <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                Parties ({parties.length})
              </Text>
              {parties.map((party) => (
                <HStack key={party.key} justify="space-between" py={1}>
                  <Text fontSize="sm">{party.fullName}</Text>
                  <Text fontSize="xs" color="gray.600">
                    {partyTypeLabel(party.roleType)} ·{" "}
                    {representationLabel(party.representation)}
                    {party.isOurClient ? " · Our client" : ""}
                  </Text>
                </HStack>
              ))}
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
