import { useMemo } from "react";

import {
  MatterCourtCaseOption,
  toCourtCaseOptions,
} from "../utils/courtCaseOptions";
import { DocumentsWorkspace } from "./DocumentsWorkspace";

interface MatterDocumentsTabProps {
  matterNumber: string;
  /** Court cases of this matter; used for the optional `courtCaseRef` tag. */
  courtCases?: MatterCourtCaseOption[];
}

/**
 * Documents tab for a Matter. The matter is already known, so the upload
 * dialog never asks for a destination — it only offers the optional court
 * case tag.
 */
export const MatterDocumentsTab = ({
  matterNumber,
  courtCases,
}: MatterDocumentsTabProps) => {
  const courtCaseOptions = useMemo(
    () => toCourtCaseOptions(courtCases),
    [courtCases]
  );

  return (
    <DocumentsWorkspace
      scope={{ kind: "matter", matterNumber, courtCaseOptions }}
      emptyMessage="No documents have been added to this matter yet"
    />
  );
};
