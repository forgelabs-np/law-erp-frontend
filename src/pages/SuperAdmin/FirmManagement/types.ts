export type FirmType = "SOLO" | "FIRM";

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
  isTrial?: boolean;
  trialDays?: number;
}

export type FirmFormValues = FirmPayload;

/**
 * Payload for the dedicated update endpoint:
 * `PUT /super-admin/firms/{firmId}` (firmId is the firm UUID).
 *
 * Only contains fields the update contract accepts:
 * - `adminPassword` is intentionally absent — password changes go through
 *   `POST /super-admin/users/{userId}/reset-password`.
 * - `lawFirmCode` / `adminUsername` are immutable on the backend (a changed
 *   value is rejected with 400), so they are always submitted exactly as
 *   loaded and their inputs are disabled in edit mode.
 * - Trial state (`isTrial`/`trialDays`) is not part of the update contract;
 *   it is managed through the firm lifecycle endpoints.
 */
export interface FirmUpdatePayload {
  name: string;
  firmType: FirmType;
  email: string;
  phone: string;
  address: string;
  jurisdiction: string;
  lawFirmCode?: string;
  adminUsername: string;
  adminFullName: string;
  adminEmail: string;
  adminMobileNo: string;
}
