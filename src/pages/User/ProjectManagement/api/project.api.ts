import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/shared/service/service-api";
import { LawFirmCRMClient } from "@/shared/service/service-axios";
import { ApiResponse, PaginatedResponse } from "@/shared/types/response";
import { toastFail, toastSuccess } from "@/shared/toast";

import {
  AddProjectMemberRequest,
  ClientProject,
  ClientProjectRenewal,
  CreateCredentialRequest,
  CreateProjectRequest,
  CreateRenewalRequest,
  CreateRenewalTypeRequest,
  Project,
  ProjectCredential,
  ProjectDashboard,
  ProjectMember,
  RevealCredentialResponse,
  Renewal,
  RenewalInstance,
  RenewalType,
  UpdateProjectRequest,
  UpdateRenewalInstanceRequest,
  UpdateCredentialRequest,
  UpdateRenewalRequest,
  UpdateRenewalTypeRequest,
} from "../types/project.types";

// ============================================================
// Query keys
// ============================================================

export const projectKeys = {
  dashboard: ["project-dashboard"] as const,
  projects: (params?: {
    status?: string;
    search?: string;
    page?: number;
    size?: number;
  }) => ["projects", params] as const,
  projectByCode: (projectCode: string) => ["project", projectCode] as const,
  projectMembers: (projectCode: string) =>
    ["project-members", projectCode] as const,
  projectCredentials: (projectCode: string) =>
    ["project-credentials", projectCode] as const,
  projectRenewals: (projectCode: string) =>
    ["project-renewals", projectCode] as const,
  renewalDetail: (projectCode: string, renewalId: number) =>
    ["renewal-detail", projectCode, renewalId] as const,
  renewalTypes: ["renewal-types"] as const,
  clientProjects: ["client-projects"] as const,
  clientProjectByCode: (projectCode: string) =>
    ["client-project", projectCode] as const,
  clientProjectRenewals: (projectCode: string) =>
    ["client-project-renewals", projectCode] as const,
};

// ============================================================
// Project Dashboard
// ============================================================

const getProjectDashboard = () => {
  return LawFirmCRMClient.get<ApiResponse<ProjectDashboard>>(
    api.PROJECT_MANAGEMENT.DASHBOARD
  );
};

export const useProjectDashboardQuery = () => {
  return useQuery({
    queryKey: projectKeys.dashboard,
    queryFn: getProjectDashboard,
    select: (response) => response?.data?.data,
  });
};

// ============================================================
// Project List
// ============================================================

const getProjects = (params?: {
  status?: string;
  search?: string;
  page?: number;
  size?: number;
}) => {
  return LawFirmCRMClient.get<ApiResponse<PaginatedResponse<Project>>>(
    api.PROJECT_MANAGEMENT.PROJECTS,
    { params }
  );
};

export const useProjectsQuery = (params?: {
  status?: string;
  search?: string;
  page?: number;
  size?: number;
}) => {
  return useQuery({
    queryKey: projectKeys.projects(params),
    queryFn: () => getProjects(params),
    select: (response) => response?.data?.data,
  });
};

// ============================================================
// Project Detail
// ============================================================

const getProjectByCode = (projectCode: string) => {
  return LawFirmCRMClient.get<ApiResponse<Project>>(
    api.PROJECT_MANAGEMENT.PROJECT_BY_CODE.replace("{projectCode}", projectCode)
  );
};

export const useProjectByCodeQuery = (projectCode: string) => {
  return useQuery({
    queryKey: projectKeys.projectByCode(projectCode),
    enabled: !!projectCode,
    queryFn: () => getProjectByCode(projectCode),
    select: (response) => response?.data?.data,
  });
};

// ============================================================
// Create Project
// ============================================================

const createProject = (data: CreateProjectRequest) => {
  return LawFirmCRMClient.post<ApiResponse<Project>>(
    api.PROJECT_MANAGEMENT.PROJECTS,
    data
  );
};

export const useCreateProjectMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      toastSuccess("Project created successfully");
      queryClient.invalidateQueries({
        queryKey: projectKeys.projects(),
      });
      queryClient.invalidateQueries({
        queryKey: projectKeys.dashboard,
      });
    },
    onError: (error: any) => {
      toastFail(error?.response?.data?.message ?? "Failed to create project");
    },
  });
};

// ============================================================
// Update Project
// ============================================================

