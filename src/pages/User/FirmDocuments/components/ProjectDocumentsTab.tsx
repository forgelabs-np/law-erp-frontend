import { DocumentsWorkspace } from "./DocumentsWorkspace";

/**
 * Documents tab for a Project. The project is already known, so the upload
 * dialog never asks for a destination and no court case tag is offered.
 */
export const ProjectDocumentsTab = ({
  projectCode,
}: {
  projectCode: string;
}) => (
  <DocumentsWorkspace
    scope={{ kind: "project", projectCode }}
    emptyMessage="No documents have been added to this project yet"
  />
);
