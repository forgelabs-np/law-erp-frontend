import { Box, Button, HStack, Stack, Text } from "@chakra-ui/react";
import { FolderOpen, Scale } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogRoot,
  DialogTitle,
} from "@/shared/components/ui/Dialog";
import { FieldSelect } from "@/pages/User/CaseManagement/components/ui";
import { useGetMatterQuery } from "@/pages/User/CaseManagement/api/matter.api";
import { validateDocumentFile } from "@/shared/utils/documents";
import { useDocumentUpload } from "../hooks/useDocumentUpload";
import { FileDropZone } from "./FileDropZone";
import { SelectedFileCard } from "./SelectedFileCard";

export interface DocumentSelectOption {
  value: string;
  label: string;
}

/** Where the dialog was opened from. */
export type DocumentUploadContext =
  | { kind: "library" }
  | {
      kind: "matter";
      matterNumber: string;
      courtCaseOptions?: DocumentSelectOption[];
    }
  | { kind: "project"; projectCode: string };

interface DocumentUploadDialogProps {
  open: boolean;
  onClose: () => void;
  context: DocumentUploadContext;
  /** Scoped lists — only used for the library context's destination picker. */
  matterOptions?: DocumentSelectOption[];
  projectOptions?: DocumentSelectOption[];
  isOptionsLoading?: boolean;
}

type DestinationKind = "matter" | "project";

const SUCCESS_CLOSE_DELAY_MS = 1200;

/**
 * The single upload dialog used by `/folder`, the Matter Documents tab and the
 * Project Documents tab.
 *
 * The calling scope decides how much the user must choose:
 * - library → destination type + matter/project (+ optional court case)
 * - matter  → the matter and its court cases are already known
 * - project → the project is already known
 *
 * The matter number / project code is only ever one of the two, so the upload
 * request always carries exactly one destination.
 */