const updateProject = ({
  projectCode,
  data,
}: {
  projectCode: string;
  data: UpdateProjectRequest;
}) => {
  return LawFirmCRMClient.put<ApiResponse<Project>>(
    api.PROJECT_MANAGEMENT.PROJECT_BY_CODE.replace(
      "{projectCode}",
      projectCode
    ),
    data
  );
};

export const useUpdateProjectMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProject,
    onSuccess: (_, variables) => {
      toastSuccess("Project updated successfully");
      queryClient.invalidateQueries({
        queryKey: projectKeys.projectByCode(variables.projectCode),
      });
      queryClient.invalidateQueries({
        queryKey: projectKeys.projects(),
      });
    },
    onError: (error: any) => {
      toastFail(error?.response?.data?.message ?? "Failed to update project");
    },
  });
};

// ============================================================
// Change Project Status
// ============================================================

const changeProjectStatus = ({
  projectCode,
  status,
}: {
  projectCode: string;
  status: string;
}) => {
  return LawFirmCRMClient.patch<ApiResponse<Project>>(
    api.PROJECT_MANAGEMENT.PROJECT_STATUS.replace("{projectCode}", projectCode),
    null,
    { params: { status } }
  );
};

export const useChangeProjectStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: changeProjectStatus,
    onSuccess: (_, variables) => {
      toastSuccess("Project status updated successfully");
      queryClient.invalidateQueries({
        queryKey: projectKeys.projectByCode(variables.projectCode),
      });
      queryClient.invalidateQueries({
        queryKey: projectKeys.projects(),
      });
      queryClient.invalidateQueries({
        queryKey: projectKeys.dashboard,
      });
    },
    onError: (error: any) => {
      toastFail(
        error?.response?.data?.message ?? "Failed to update project status"
      );
    },
  });
};

// ============================================================
// Project Members
// ============================================================

const getProjectMembers = (projectCode: string) => {
  return LawFirmCRMClient.get<ApiResponse<ProjectMember[]>>(
    api.PROJECT_MANAGEMENT.PROJECT_MEMBERS.replace("{projectCode}", projectCode)
  );
};

export const useProjectMembersQuery = (projectCode: string) => {
  return useQuery({
    queryKey: projectKeys.projectMembers(projectCode),
    enabled: !!projectCode,
    queryFn: () => getProjectMembers(projectCode),
    select: (response) => response?.data?.data ?? [],
  });
};

const addProjectMember = ({
  projectCode,
  data,
}: {
  projectCode: string;
  data: AddProjectMemberRequest;
}) => {
  return LawFirmCRMClient.post<ApiResponse<ProjectMember>>(
    api.PROJECT_MANAGEMENT.PROJECT_MEMBERS.replace(
      "{projectCode}",
      projectCode
    ),
    data
  );
};

export const useAddProjectMemberMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addProjectMember,
    onSuccess: (_, variables) => {
      toastSuccess("Team member added successfully");
      queryClient.invalidateQueries({
        queryKey: projectKeys.projectMembers(variables.projectCode),
      });
    },
    onError: (error: any) => {
      toastFail(error?.response?.data?.message ?? "Failed to add team member");
    },
  });
};

const removeProjectMember = ({
  projectCode,
  userId,
}: {
  projectCode: string;
  userId: string;
}) => {
  return LawFirmCRMClient.delete<ApiResponse<void>>(
    api.PROJECT_MANAGEMENT.PROJECT_MEMBER_DELETE.replace(
      "{projectCode}",
      projectCode
    ).replace("{userId}", userId)
  );
};

export const useRemoveProjectMemberMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeProjectMember,
    onSuccess: (_, variables) => {
      toastSuccess("Team member removed successfully");
      queryClient.invalidateQueries({
        queryKey: projectKeys.projectMembers(variables.projectCode),
      });
    },
    onError: (error: any) => {
      toastFail(
        error?.response?.data?.message ?? "Failed to remove team member"
      );
    },
  });
};

// ============================================================
// Project Credentials
// ============================================================

const getProjectCredentials = (projectCode: string) => {
  return LawFirmCRMClient.get<ApiResponse<ProjectCredential[]>>(
    api.PROJECT_MANAGEMENT.PROJECT_CREDENTIALS.replace(
      "{projectCode}",
      projectCode
    )
  );
};

export const useProjectCredentialsQuery = (projectCode: string) => {
  return useQuery({
    queryKey: projectKeys.projectCredentials(projectCode),
    enabled: !!projectCode,
    queryFn: () => getProjectCredentials(projectCode),
    select: (response) => response?.data?.data ?? [],
  });
};

