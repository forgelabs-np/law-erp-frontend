/**
 * Project Management Module Types
 */

// ============================================================
// Project Status Types
// ============================================================

export type ProjectStatus = "ACTIVE" | "ON_HOLD" | "COMPLETED" | "CANCELLED";

export type RenewalRecurrence = "ONE_TIME" | "YEARLY" | "QUARTERLY" | "MONTHLY";

export type RenewalStatus = "ACTIVE" | "COMPLETED" | "CANCELLED";

export type RenewalInstanceStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "OVERDUE"
  | "SKIPPED";

export type ProjectMemberRole = "OWNER" | "MEMBER" | "VIEWER";

// ============================================================
// Project Types
// ============================================================

export interface Project {
  id: string;
  projectCode: string;
  name: string;
  clientName: string;
  clientUserId?: string | null;
  description?: string | null;
  status: ProjectStatus;
  startDate: string;
  targetEndDate?: string | null;
  ownerId: string;
  ownerName: string;
  members: ProjectMember[];
  credentialCount: number;
  renewalCount: number;
  overdueInstances: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectMember {
  id: number;
  userId: string;
  userName: string;
  userEmail: string;
  roleInProject: string;
  addedAt: string;
}

export interface CreateProjectRequest {
  name: string;
  clientName: string;
  clientUserId?: string | null;
  description?: string;
  startDate?: string;
  targetEndDate?: string | null;
  ownerId: string;
}

export interface UpdateProjectRequest {
  name?: string;
  clientName?: string;
  clientUserId?: string | null;
  description?: string;
  startDate?: string;
  targetEndDate?: string | null;
  ownerId?: string;
}

// ============================================================
// Credential Types
// ============================================================

export interface ProjectCredential {
  id: number;
  siteName: string;
  siteType: string;
  siteUrl: string;
  usernameOrEmail: string;
  password: string;
  contactPerson?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  notes?: string | null;
  createdAt: string;
}

export interface CreateCredentialRequest {
  siteName: string;
  siteType: string;
  siteUrl: string;
  usernameOrEmail: string;
  password: string;
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  notes?: string;
}

export interface UpdateCredentialRequest {
  siteName: string;
  siteType: string;
  siteUrl: string;
  usernameOrEmail: string;
  password: string;
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  notes?: string;
}

export interface RevealCredentialResponse {
  [key: string]: string;
}

// ============================================================
// Renewal Types
// ============================================================

export interface Renewal {
  id: number;
  projectId: string;
  renewalTypeId: number;
  renewalTypeName: string;
  title: string;
  description?: string | null;
  recurrence: RenewalRecurrence;
  startDate: string;
  endDate?: string | null;
  assignedToId: string;
  assignedToName?: string;
  status: RenewalStatus;
  instances: RenewalInstance[];
  createdAt?: string;
  updatedAt?: string;
}

export interface RenewalInstance {
  id: number;
  renewalId: number;
  dueDate: string;
  status: RenewalInstanceStatus;
  completedAt?: string | null;
  completedById?: string | null;
  completedByName?: string | null;
  notes?: string | null;
}

export interface CreateRenewalRequest {
  renewalTypeId: number;
  title: string;
  description?: string;
  recurrence: RenewalRecurrence;
  startDate: string;
  endDate?: string | null;
  assignedToId: string;
}

export interface UpdateRenewalRequest {
  renewalTypeId: number;
  title: string;
  description?: string;
  recurrence: RenewalRecurrence;
  startDate: string;
  endDate?: string | null;
  assignedToId: string;
}

export interface UpdateRenewalInstanceRequest {
  status: RenewalInstanceStatus;
  notes?: string;
}

// ============================================================
// Renewal Type Types
// ============================================================

export interface RenewalType {
  id: number;
  name: string;
  description?: string | null;
  system: boolean;
  active: boolean;
}

export interface CreateRenewalTypeRequest {
  name: string;
  description?: string;
}

export interface UpdateRenewalTypeRequest {
  name: string;
  description?: string;
}

// ============================================================
// Team Management Types
// ============================================================

export interface AddProjectMemberRequest {
  userId: string;
  role: "MEMBER" | "VIEWER";
}

// ============================================================
// Dashboard Types
// ============================================================

export interface ProjectDashboard {
  totalProjects: number;
  activeProjects: number;
  overdueInstances: number;
  upcomingInstances: number;
  totalCredentials: number;
  totalRenewals: number;
  overdueItems: OverdueItem[];
  upcomingItems: UpcomingItem[];
}

export interface OverdueItem {
  projectCode: string;
  projectName: string;
  renewalTitle: string;
  renewalTypeName: string;
  dueDate: string;
  daysOverdue: number;
}

export interface UpcomingItem {
  projectCode: string;
  projectName: string;
  renewalTitle: string;
  renewalTypeName: string;
  dueDate: string;
}

// ============================================================
// Client Portal Types
// ============================================================

export interface ClientProject {
  id: string;
  projectCode: string;
  name: string;
  clientName: string;
  description?: string | null;
  status: ProjectStatus;
  startDate: string;
  targetEndDate?: string | null;
  credentialCount: number;
  renewalCount: number;
  overdueInstances: number;
}

export interface ClientProjectRenewal {
  id: number;
  renewalTitle: string;
  renewalTypeName: string;
  recurrence: RenewalRecurrence;
  startDate: string;
  endDate?: string | null;
  status: RenewalStatus;
  instances: ClientRenewalInstance[];
}

export interface ClientRenewalInstance {
  id: number;
  dueDate: string;
  status: RenewalInstanceStatus;
  completedAt?: string | null;
  notes?: string | null;
}
