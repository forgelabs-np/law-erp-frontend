import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogCloseTrigger,
  DialogTitle,
} from "@/shared/components/ui/Dialog";
import { Checkbox } from "@/shared/components/ui";
import { useEffect, useMemo, useState } from "react";
import { Plus, X } from "lucide-react";

import { useGetEmployeesQuery } from "@/api/employeeManagement";

import {
  AddCourtCaseRequest,
  CourtLevel,
  MatterParty,
  PartyRepresentation,
  PartyType,
  RelationType,
} from "../types/matter.types";
import {
  partyTypeLabel,
  representationLabel,
  relationTypeLabel,
} from "../utils/matterHelpers";
import { FieldSelect } from "./ui";

interface AddCourtCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddCourtCaseRequest) => void;
  isSubmitting?: boolean;
  /** Court case this new case is filed against (parent). */
  parentCourtCaseId: string;
  /** Existing matter parties available for role assignment. */
  parties: MatterParty[];
}

interface SelectedRole {
  matterPartyId: string;
  roleType: PartyType;
  representation: PartyRepresentation;
}

interface InlinePartyRole {
  fullName: string;
  mobileNo?: string;
  email?: string;
  roleType: PartyType;
  representation: PartyRepresentation;
}

const RELATION_TYPES: RelationType[] = [
  "APPEAL",
  "CROSS_APPEAL",
  "REMAND",
  "REVISION",
  "WRIT",
  "REVIEW",
];

const COURT_LEVELS: CourtLevel[] = [
  "DISTRICT",
  "HIGH",
  "SUPREME",
  "SPECIALIZED",
];

const PARTY_TYPES: PartyType[] = [
  "PLAINTIFF",
  "DEFENDANT",
  "ACCUSED",
  "APPELLANT",
  "RESPONDENT",
  "APPLICANT",
];

const REPRESENTATIONS: PartyRepresentation[] = [
  "REPRESENTED",
  "OPPOSING",
  "SELF",
];

const relationToDefaultRole = (relation: RelationType): PartyType => {
  switch (relation) {
    case "APPEAL":
    case "CROSS_APPEAL":
      return "APPELLANT";
    case "WRIT":
      return "APPLICANT";
    default:
      return "APPLICANT";
  }
};