const createCredential = ({
  projectCode,
  data,
}: {
  projectCode: string;
  data: CreateCredentialRequest;
}) => {
  return LawFirmCRMClient.post<ApiResponse<ProjectCredential>>(
    api.PROJECT_MANAGEMENT.PROJECT_CREDENTIALS.replace(
      "{projectCode}",
      projectCode
    ),
    data
  );
};

export const useCreateCredentialMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCredential,
    onSuccess: (_, variables) => {
      toastSuccess("Credential added successfully");
      queryClient.invalidateQueries({
        queryKey: projectKeys.projectCredentials(variables.projectCode),
      });
      queryClient.invalidateQueries({
        queryKey: projectKeys.projectByCode(variables.projectCode),
      });
    },
    onError: (error: any) => {
      toastFail(error?.response?.data?.message ?? "Failed to add credential");
    },
  });
};

const revealCredential = ({
  projectCode,
  credentialId,
}: {
  projectCode: string;
  credentialId: number;
}) => {
  return LawFirmCRMClient.post<ApiResponse<RevealCredentialResponse>>(
    api.PROJECT_MANAGEMENT.CREDENTIAL_REVEAL.replace(
      "{projectCode}",
      projectCode
    ).replace("{id}", credentialId.toString())
  );
};

export const useRevealCredentialMutation = () => {
  return useMutation({
    mutationFn: revealCredential,
    onError: (error: any) => {
      toastFail(error?.response?.data?.message ?? "Failed to reveal password");
    },
  });
};

const updateCredential = ({
  projectCode,
  credentialId,
  data,
}: {
  projectCode: string;
  credentialId: number;
  data: UpdateCredentialRequest;
}) => {
  return LawFirmCRMClient.put<ApiResponse<ProjectCredential>>(
    api.PROJECT_MANAGEMENT.CREDENTIAL_UPDATE.replace(
      "{projectCode}",
      projectCode
    ).replace("{id}", credentialId.toString()),
    data
  );
};

export const useUpdateCredentialMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCredential,
    onSuccess: (_, variables) => {
      toastSuccess("Credential updated successfully");
      queryClient.invalidateQueries({
        queryKey: projectKeys.projectCredentials(variables.projectCode),
      });
      queryClient.invalidateQueries({
        queryKey: projectKeys.projectByCode(variables.projectCode),
      });
    },
    onError: (error: any) => {
      toastFail(
        error?.response?.data?.message ?? "Failed to update credential"
      );
    },
  });
};

const deleteCredential = ({
  projectCode,
  credentialId,
}: {
  projectCode: string;
  credentialId: number;
}) => {
  return LawFirmCRMClient.delete<ApiResponse<void>>(
    api.PROJECT_MANAGEMENT.CREDENTIAL_DELETE.replace(
      "{projectCode}",
      projectCode
    ).replace("{id}", credentialId.toString())
  );
};

export const useDeleteCredentialMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCredential,
    onSuccess: (_, variables) => {
      toastSuccess("Credential deleted successfully");
      queryClient.invalidateQueries({
        queryKey: projectKeys.projectCredentials(variables.projectCode),
      });
      queryClient.invalidateQueries({
        queryKey: projectKeys.projectByCode(variables.projectCode),
      });
    },
    onError: (error: any) => {
      toastFail(
        error?.response?.data?.message ?? "Failed to delete credential"
      );
    },
  });
};

// ============================================================
// Project Renewals
// ============================================================

const getProjectRenewals = (projectCode: string) => {
  return LawFirmCRMClient.get<ApiResponse<Renewal[]>>(
    api.PROJECT_MANAGEMENT.PROJECT_RENEWALS.replace(
      "{projectCode}",
      projectCode
    )
  );
};

export const useProjectRenewalsQuery = (projectCode: string) => {
  return useQuery({
    queryKey: projectKeys.projectRenewals(projectCode),
    enabled: !!projectCode,
    queryFn: () => getProjectRenewals(projectCode),
    select: (response) => response?.data?.data ?? [],
  });
};

const getRenewalDetail = (projectCode: string, renewalId: number) => {
  return LawFirmCRMClient.get<ApiResponse<Renewal>>(
    api.PROJECT_MANAGEMENT.RENEWAL_DETAIL.replace(
      "{projectCode}",
      projectCode
    ).replace("{id}", renewalId.toString())
  );
};

