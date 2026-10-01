import { Stack } from "@chakra-ui/react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { useGetMatterQuery } from "@/pages/User/CaseManagement/api/matter.api";
import { useProjectByCodeQuery } from "@/pages/User/ProjectManagement/api/project.api";
import { ROUTES_CONFIG } from "@/shared/config";
import { useModulePermissions } from "@/shared/hooks/usePermissions";

import { DocumentsWorkspace } from "../components/DocumentsWorkspace";
import { toCourtCaseOptions } from "../utils/courtCaseOptions";

interface FolderDetailPageProps {
  /** Which library folder this route represents. */
  kind: "project" | "matter";
}

/**
 * A single document library folder: `/folder/projects/:projectCode` and
 * `/folder/matters/:matterNumber`.
 *
 * Route access is enforced by ModuleRouteGuard (DOCUMENT_MANAGEMENT + VIEW),
 * and the workspace keeps the UPLOAD / SHARE / EDIT gating for every action.
 *
 * The folder's name (and, for a matter, its court cases) comes from the
 * existing project/matter read endpoints — one request, only when the caller
 * may view those modules. Without that permission the folder is still fully
 * usable: it falls back to showing the code, exactly as it is stored.
 */
const FolderDetailPage = ({ kind }: FolderDetailPageProps) => {
  const { projectCode = "", matterNumber = "" } = useParams<{
    projectCode?: string;
    matterNumber?: string;
  }>();
  const navigate = useNavigate();

  const canReadMatters = useModulePermissions("CASE_MANAGEMENT").canView;
  const canReadProjects = useModulePermissions("PROJECT_MANAGEMENT").canView;

  const isProjectFolder = kind === "project";
  const folderCode = isProjectFolder ? projectCode : matterNumber;

  // Both hooks are disabled by the empty string, so only the active folder's
  // metadata is ever fetched.
  const { data: project } = useProjectByCodeQuery(
    isProjectFolder && canReadProjects ? projectCode : ""
  );
  const { data: matter } = useGetMatterQuery(
    !isProjectFolder && canReadMatters ? matterNumber : ""
  );

  // A malformed URL (missing the path parameter) belongs in the library.
  if (!folderCode) {
    return <Navigate to={ROUTES_CONFIG.USER.FOLDER} replace />;
  }

  return (
    <Stack gap={6} padding={2} w="100%" maxW="100%" minW={0}>
      <DocumentsWorkspace
        scope={
          isProjectFolder
            ? { kind: "project", projectCode }
            : {
                kind: "matter",
                matterNumber,
                courtCaseOptions: toCourtCaseOptions(matter?.courtCases),
              }
        }
        emptyMessage="No documents in this folder yet"
        folderMeta={{
          kind,
          code: folderCode,
          name: isProjectFolder ? project?.name : matter?.title,
          onBack: () => navigate(ROUTES_CONFIG.USER.FOLDER),
        }}
      />
    </Stack>
  );
};

export default FolderDetailPage;
