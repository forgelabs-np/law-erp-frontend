import { create } from "zustand";

export type AuthStatus =
  | "SUCCESS"
  | "PASSWORD_CHANGE_REQUIRED"
  | "MFA_SETUP_REQUIRED"
  | "MFA_REQUIRED";

export interface TemporaryAuthState {
  status?: AuthStatus;
  passwordChangeToken?: string;
  mfaToken?: string;
  mfaQrCodeUri?: string;
  mfaManualKey?: string;
  expiresIn?: number;
  expiresAt?: number;
}

interface TemporaryAuthStore extends TemporaryAuthState {
  setTemporaryAuth: (data: TemporaryAuthState) => void;
  clearTemporaryAuth: () => void;
  isExpired: () => boolean;
}

export const useTemporaryAuthStore = create<TemporaryAuthStore>((set, get) => ({
  setTemporaryAuth: (data: TemporaryAuthState) => {
    let expiresAt = undefined;
    if (data.expiresIn) {
      expiresAt = Date.now() + data.expiresIn * 1000;
    }
    set({ ...data, expiresAt });
  },
  clearTemporaryAuth: () => {
    set({
      status: undefined,
      passwordChangeToken: undefined,
      mfaToken: undefined,
      mfaQrCodeUri: undefined,
      mfaManualKey: undefined,
      expiresIn: undefined,
      expiresAt: undefined,
    });
  },
  isExpired: () => {
    const expiresAt = get().expiresAt;
    if (!expiresAt) return false;
    return Date.now() > expiresAt;
  },
}));