export const useRenewalDetailQuery = (
  projectCode: string,
  renewalId: number
) => {
  return useQuery({
    queryKey: projectKeys.renewalDetail(projectCode, renewalId),
    enabled: !!projectCode && !!renewalId,
    queryFn: () => getRenewalDetail(projectCode, renewalId),
    select: (response) => response?.data?.data,
  });
};

const createRenewal = ({
  projectCode,
  data,
}: {
  projectCode: string;
  data: CreateRenewalRequest;
}) => {
  return LawFirmCRMClient.post<ApiResponse<Renewal>>(
    api.PROJECT_MANAGEMENT.PROJECT_RENEWALS.replace(
      "{projectCode}",
      projectCode
    ),
    data
  );
};

export const useCreateRenewalMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRenewal,
    onSuccess: (_, variables) => {
      toastSuccess("Renewal created successfully");
      queryClient.invalidateQueries({
        queryKey: projectKeys.projectRenewals(variables.projectCode),
      });
      queryClient.invalidateQueries({
        queryKey: projectKeys.projectByCode(variables.projectCode),
      });
    },
    onError: (error: any) => {
      toastFail(error?.response?.data?.message ?? "Failed to create renewal");
    },
  });
};

const updateRenewalInstance = ({
  projectCode,
  renewalId,
  instanceId,
  data,
}: {
  projectCode: string;
  renewalId: number;
  instanceId: number;
  data: UpdateRenewalInstanceRequest;
}) => {
  return LawFirmCRMClient.patch<ApiResponse<RenewalInstance>>(
    api.PROJECT_MANAGEMENT.RENEWAL_INSTANCE_UPDATE.replace(
      "{projectCode}",
      projectCode
    )
      .replace("{renewalId}", renewalId.toString())
      .replace("{instanceId}", instanceId.toString()),
    data
  );
};

export const useUpdateRenewalInstanceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateRenewalInstance,
    onSuccess: (_, variables) => {
      toastSuccess("Renewal instance updated successfully");
      queryClient.invalidateQueries({
        queryKey: projectKeys.projectRenewals(variables.projectCode),
      });
      queryClient.invalidateQueries({
        queryKey: projectKeys.renewalDetail(
          variables.projectCode,
          variables.renewalId
        ),
      });
    },
    onError: (error: any) => {
      toastFail(
        error?.response?.data?.message ?? "Failed to update renewal instance"
      );
    },
  });
};

const updateRenewal = ({
  projectCode,
  renewalId,
  data,
}: {
  projectCode: string;
  renewalId: number;
  data: UpdateRenewalRequest;
}) => {
  return LawFirmCRMClient.put<ApiResponse<Renewal>>(
    api.PROJECT_MANAGEMENT.RENEWAL_UPDATE.replace(
      "{projectCode}",
      projectCode
    ).replace("{id}", renewalId.toString()),
    data
  );
};

export const useUpdateRenewalMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateRenewal,
    onSuccess: (_, variables) => {
      toastSuccess("Renewal updated successfully");
      queryClient.invalidateQueries({
        queryKey: projectKeys.projectRenewals(variables.projectCode),
      });
      queryClient.invalidateQueries({
        queryKey: projectKeys.renewalDetail(
          variables.projectCode,
          variables.renewalId
        ),
      });
      queryClient.invalidateQueries({
        queryKey: projectKeys.projectByCode(variables.projectCode),
      });
    },
    onError: (error: any) => {
      toastFail(error?.response?.data?.message ?? "Failed to update renewal");
    },
  });
};

const changeRenewalStatus = ({
  projectCode,
  renewalId,
  status,
}: {
  projectCode: string;
  renewalId: number;
  status: string;
}) => {
  return LawFirmCRMClient.patch<ApiResponse<Renewal>>(
    api.PROJECT_MANAGEMENT.RENEWAL_STATUS.replace(
      "{projectCode}",
      projectCode
    ).replace("{id}", renewalId.toString()),
    null,
    { params: { status } }
  );
};

