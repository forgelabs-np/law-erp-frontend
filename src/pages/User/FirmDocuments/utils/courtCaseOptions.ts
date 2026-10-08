import { DocumentSelectOption } from "../components/DocumentUploadDialog";

/** Minimal court-case shape — structurally satisfied by the Matter page data. */
export interface MatterCourtCaseOption {
  ourCourtCaseRef: string;
  courtName?: string;
  courtCaseNumber?: string;
}

/**
 * Maps a matter's court cases to the upload dialog's optional court case
 * picker.
 *
 * Shared by the Matter Documents tab (which already holds the data) and the
 * library matter folder route (which reads the matter once) so both offer the
 * same options with the same labels.
 */
export const toCourtCaseOptions = (
  courtCases?: MatterCourtCaseOption[]
): DocumentSelectOption[] =>
  (courtCases ?? []).map((courtCase) => ({
    value: courtCase.ourCourtCaseRef,
    label: `${courtCase.courtName || "Court"} · ${
      courtCase.courtCaseNumber || courtCase.ourCourtCaseRef
    }`,
  }));