export const DocumentUploadDialog = ({
  open,
  onClose,
  context,
  matterOptions = [],
  projectOptions = [],
  isOptionsLoading = false,
}: DocumentUploadDialogProps) => {
  const upload = useDocumentUpload();

  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | undefined>(undefined);
  // Temporary local thumbnail for image files (URL.createObjectURL). The
  // string lives in state for rendering; the ref owns the revoke so cleanup
  // never depends on a stale closure.
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const previewUrlRef = useRef<string | null>(null);
  const [destinationKind, setDestinationKind] =
    useState<DestinationKind>("matter");
  const [selectedMatter, setSelectedMatter] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedCourtCase, setSelectedCourtCase] = useState("");

  const isLibrary = context.kind === "library";

  const releasePreviewUrl = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setFilePreviewUrl(null);
  };

  // The active destination of the library context. Only the chosen kind is
  // ever used, so a stale selection from the other kind can never leak into
  // the upload request.
  const activeMatterNumber = isLibrary
    ? destinationKind === "matter"
      ? selectedMatter
      : ""
    : context.kind === "matter"
      ? context.matterNumber
      : "";

  const activeProjectCode = isLibrary
    ? destinationKind === "project"
      ? selectedProject
      : ""
    : context.kind === "project"
      ? context.projectCode
      : "";

  // Library mode only: the court-case list of the chosen matter. The Matter
  // tab already has this data and passes it in, so this fetch never happens
  // for the matter/project contexts.
  const { data: selectedMatterDetail } = useGetMatterQuery(
    isLibrary ? activeMatterNumber : ""
  );

  const courtCaseOptions = useMemo<DocumentSelectOption[]>(() => {
    if (context.kind === "matter") return context.courtCaseOptions ?? [];

    if (!activeMatterNumber || !selectedMatterDetail?.courtCases) return [];

    return selectedMatterDetail.courtCases.map((courtCase) => ({
      value: courtCase.ourCourtCaseRef,
      label: `${courtCase.courtName || "Court"} · ${courtCase.courtCaseNumber || courtCase.ourCourtCaseRef}`,
    }));
  }, [context, activeMatterNumber, selectedMatterDetail]);

  // Reset everything each time the dialog is opened so no stale file,
  // destination or error is ever reused.
  useEffect(() => {
    if (!open) return;

    setFile(null);
    setFileError(undefined);
    releasePreviewUrl();
    setDestinationKind("matter");
    setSelectedMatter("");
    setSelectedProject("");
    setSelectedCourtCase("");
    upload.reset();
    // `upload.reset` is stable; re-running only on open is intentional.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Never leak an object URL if the dialog unmounts mid-flow.
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  // Close shortly after a confirmed upload.
  useEffect(() => {
    if (!open || !upload.isSuccess) return;

    const timeout = setTimeout(onClose, SUCCESS_CLOSE_DELAY_MS);
    return () => clearTimeout(timeout);
  }, [open, upload.isSuccess, onClose]);

  /** Validates and stages a picked/dropped file, with an image thumbnail. */
  const handleFileSelected = (selected: File) => {
    const result = validateDocumentFile(selected);

    setFileError(result.valid ? undefined : result.error);
    setFile(selected);

    // Replace (or drop) the temporary preview URL — never leak one.
    releasePreviewUrl();

    if (selected.type.startsWith("image/")) {
      previewUrlRef.current = URL.createObjectURL(selected);
      setFilePreviewUrl(previewUrlRef.current);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFileError(undefined);
    releasePreviewUrl();
    upload.reset();
  };

  const matterNumber = activeMatterNumber;
  const projectCode = activeProjectCode;

  const destination = matterNumber || projectCode;

  const canSubmit =
    Boolean(file) && !fileError && Boolean(destination) && !upload.isUploading;

  const handleSubmit = async () => {
    if (!file || !canSubmit) return;

    const result = validateDocumentFile(file);

    if (!result.valid) {
      setFileError(result.error);
      return;
    }

    await upload.start({
      file,
      ...(matterNumber ? { matterNumber } : {}),
      ...(projectCode ? { projectCode } : {}),
      // courtCaseRef is only meaningful for a matter document.
      ...(matterNumber && selectedCourtCase
        ? { courtCaseRef: selectedCourtCase }
        : {}),
    });
  };

  // An upload in flight must not be lost by an accidental close.
  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && upload.isUploading) return;
    if (!nextOpen) onClose();
  };

  const destinationLabel = matterNumber
    ? matterNumber
    : projectCode
      ? projectCode
      : "—";

  return (
    <DialogRoot
      open={open}
      onOpenChange={(event) => handleOpenChange(event.open)}
      closeOnInteractOutside={false}
      size="lg"
    >
      <DialogBackdrop />
      <DialogContent borderRadius="3xl" maxW="560px">
        <DialogCloseTrigger disabled={upload.isUploading} />
        <DialogBody px={8} pt={10} pb={6}>
          <Stack gap={5}>
            <Stack gap={1}>
              <DialogTitle
                textStyle="heading_6"
                fontWeight="600"
                color="gray.700"
              >
                Upload Document
              </DialogTitle>
              <Text fontSize="sm" color="gray.500">
                {isLibrary
                  ? "Choose where this document belongs, then pick a file."
                  : "Choose a file to upload. The destination is already set."}
              </Text>
            </Stack>

            {/* ---------- Destination ---------- */}
            {isLibrary ? (
              <Stack gap={3}>
                <Text fontSize="sm" fontWeight={600} color="gray.700">
                  Where should this document be stored?
                </Text>
                <HStack gap={3}>
                  <Button
                    type="button"
                    variant={
                      destinationKind === "matter" ? "primary" : "outline"
                    }
                    flex={1}
                    aria-pressed={destinationKind === "matter"}
                    disabled={upload.isUploading}
                    onClick={() => {
                      setDestinationKind("matter");
                      setSelectedCourtCase("");
                    }}
                  >
                    <Scale size={16} /> Matter / Case
                  </Button>
                  <Button
                    type="button"
                    variant={
                      destinationKind === "project" ? "primary" : "outline"
                    }
                    flex={1}
                    aria-pressed={destinationKind === "project"}
                    disabled={upload.isUploading}
                    onClick={() => setDestinationKind("project")}
                  >
                    <FolderOpen size={16} /> Project
                  </Button>
                </HStack>

                {destinationKind === "matter" ? (
                  <FieldSelect
                    value={selectedMatter}
                    onChange={(value) => {
                      setSelectedMatter(value);
                      setSelectedCourtCase("");
                    }}
                    ariaLabel="Select matter"
                    placeholder={
                      isOptionsLoading ? "Loading matters..." : "Select matter"
                    }
                    disabled={upload.isUploading}
                  >
                    {matterOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </FieldSelect>
                ) : (
                  <FieldSelect
                    value={selectedProject}
                    onChange={setSelectedProject}
                    ariaLabel="Select project"
                    placeholder={
                      isOptionsLoading
                        ? "Loading projects..."
                        : "Select project"
                    }
                    disabled={upload.isUploading}
                  >
                    {projectOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </FieldSelect>
                )}
              </Stack>
            ) : (
              <Stack gap={1}>
                <Text fontSize="xs" fontWeight={600} color="gray.600">
                  {matterNumber ? "Matter" : "Project"}
                </Text>
                <Box
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                  px={3}
                  py={2}
                  bg="gray.50"
                >
                  <Text fontSize="sm" color="gray.800" fontFamily="monospace">
                    {destinationLabel}
                  </Text>
                </Box>
              </Stack>
            )}

            {/* ---------- Court case (matter documents only) ---------- */}
            {matterNumber && courtCaseOptions.length > 0 && (
              <Stack gap={1}>
                <Text fontSize="xs" fontWeight="600" color="gray.600">
                  Court Case (optional)
                </Text>
                <FieldSelect
                  value={selectedCourtCase}
                  onChange={setSelectedCourtCase}
                  ariaLabel="Select court case"
                  placeholder="No specific court case"
                  disabled={upload.isUploading}
                >
                  {courtCaseOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </FieldSelect>
              </Stack>
            )}

            {/* ---------- File ---------- */}
            <Stack gap={2}>
              <Text fontSize="xs" fontWeight="600" color="gray.600">
                File
              </Text>

              {file ? (
                <SelectedFileCard
                  file={file}
                  previewUrl={filePreviewUrl}
                  validationError={fileError}
                  stage={upload.stage}
                  progress={upload.progress}
                  uploadError={upload.errorMessage}
                  isUploading={upload.isUploading}
                  onRemove={handleRemoveFile}
                  onRetry={() => void handleSubmit()}
                />
              ) : (
                <FileDropZone
                  disabled={upload.isUploading}
                  onFileSelected={handleFileSelected}
                />
              )}
            </Stack>
          </Stack>
        </DialogBody>

        <HStack px={8} pb={8} pt={0} justify="flex-end" gap={3}>
          <Button
            variant="surface"
            borderRadius="xl"
            onClick={onClose}
            disabled={upload.isUploading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            borderRadius="xl"
            onClick={() => void handleSubmit()}
            loading={upload.isUploading}
            disabled={!canSubmit && !upload.isUploading}
          >
            {upload.stage === "error" ? "Try Again" : "Upload"}
          </Button>
        </HStack>
      </DialogContent>
    </DialogRoot>
  );
};
