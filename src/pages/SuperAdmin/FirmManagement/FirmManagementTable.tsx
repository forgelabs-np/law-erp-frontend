import {
  Button,
  HStack,
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
  Portal,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, History, ScrollText, Settings, Shield } from "lucide-react";

import {
  FirmResponse,
  useGetFirmsQuery,
  useToggleFirmMutation,
  useSuspendFirmMutation,
  useActivateFirmMutation,
  useConvertToPermanentMutation,
} from "@/api/firmManagement";
import { AddIcon } from "@/assets/svgs";
import { Datatable } from "@/shared/components";
import { ConfirmationDialog } from "@/shared/components/dialog/conformationDialog";
import { Switch, Tooltip } from "@/shared/components/ui";
import { ROUTES_CONFIG } from "@/shared/config";
import { useModulePermissions } from "@/shared/hooks/usePermissions";

import { ExtendTrialModal } from "./ExtendTrialModal";
import { getFirmLifecycleActions, getFirmStatusBadge } from "./lifecycleUtils";
import { FirmOnboardingModal } from "./onboarding";
import { AddEditFirm } from "./AddEditFirm";

const FirmManagement = () => {
  const navigate = useNavigate();
  const { canCreate, canEdit } = useModulePermissions("FIRM_MANAGEMENT");
  const { canAccess: canAccessAudit } = useModulePermissions("AUDIT");
  const [firmToToggle, setFirmToToggle] = useState<{
    id: string;
    active: boolean;
  } | null>(null);
  const [firmToSuspend, setFirmToSuspend] = useState<FirmResponse | null>(null);
  const [firmToActivate, setFirmToActivate] = useState<FirmResponse | null>(
    null
  );
  const [firmToConvert, setFirmToConvert] = useState<FirmResponse | null>(null);
  const [firmToExtendTrial, setFirmToExtendTrial] =
    useState<FirmResponse | null>(null);
  const [selectedId, setSelectedId] = useState<string>();

  // Onboarding modal
  const {
    open: onboardingOpen,
    onOpen: onOnboardingOpen,
    onClose: onOnboardingClose,
  } = useDisclosure();

  const {
    open: editOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const {
    open: toggleConfirmOpen,
    onOpen: onToggleConfirmOpen,
    onClose: onToggleConfirmClose,
  } = useDisclosure();

  const {
    open: suspendConfirmOpen,
    onOpen: onSuspendConfirmOpen,
    onClose: onSuspendConfirmClose,
  } = useDisclosure();

  const {
    open: activateConfirmOpen,
    onOpen: onActivateConfirmOpen,
    onClose: onActivateConfirmClose,
  } = useDisclosure();

  const {
    open: convertConfirmOpen,
    onOpen: onConvertConfirmOpen,
    onClose: onConvertConfirmClose,
  } = useDisclosure();

  const {
    open: extendTrialOpen,
    onOpen: onExtendTrialOpen,
    onClose: onExtendTrialClose,
  } = useDisclosure();

  const { data: firmsData, isLoading } = useGetFirmsQuery();
  const { mutate: toggleFirm, isPending: isTogglePending } =
    useToggleFirmMutation();
  const { mutate: suspendFirm, isPending: isSuspendPending } =
    useSuspendFirmMutation();
  const { mutate: activateFirm, isPending: isActivatePending } =
    useActivateFirmMutation();
  const { mutate: convertToPermanent, isPending: isConvertPending } =
    useConvertToPermanentMutation();

  const handleEditFirm = useCallback(
    (firm: FirmResponse) => {
      setSelectedId(String(firm.firmId));
      onEditOpen();
    },
    [onEditOpen]
  );

  const handleAuditLog = useCallback(
    (firmId: string) => {
      navigate(
        ROUTES_CONFIG.SUPER_ADMIN.FIRM_AUDIT_LOGS.replace(":firmId", firmId),
        { state: { firm: firmsData?.data?.find((f) => f.firmId === firmId) } }
      );
    },
    [navigate, firmsData]
  );

  const handleManageAccess = useCallback(
    (firmId: string) => {
      navigate(
        ROUTES_CONFIG.SUPER_ADMIN.FIRM_ACCESS_MANAGEMENT.replace(
          ":firmId",
          firmId
        )
      );
    },
    [navigate]
  );

  const columns: Array<ColumnDef<FirmResponse>> = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "S.N.",
        cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: "firmName",
        header: "Firm Name",
      },
      {
        accessorKey: "firmCode",
        header: "Firm Code",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "mobileNo",
        header: "Phone",
      },
      {
        accessorKey: "fullName",
        header: "Admin",
      },
      {
        accessorKey: "firmStatus",
        header: "Status",
        cell: ({ row }) => {
          const statusBadge = getFirmStatusBadge(row.original.firmStatus);
          const isSuspended = row.original.firmStatus === "SUSPENDED";

          return (
            <HStack gap={2}>
              <Switch
                checked={row.original.isActive ?? true}
                disabled={isSuspended}
                onCheckedChange={() => {
                  if (isSuspended) {
                    setFirmToActivate(row.original);
                    onActivateConfirmOpen();
                  } else {
                    setFirmToToggle({
                      id: String(row.original.id),
                      active: row.original.isActive ?? true,
                    });
                    onToggleConfirmOpen();
                  }
                }}
              />
              <Text
                fontSize="xs"
                color={`${statusBadge.color}.500`}
                fontWeight="medium"
              >
                {statusBadge.label}
              </Text>
            </HStack>
          );
        },
      },
      {
        accessorKey: "action",
        header: "Actions",
        cell: ({ row }) => {
          const lifecycle = getFirmLifecycleActions(row.original);
          const firmId = String(row.original.firmId);
          const hasLifecycleActions =
            lifecycle.canSuspend ||
            lifecycle.canActivate ||
            lifecycle.canExtendTrial ||
            lifecycle.canConvertToPermanent;

          return (
            <HStack gap={1}>
              <Tooltip content="Manage Access">
                <Button
                  variant="outline"
                  size="sm"
                  aria-label="Manage Access"
                  onClick={() => handleManageAccess(firmId)}
                >
                  Manage Access
                </Button>
              </Tooltip>

              <MenuRoot positioning={{ placement: "right-start" }}>
                <MenuTrigger asChild>
                  <Button size="sm" variant="ghost" aria-label="Settings">
                    <Settings size={18} />
                  </Button>
                </MenuTrigger>
                <Portal>
                  <MenuPositioner>
                    <MenuContent>
                      {canEdit && (
                        <MenuItem
                          cursor="pointer"
                          value="edit"
                          onClick={() => handleEditFirm(row.original)}
                        >
                          <HStack gap={2}>
                            <Edit size={16} />
                            <Text>Edit</Text>
                          </HStack>
                        </MenuItem>
                      )}

                      {canAccessAudit && (
                        <MenuItem
                          cursor="pointer"
                          value="audit-log"
                          onClick={() => handleAuditLog(firmId)}
                        >
                          <HStack gap={2}>
                            <ScrollText size={16} />
                            <Text>Audit Log</Text>
                          </HStack>
                        </MenuItem>
                      )}

                      {hasLifecycleActions && (
                        <MenuItem
                          cursor="pointer"
                          value="lifecycle"
                          onClick={() => {
                            if (lifecycle.canExtendTrial) {
                              setFirmToExtendTrial(row.original);
                              onExtendTrialOpen();
                            } else if (lifecycle.canConvertToPermanent) {
                              setFirmToConvert(row.original);
                              onConvertConfirmOpen();
                            } else if (lifecycle.canSuspend) {
                              setFirmToSuspend(row.original);
                              onSuspendConfirmOpen();
                            } else if (lifecycle.canActivate) {
                              setFirmToActivate(row.original);
                              onActivateConfirmOpen();
                            }
                          }}
                        >
                          <HStack gap={2}>
                            <History size={16} />
                            <Text>
                              {lifecycle.canExtendTrial
                                ? "Extend Trial"
                                : lifecycle.canConvertToPermanent
                                  ? "Convert to Permanent"
                                  : lifecycle.canSuspend
                                    ? "Suspend"
                                    : "Activate"}
                            </Text>
                          </HStack>
                        </MenuItem>
                      )}
                    </MenuContent>
                  </MenuPositioner>
                </Portal>
              </MenuRoot>
            </HStack>
          );
        },
      },
    ],
    [
      canAccessAudit,
      canEdit,
      onSuspendConfirmOpen,
      onActivateConfirmOpen,
      onConvertConfirmOpen,
      onExtendTrialOpen,
      onToggleConfirmOpen,
      handleAuditLog,
      handleEditFirm,
      handleManageAccess,
    ]
  );

  return (
    <>
      <Stack gap={6} padding={2} w="100%" maxW="100%" minW={0}>
        <HStack justifyContent="space-between" alignItems="center">
          <Stack gap={2}>
            <Text textStyle="heading_4">Firm Management</Text>
            <Text textStyle="paragraph_regular" color="gray.500">
              Manage law firms and their admin accounts
            </Text>
          </Stack>

          {canCreate && (
            <Button variant="primary" onClick={onOnboardingOpen}>
              <AddIcon color="white" />
              Add Firm
            </Button>
          )}
        </HStack>

        <Datatable
          isLoading={isLoading}
          columns={columns}
          data={firmsData?.data ?? []}
        />

        {/* Firm Onboarding Modal */}

        <ConfirmationDialog
          open={toggleConfirmOpen}
          onClose={() => {
            onToggleConfirmClose();
            setFirmToToggle(null);
          }}
          title={firmToToggle?.active ? "Deactivate firm?" : "Activate firm?"}
          action={
            firmToToggle?.active ? "deactivate this firm" : "activate this firm"
          }
          handleSubmit={() => {
            if (firmToToggle) {
              toggleFirm(firmToToggle.id);
              onToggleConfirmClose();
              setFirmToToggle(null);
            }
          }}
          submitActionPending={isTogglePending}
        />

        <AddEditFirm
          open={editOpen}
          onClose={() => {
            onEditClose();
            setSelectedId(undefined);
          }}
          id={selectedId}
          setId={setSelectedId}
        />

        {/* Suspend Firm Confirmation */}
        <ConfirmationDialog
          open={suspendConfirmOpen}
          onClose={() => {
            onSuspendConfirmClose();
            setFirmToSuspend(null);
          }}
          title="Suspend Firm?"
          action="suspend this firm"
          handleSubmit={() => {
            if (firmToSuspend) {
              suspendFirm(String(firmToSuspend.firmId));
              onSuspendConfirmClose();
              setFirmToSuspend(null);
            }
          }}
          submitActionPending={isSuspendPending}
        />

        {/* Activate Firm Confirmation */}
        <ConfirmationDialog
          open={activateConfirmOpen}
          onClose={() => {
            onActivateConfirmClose();
            setFirmToActivate(null);
          }}
          title="Activate Firm?"
          action="activate this firm"
          handleSubmit={() => {
            if (firmToActivate) {
              activateFirm(String(firmToActivate.firmId));
              onActivateConfirmClose();
              setFirmToActivate(null);
            }
          }}
          submitActionPending={isActivatePending}
        />

        {/* Convert to Permanent Confirmation */}
        <ConfirmationDialog
          open={convertConfirmOpen}
          onClose={() => {
            onConvertConfirmClose();
            setFirmToConvert(null);
          }}
          title="Convert to Permanent?"
          action="convert this trial firm to permanent"
          handleSubmit={() => {
            if (firmToConvert) {
              convertToPermanent(String(firmToConvert.firmId));
              onConvertConfirmClose();
              setFirmToConvert(null);
            }
          }}
          submitActionPending={isConvertPending}
        />

        {/* Extend Trial Modal */}
        <ExtendTrialModal
          open={extendTrialOpen}
          onClose={() => {
            onExtendTrialClose();
            setFirmToExtendTrial(null);
          }}
          firm={firmToExtendTrial}
        />
      </Stack>
      <FirmOnboardingModal open={onboardingOpen} onClose={onOnboardingClose} />
    </>
  );
};

export default FirmManagement;
