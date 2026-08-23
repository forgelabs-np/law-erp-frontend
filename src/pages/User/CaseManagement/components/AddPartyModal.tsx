import {
  Box,
  Button,
  Input,
  Flex,
  Text,
  VStack,
  Spinner,
  HStack,
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
import { Switch } from "@/shared/components/ui";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import { useGetClientsQuery } from "@/api/clientManagement";

import {
  PartyEntryRequest,
  PartyMatch,
  PartyRepresentation,
  PartyType,
} from "../types/matter.types";
import { PartyMatchSuggestions } from "./PartyMatchSuggestions";
import { useMatchMatterPartyMutation } from "../api/matterParty.api";

interface AddPartyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PartyEntryRequest) => void;
  isSubmitting?: boolean;
  defaultRepresentation?: PartyRepresentation;
}

interface PartyFormValues {
  fullName: string;
  mobileNo: string;
  email: string;
  roleType: PartyType;
  representation: PartyRepresentation;
  isOurClient: boolean;
  clientId: string;
}

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

export const AddPartyModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  defaultRepresentation = "REPRESENTED",
}: AddPartyModalProps) => {
  const { control, handleSubmit, reset, watch } = useForm<PartyFormValues>({
    defaultValues: {
      fullName: "",
      mobileNo: "",
      email: "",
      roleType: "PLAINTIFF",
      representation: defaultRepresentation,
      isOurClient: true,
      clientId: "",
    },
  });

  const [matches, setMatches] = useState<PartyMatch[]>([]);
  const [matchLoading, setMatchLoading] = useState(false);

  const matchPartyMutation = useMatchMatterPartyMutation();
  const { data: clientsData, isLoading: clientsLoading } = useGetClientsQuery();

  const fullName = watch("fullName");
  const mobileNo = watch("mobileNo");
  const email = watch("email");

  useEffect(() => {
    if (isOpen) {
      reset({
        fullName: "",
        mobileNo: "",
        email: "",
        roleType: "PLAINTIFF",
        representation: defaultRepresentation,
        isOurClient: true,
        clientId: "",
      });
      setMatches([]);
    }
  }, [isOpen, reset, defaultRepresentation]);

  // Debounced party matching to avoid duplicate party/client creation.
  useEffect(() => {
    if (!isOpen) return;
    const name = fullName.trim();
    const phone = mobileNo.trim();
    const mail = email.trim();
    if (!name && !phone && !mail) {
      setMatches([]);
      return;
    }

    const timer = setTimeout(() => {
      setMatchLoading(true);
      matchPartyMutation.mutate(
        {
          fullName: name,
          mobileNo: phone || undefined,
          email: mail || undefined,
        },
        {
          onSuccess: (response) => setMatches(response?.data?.data ?? []),
          onSettled: () => setMatchLoading(false),
        }
      );
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullName, mobileNo, email, isOpen]);

  const onFormSubmit = (values: PartyFormValues) => {
    if (!values.fullName.trim()) return;
    onSubmit({
      fullName: values.fullName.trim(),
      mobileNo: values.mobileNo.trim() || undefined,
      email: values.email.trim() || undefined,
      clientId: values.clientId || undefined,
      isOurClient: values.isOurClient,
      roleType: values.roleType,
      representation: values.representation,
    });
  };

  const selectMatch = (match: PartyMatch) => {
    reset({
      fullName: match.fullName,
      mobileNo: match.mobileNo ?? "",
      email: match.email ?? "",
      clientId: match.sourceType === "CLIENT" ? match.sourceId : "",
      isOurClient: match.sourceType === "CLIENT",
      roleType: watch("roleType"),
      representation: watch("representation"),
    });
    setMatches([]);
  };

  const clients = clientsData?.content ?? [];

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose()}
      placement="center"
    >
      <DialogContent maxW="640px" w="90vw">
        <DialogHeader>
          <DialogTitle>Add Party</DialogTitle>
          <DialogCloseTrigger />
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)}>
          <DialogBody>
            <VStack gap={4} align="stretch">
              <Flex gap={4} flexDirection={{ base: "column", md: "row" }}>
                <Box flex={1}>
                  <Text mb={1} fontSize="sm" fontWeight="500">
                    Full Name *
                  </Text>
                  <Controller
                    name="fullName"
                    control={control}
                    rules={{ required: "Full name is required" }}
                    render={({ field }) => (
                      <Input {...field} placeholder="Enter full name" />
                    )}
                  />
                </Box>
                <Box flex={1}>
                  <Text mb={1} fontSize="sm" fontWeight="500">
                    Mobile Number
                  </Text>
                  <Controller
                    name="mobileNo"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="9800000000" />
                    )}
                  />
                </Box>
              </Flex>

              <Box>
                <Text mb={1} fontSize="sm" fontWeight="500">
                  Email
                </Text>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="email"
                      placeholder="name@mail.com"
                    />
                  )}
                />
              </Box>

              {matchLoading && (
                <HStack gap={2} color="gray.500">
                  <Spinner size="xs" />
                  <Text fontSize="sm">
                    Searching existing clients and parties...
                  </Text>
                </HStack>
              )}

              <PartyMatchSuggestions
                matches={matches}
                onSelectMatch={selectMatch}
                onDismiss={() => setMatches([])}
              />

              <Flex gap={4} flexDirection={{ base: "column", md: "row" }}>
                <Box flex={1}>
                  <Text mb={1} fontSize="sm" fontWeight="500">
                    Role *
                  </Text>
                  <Controller
                    name="roleType"
                    control={control}
                    rules={{ required: "Role is required" }}
                    render={({ field }) => (
                      <Box
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="md"
                        p={2}
                      >
                        <select
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          style={{
                            width: "100%",
                            background: "transparent",
                            outline: "none",
                            cursor: "pointer",
                            fontSize: "14px",
                          }}
                        >
                          {PARTY_TYPES.map((type) => (
                            <option key={type} value={type}>
                              {type
                                .replace(/_/g, " ")
                                .toLowerCase()
                                .replace(/\b\w/g, (c) => c.toUpperCase())}
                            </option>
                          ))}
                        </select>
                      </Box>
                    )}
                  />
                </Box>
                <Box flex={1}>
                  <Text mb={1} fontSize="sm" fontWeight="500">
                    Representation *
                  </Text>
                  <Controller
                    name="representation"
                    control={control}
                    rules={{ required: "Representation is required" }}
                    render={({ field }) => (
                      <Box
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="md"
                        p={2}
                      >
                        <select
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          style={{
                            width: "100%",
                            background: "transparent",
                            outline: "none",
                            cursor: "pointer",
                            fontSize: "14px",
                          }}
                        >
                          {REPRESENTATIONS.map((rep) => (
                            <option key={rep} value={rep}>
                              {rep
                                .toLowerCase()
                                .replace(/\b\w/g, (c) => c.toUpperCase())}
                            </option>
                          ))}
                        </select>
                      </Box>
                    )}
                  />
                </Box>
              </Flex>

              <Box>
                <Text mb={1} fontSize="sm" fontWeight="500">
                  Link to client
                </Text>
                {clientsLoading ? (
                  <Spinner size="xs" color="blue.500" />
                ) : (
                  <Controller
                    name="clientId"
                    control={control}
                    render={({ field }) => (
                      <Box
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="md"
                        p={2}
                      >
                        <select
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          style={{
                            width: "100%",
                            background: "transparent",
                            outline: "none",
                            cursor: "pointer",
                            fontSize: "14px",
                          }}
                        >
                          <option value="">No client linked</option>
                          {clients.map((client) => (
                            <option key={client.id} value={client.id}>
                              {client.fullName} ({client.mobileNo})
                            </option>
                          ))}
                        </select>
                      </Box>
                    )}
                  />
                )}
              </Box>

              <Controller
                name="isOurClient"
                control={control}
                render={({ field }) => (
                  <HStack justify="space-between">
                    <Text fontSize="sm" fontWeight="500">
                      Our client
                    </Text>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(e) => field.onChange(!!e.checked)}
                    />
                  </HStack>
                )}
              />
            </VStack>
          </DialogBody>

          <DialogFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Add Party
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  );
};