export const useChangeRenewalStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: changeRenewalStatus,
    onSuccess: (_, variables) => {
      toastSuccess("Renewal status updated successfully");
      queryClient.invalidateQueries({
        queryKey: projectKeys.projectRenewals(variables.projectCode),
      });
      queryClient.invalidateQueries({
        queryKey: projectKeys.renewalDetail(
          variables.projectCode,
          variables.renewalId
        ),
      });
      queryClient.invalidateQueries({
        queryKey: projectKeys.projectByCode(variables.projectCode),
      });
    },
    onError: (error: any) => {
      toastFail(
        error?.response?.data?.message ?? "Failed to update renewal status"
      );
    },
  });
};

// ============================================================
// Renewal Types
// ============================================================

const getRenewalTypes = () => {
  return LawFirmCRMClient.get<ApiResponse<RenewalType[]>>(
    api.PROJECT_MANAGEMENT.RENEWAL_TYPES
  );
};

export const useRenewalTypesQuery = () => {
  return useQuery({
    queryKey: projectKeys.renewalTypes,
    queryFn: getRenewalTypes,
    select: (response) => response?.data?.data ?? [],
  });
};

const createRenewalType = (data: CreateRenewalTypeRequest) => {
  return LawFirmCRMClient.post<ApiResponse<RenewalType>>(
    api.PROJECT_MANAGEMENT.RENEWAL_TYPES,
    data
  );
};

export const useCreateRenewalTypeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRenewalType,
    onSuccess: () => {
      toastSuccess("Renewal type created successfully");
      queryClient.invalidateQueries({
        queryKey: projectKeys.renewalTypes,
      });
    },
    onError: (error: any) => {
      toastFail(
        error?.response?.data?.message ?? "Failed to create renewal type"
      );
    },
  });
};

const deleteRenewalType = (id: number) => {
  return LawFirmCRMClient.delete<ApiResponse<void>>(
    `${api.PROJECT_MANAGEMENT.RENEWAL_TYPES}/${id}`
  );
};

export const useDeleteRenewalTypeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRenewalType,
    onSuccess: () => {
      toastSuccess("Renewal type deleted successfully");
      queryClient.invalidateQueries({
        queryKey: projectKeys.renewalTypes,
      });
    },
    onError: (error: any) => {
      toastFail(
        error?.response?.data?.message ?? "Failed to delete renewal type"
      );
    },
  });
};

const updateRenewalType = ({
  id,
  data,
}: {
  id: number;
  data: UpdateRenewalTypeRequest;
}) => {
  return LawFirmCRMClient.put<ApiResponse<RenewalType>>(
    api.PROJECT_MANAGEMENT.RENEWAL_TYPE_UPDATE.replace("{id}", id.toString()),
    data
  );
};

export const useUpdateRenewalTypeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateRenewalType,
    onSuccess: () => {
      toastSuccess("Renewal type updated successfully");
      queryClient.invalidateQueries({
        queryKey: projectKeys.renewalTypes,
      });
    },
    onError: (error: any) => {
      toastFail(
        error?.response?.data?.message ?? "Failed to update renewal type"
      );
    },
  });
};

// ============================================================
// Client Projects
// ============================================================

const getClientProjects = () => {
  return LawFirmCRMClient.get<ApiResponse<PaginatedResponse<ClientProject>>>(
    api.CLIENT_PROJECTS.PROJECTS
  );
};

export const useClientProjectsQuery = () => {
  return useQuery({
    queryKey: projectKeys.clientProjects,
    queryFn: getClientProjects,
    select: (response) => response?.data?.data,
  });
};

const getClientProjectByCode = (projectCode: string) => {
  return LawFirmCRMClient.get<ApiResponse<ClientProject>>(
    api.CLIENT_PROJECTS.PROJECT_BY_CODE.replace("{projectCode}", projectCode)
  );
};

export const useClientProjectByCodeQuery = (projectCode: string) => {
  return useQuery({
    queryKey: projectKeys.clientProjectByCode(projectCode),
    enabled: !!projectCode,
    queryFn: () => getClientProjectByCode(projectCode),
    select: (response) => response?.data?.data,
  });
};

const getClientProjectRenewals = (projectCode: string) => {
  return LawFirmCRMClient.get<ApiResponse<ClientProjectRenewal[]>>(
    api.CLIENT_PROJECTS.PROJECT_RENEWALS.replace("{projectCode}", projectCode)
  );
};

export const useClientProjectRenewalsQuery = (projectCode: string) => {
  return useQuery({
    queryKey: projectKeys.clientProjectRenewals(projectCode),
    enabled: !!projectCode,
    queryFn: () => getClientProjectRenewals(projectCode),
    select: (response) => response?.data?.data ?? [],
  });
};