export const AddCourtCaseModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  parentCourtCaseId,
  parties,
}: AddCourtCaseModalProps) => {
  const { data: employeesData } = useGetEmployeesQuery();
  const employees = employeesData?.content ?? [];

  const [relationType, setRelationType] = useState<RelationType>("APPEAL");
  const [courtLevel, setCourtLevel] = useState<CourtLevel>("HIGH");
  const [courtName, setCourtName] = useState("");
  const [courtCaseNumber, setCourtCaseNumber] = useState("");
  const [filingDate, setFilingDate] = useState("");
  const [advocateId, setAdvocateId] = useState("");
  const [judgeName, setJudgeName] = useState("");
  const [partyIsState, setPartyIsState] = useState(false);

  const [selectedRoles, setSelectedRoles] = useState<SelectedRole[]>([]);
  const [inlineParties, setInlineParties] = useState<InlinePartyRole[]>([]);
  const [inlineDraft, setInlineDraft] = useState<InlinePartyRole>({
    fullName: "",
    roleType: "APPELLANT",
    representation: "REPRESENTED",
  });

  useEffect(() => {
    if (isOpen) {
      setRelationType("APPEAL");
      setCourtLevel("HIGH");
      setCourtName("");
      setCourtCaseNumber("");
      setFilingDate("");
      setAdvocateId("");
      setJudgeName("");
      setPartyIsState(false);
      setSelectedRoles([]);
      setInlineParties([]);
      setInlineDraft({
        fullName: "",
        roleType: "APPELLANT",
        representation: "REPRESENTED",
      });
    }
  }, [isOpen]);

  const defaultRole = useMemo(
    () => relationToDefaultRole(relationType),
    [relationType]
  );

  const toggleParty = (party: MatterParty, checked: boolean) => {
    setSelectedRoles((prev) =>
      checked
        ? [
            ...prev,
            {
              matterPartyId: party.id,
              roleType: defaultRole,
              representation: "REPRESENTED",
            },
          ]
        : prev.filter((role) => role.matterPartyId !== party.id)
    );
  };

  const updateRole = (partyId: string, patch: Partial<SelectedRole>) => {
    setSelectedRoles((prev) =>
      prev.map((role) =>
        role.matterPartyId === partyId ? { ...role, ...patch } : role
      )
    );
  };

  const addInlineParty = () => {
    if (!inlineDraft.fullName.trim()) return;
    setInlineParties((prev) => [...prev, inlineDraft]);
    setInlineDraft({
      fullName: "",
      roleType: defaultRole,
      representation: "REPRESENTED",
    });
  };

  const onFormSubmit = () => {
    if (!courtName.trim() || !courtCaseNumber.trim()) return;

    const roles: AddCourtCaseRequest["roles"] = [
      ...selectedRoles.map((role) => ({
        matterPartyId: role.matterPartyId,
        roleType: role.roleType,
        representation: role.representation,
      })),
      ...inlineParties.map((party) => ({
        fullName: party.fullName,
        mobileNo: party.mobileNo,
        email: party.email,
        roleType: party.roleType,
        representation: party.representation,
      })),
    ];

    onSubmit({
      relationType,
      courtLevel,
      courtName: courtName.trim(),
      courtCaseNumber: courtCaseNumber.trim(),
      filingDate: filingDate || undefined,
      advocateId: advocateId || undefined,
      judgeName: judgeName.trim() || undefined,
      parentCourtCaseId,
      partyIsState,
      roles,
    });
  };

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose()}
      placement="center"
    >
      <DialogContent maxW="720px" w="90vw">
        <DialogHeader>
          <DialogTitle>Add Court Case / Proceeding</DialogTitle>
          <DialogCloseTrigger />
        </DialogHeader>

        <DialogBody maxH="70vh" overflowY="auto">
          <VStack gap={4} align="stretch">
            <Flex gap={4} flexDirection={{ base: "column", md: "row" }}>
              <Box flex={1}>
                <Text mb={1} fontSize="sm" fontWeight="500">
                  Relation *
                </Text>
                <FieldSelect
                  value={relationType}
                  onChange={(value) => setRelationType(value as RelationType)}
                >
                  {RELATION_TYPES.map((relation) => (
                    <option key={relation} value={relation}>
                      {relationTypeLabel(relation)}
                    </option>
                  ))}
                </FieldSelect>
              </Box>
              <Box flex={1}>
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
            </Flex>

            <Flex gap={4} flexDirection={{ base: "column", md: "row" }}>
              <Box flex={1}>
                <Text mb={1} fontSize="sm" fontWeight="500">
                  Court Name *
                </Text>
                <Input
                  value={courtName}
                  onChange={(e) => setCourtName(e.target.value)}
                  placeholder="e.g. High Court, Patan"
                />
              </Box>
              <Box flex={1}>
                <Text mb={1} fontSize="sm" fontWeight="500">
                  Court Case Number *
                </Text>
                <Input
                  value={courtCaseNumber}
                  onChange={(e) => setCourtCaseNumber(e.target.value)}
                  placeholder="e.g. HC-555/083"
                />
              </Box>
            </Flex>

            <Flex gap={4} flexDirection={{ base: "column", md: "row" }}>
              <Box flex={1}>
                <Text mb={1} fontSize="sm" fontWeight="500">
                  Filing Date
                </Text>
                <Input
                  type="date"
                  value={filingDate}
                  onChange={(e) => setFilingDate(e.target.value)}
                />
              </Box>
              <Box flex={1}>
                <Text mb={1} fontSize="sm" fontWeight="500">
                  Assigned Advocate
                </Text>
                <FieldSelect
                  value={advocateId}
                  onChange={setAdvocateId}
                  placeholder="No advocate"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.fullName}
                    </option>
                  ))}
                </FieldSelect>
              </Box>
            </Flex>

            <Flex
              gap={4}
              flexDirection={{ base: "column", md: "row" }}
              align="flex-end"
            >
              <Box flex={1}>
                <Text mb={1} fontSize="sm" fontWeight="500">
                  Judge Name
                </Text>
                <Input
                  value={judgeName}
                  onChange={(e) => setJudgeName(e.target.value)}
                  placeholder="e.g. Justice A. Poudel"
                />
              </Box>
              <Checkbox
                checked={partyIsState}
                onCheckedChange={(e) => setPartyIsState(!!e.checked)}
                mb={2}
              >
                Party is the State
              </Checkbox>
            </Flex>

            {/* Roles */}
            <Box
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              p={4}
            >
              <Text fontSize="sm" fontWeight="600" mb={3}>
                Roles on the new case
              </Text>

              {parties.length === 0 && (
                <Text fontSize="sm" color="gray.500">
                  No parties yet — add parties to the matter first, or add a new
                  party below.
                </Text>
              )}

              <VStack gap={2} align="stretch">
                {parties.map((party) => {
                  const role = selectedRoles.find(
                    (r) => r.matterPartyId === party.id
                  );
                  return (
                    <HStack key={party.id} gap={3} flexWrap="wrap">
                      <Checkbox
                        checked={!!role}
                        onCheckedChange={(e) => toggleParty(party, !!e.checked)}
                      />
                      <Text
                        fontSize="sm"
                        fontWeight="500"
                        flex={1}
                        minW="160px"
                      >
                        {party.fullName}
                      </Text>
                      {role ? (
                        <>
                          <FieldSelect
                            size="sm"
                            w="150px"
                            value={role.roleType}
                            onChange={(value) =>
                              updateRole(party.id, {
                                roleType: value as PartyType,
                              })
                            }
                          >
                            {PARTY_TYPES.map((type) => (
                              <option key={type} value={type}>
                                {partyTypeLabel(type)}
                              </option>
                            ))}
                          </FieldSelect>
                          <FieldSelect
                            size="sm"
                            w="150px"
                            value={role.representation}
                            onChange={(value) =>
                              updateRole(party.id, {
                                representation: value as PartyRepresentation,
                              })
                            }
                          >
                            {REPRESENTATIONS.map((rep) => (
                              <option key={rep} value={rep}>
                                {representationLabel(rep)}
                              </option>
                            ))}
                          </FieldSelect>
                        </>
                      ) : (
                        <Text fontSize="xs" color="gray.400" w="300px">
                          Not included
                        </Text>
                      )}
                    </HStack>
                  );
                })}
              </VStack>

              {/* Inline new parties */}
              {inlineParties.map((party, index) => (
                <HStack key={index} gap={2} mt={2} flexWrap="wrap">
                  <Text fontSize="sm" fontWeight="500" flex={1} minW="160px">
                    {party.fullName} (new)
                  </Text>
                  <Text fontSize="xs" color="gray.500" w="180px">
                    {partyTypeLabel(party.roleType)} ·{" "}
                    {representationLabel(party.representation)}
                  </Text>
                  <Button
                    size="xs"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() =>
                      setInlineParties((prev) =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
                  >
                    <X size={14} />
                  </Button>
                </HStack>
              ))}

              <Box borderTop="1px dashed" borderColor="gray.200" mt={3} pt={3}>
                <Text fontSize="xs" fontWeight="600" color="gray.500" mb={2}>
                  Add new party
                </Text>
                <VStack gap={2} align="stretch">
                  <Flex gap={2} flexDirection={{ base: "column", md: "row" }}>
                    <Input
                      size="sm"
                      placeholder="Full name"
                      value={inlineDraft.fullName}
                      onChange={(e) =>
                        setInlineDraft((prev) => ({
                          ...prev,
                          fullName: e.target.value,
                        }))
                      }
                      flex={2}
                    />
                    <Input
                      size="sm"
                      placeholder="Mobile"
                      value={inlineDraft.mobileNo ?? ""}
                      onChange={(e) =>
                        setInlineDraft((prev) => ({
                          ...prev,
                          mobileNo: e.target.value,
                        }))
                      }
                      flex={1}
                    />
                    <Input
                      size="sm"
                      placeholder="Email"
                      value={inlineDraft.email ?? ""}
                      onChange={(e) =>
                        setInlineDraft((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      flex={1}
                    />
                  </Flex>
                  <Flex gap={2} align="center" flexWrap="wrap">
                    <FieldSelect
                      size="sm"
                      w="150px"
                      value={inlineDraft.roleType}
                      onChange={(value) =>
                        setInlineDraft((prev) => ({
                          ...prev,
                          roleType: value as PartyType,
                        }))
                      }
                    >
                      {PARTY_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {partyTypeLabel(type)}
                        </option>
                      ))}
                    </FieldSelect>
                    <FieldSelect
                      size="sm"
                      w="150px"
                      value={inlineDraft.representation}
                      onChange={(value) =>
                        setInlineDraft((prev) => ({
                          ...prev,
                          representation: value as PartyRepresentation,
                        }))
                      }
                    >
                      {REPRESENTATIONS.map((rep) => (
                        <option key={rep} value={rep}>
                          {representationLabel(rep)}
                        </option>
                      ))}
                    </FieldSelect>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={addInlineParty}
                    >
                      <Plus size={14} /> Add
                    </Button>
                  </Flex>
                </VStack>
              </Box>
            </Box>
          </VStack>
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onFormSubmit} loading={isSubmitting}>
            Add Court Case
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};
