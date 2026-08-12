export type UserType = "SUPER_ADMIN" | "ADMIN" | "CLIENT" | "LAWYER" | "STAFF";

export interface Client {
  id: string;
  username: string;
  email: string;
  mobileNo: string;
  fullName: string;
  userType: UserType;
  isActive: boolean;
  portalAccessEnabled: boolean;
  createdAt: string;
}

export interface ClientPayload {
  username: string;
  email: string;
  mobileNo: string;
  password: string;
  fullName: string;
  portalAccessEnabled: boolean;
}

export interface ClientFormValues {
  username: string;
  email: string;
  mobileNo: string;
  password: string;
  fullName: string;
  portalAccessEnabled: boolean;
}
