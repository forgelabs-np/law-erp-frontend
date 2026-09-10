import { Button, HStack, Stack, Text } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, FileSearch } from "lucide-react";

import { PermissionAssignment } from "@/components/PermissionAssignment";
import {
  isTerminalSyncStatus,
  TemplatePermissionPreview,
  TemplateSyncJob,
  usePreviewTemplatePermissionsMutation,
  useTemplatePermissionsQuery,
  useTemplateSyncJobQuery,
  useUpdateTemplatePermissionsMutation,
} from "@/api/roleTemplate";
import CustomDrawer from "@/shared/components/drawer/CustomerDrawer";
import { api } from "@/shared/service/service-api";
import { errorNotification } from "@/shared/utils/notification";

import { TemplatePermissionPreviewView } from "./TemplatePermissionPreview";
import { TemplateSyncJobStatus } from "./TemplateSyncJobStatus";

type DrawerStep = "edit" | "preview" | "syncing";

/** Initial job shape shown until the first poll resolves. */
const pendingJob = (
  jobId: string,
  templateId: string,
  templateCode: string
): TemplateSyncJob => ({
  jobId,
  templateId,
  templateCode,
  status: "PENDING",
  firmsTotal: 0,
  firmsCompleted: 0,
  firmsFailed: 0,
  errorSummary: "",
  startedAt: "",
  completedAt: null,
});

/**
 * View + edit flow for one system role template.
 *
 * Mandatory flow (backend-enforced architecture):
 *   Edit → Preview (impact) → Confirm → PUT → syncJobId → Poll → terminal → refresh
 * There is no direct-save path; every commit goes through preview.
 */
