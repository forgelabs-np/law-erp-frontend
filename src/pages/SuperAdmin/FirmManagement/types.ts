export type FirmType = "SOLO" | "CLIENT";

export interface FirmPayload {
  id?: string;
  lawFirmCode?: string;
  name: string;
  firmType: FirmType | "";
  email: string;
  phone: string;
  address: string;
  jurisdiction: string;
  adminUsername: string;
  adminEmail: string;
  adminMobileNo: string;
  adminPassword?: string;
  adminFullName: string;
}

export type FirmFormValues = FirmPayload;