export const TemplatePermissionsDrawer = ({
  open,
  onClose,
  templateId,
  templateName,
  templateCode,
  immutable = false,
  onSyncJobStarted,
}: {
  open: boolean;
  onClose: () => void;
  templateId: string | null;
  templateName: string;
  templateCode: string;
  /** SUPER_ADMIN and other immutable templates open in read-only mode. */
  immutable?: boolean;
  /** Notified when a PUT has been accepted and sync polling begins. */
  onSyncJobStarted?: (jobId: string) => void;
}) => {
  const queryClient = useQueryClient();

  const [step, setStep] = useState<DrawerStep>("edit");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [preview, setPreview] = useState<TemplatePermissionPreview | null>(
    null
  );
  const [syncJobId, setSyncJobId] = useState<string | null>(null);

  const {
    data: details,
    isLoading: isLoadingDetails,
  } = useTemplatePermissionsQuery(templateId ?? "", !!templateId && open);

  const { mutateAsync: previewPermissions, isPending: isPreviewPending } =
    usePreviewTemplatePermissionsMutation();
  const { mutateAsync: updatePermissions, isPending: isUpdatePending } =
    useUpdateTemplatePermissionsMutation();

  // Poll the sync job once the PUT has returned a syncJobId
  const { data: syncJob } = useTemplateSyncJobQuery(
    step === "syncing" ? syncJobId : null
  );

  const currentPermissionIds = useMemo(
    () => (details?.currentPermissions ?? []).map((perm) => perm.id),
    [details]
  );

  // Reset local state whenever the drawer opens for a template
  useEffect(() => {
    if (open) {
      setStep("edit");
      setSelectedIds([]);
      setPreview(null);
      setSyncJobId(null);
    }
  }, [open, templateId]);

  // Seed selection once details arrive
  useEffect(() => {
    if (details) {
      setSelectedIds(currentPermissionIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [details]);

  // When the sync job reaches a terminal state: refresh affected data
  useEffect(() => {
    if (step === "syncing" && syncJob && isTerminalSyncStatus(syncJob.status)) {
      queryClient.invalidateQueries({ queryKey: ["template-permissions"] });
      queryClient.invalidateQueries({ queryKey: [api.ROLE_TEMPLATES.LIST] });
      queryClient.invalidateQueries({ queryKey: ["super-admin-firm-roles"] });
    }
  }, [step, syncJob, queryClient]);

  const handlePreview = async () => {
    if (!templateId) return;
    try {
      const response = await previewPermissions({
        templateId,
        permissionIds: selectedIds,
      });
      setPreview(response?.data?.data ?? null);
      setStep("preview");
    } catch {
      // Backend message already toasted by the mutation's onError.
      // Keep the drawer open with the user's selection intact.
    }
  };

  const handleConfirm = async () => {
    if (!templateId) return;
    try {
      const response = await updatePermissions({
        templateId,
        permissionIds: selectedIds,
      });
      const jobId = response?.data?.data?.syncJobId;
      if (!jobId) {
        errorNotification(
          "Permission update submitted but no synchronization job was returned."
        );
        onClose();
        return;
      }
      setSyncJobId(jobId);
      setPreview(null);
      setStep("syncing");
      onSyncJobStarted?.(jobId);
    } catch {
      // Error toast shown by the mutation; stay on the confirm step.
    }
  };

  const closeHandler = () => {
    if (isPreviewPending || isUpdatePending) return;
    onClose();
  };

  return (
    <CustomDrawer
      key={`template-permissions-${templateId}`}
      open={open}
      onClose={closeHandler}
      title={
        step === "edit"
          ? `${templateName} — Permissions`
          : step === "preview"
            ? `${templateName} — Review Impact`
            : `${templateName} — Synchronizing`
      }
      subHeading={
        immutable
          ? "This system template is protected and cannot be modified."
          : "Changes propagate to firm role clones. Review the impact before applying."
      }
      hasFooter={false}
      size="xl"
      component={
        <Stack gap={5} p={4}>
          {step === "edit" && (
            <>
              {!immutable && (
                <HStack
                  justifyContent="space-between"
                  flexWrap="wrap"
                  gap={2}
                >
                  <Text fontSize="sm" color="gray.600">
                    {details?.lastSaEditAt
                      ? `Last Super Admin edit: ${new Date(
                          details.lastSaEditAt
                        ).toLocaleString()}`
                      : "Modify permissions, then preview the impact."}
                  </Text>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={handlePreview}
                    loading={isPreviewPending}
                    disabled={!templateId || isPreviewPending}
                  >
                    <FileSearch size={14} />
                    Preview Impact
                  </Button>
                </HStack>
              )}

              {isLoadingDetails ? (
                <Stack py={8} align="center">
                  <Text color="gray.500" fontSize="sm">
                    Loading template permissions...
                  </Text>
                </Stack>
              ) : (
                <PermissionAssignment
                  heading="Menu & Action Permissions"
                  readOnly={immutable}
                  selectedPermissionIds={selectedIds}
                  onSelectionChange={setSelectedIds}
                />
              )}
            </>
          )}

          {step === "preview" && preview && (
            <>
              <HStack>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setStep("edit")}
                  disabled={isUpdatePending}
                >
                  <ArrowLeft size={14} />
                  Back to editing
                </Button>
              </HStack>
              <TemplatePermissionPreviewView preview={preview} />

              {/* Confirm actions */}
              <HStack justifyContent="flex-end" gap={3} pt={2}>
                <Button
                  variant="outline"
                  onClick={() => setStep("edit")}
                  disabled={isUpdatePending}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleConfirm}
                  loading={isUpdatePending}
                  disabled={preview.wouldViolateChain}
                >
                  {preview.wouldViolateChain
                    ? "Cannot apply — chain violation"
                    : "Confirm & Apply"}
                </Button>
              </HStack>
            </>
          )}

          {step === "syncing" && syncJobId && templateId && (
            <TemplateSyncJobStatus
              job={syncJob ?? pendingJob(syncJobId, templateId, templateCode)}
            />
          )}
        </Stack>
      }
    />
  );
};
