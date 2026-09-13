import { create } from "zustand";

export interface User {
  username?: string;
  email?: string;
  userType?: string;
  profilePhotoUrl?: string;
  role?: string | { name?: string; code?: string; [key: string]: unknown };
  [key: string]: unknown; // allow extra fields from API
}

export interface UserModule {
  moduleCode: string;
  moduleName: string;
  icon: string;
  path: string;
  enabled: boolean;
  actions: string[];
  subModules?: UserModule[];
}

export interface FirmInfo {
  id: string;
  name: string;
  code: string;
  trial: boolean;
  daysRemaining: number | null;
  trialExpiresAt: string | null;
  status: string;
}

export interface AuthState {
  user: User | null;
  firm: FirmInfo | null;
  role: string;
  permissions: string[];
  modules: UserModule[];
  isLoading: boolean;
  isInitialized: boolean;

  setUser: (user: User | null) => void;
  setFirm: (firm: FirmInfo | null) => void;
  setRole: (role: string) => void;
  setPermissions: (permissions: string[]) => void;
  setModules: (modules: UserModule[]) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  clearUser: () => void;
  initializeUser: (data: {
    user: User;
    firm: FirmInfo;
    role: string;
    permissions: string[];
    modules: UserModule[];
  }) => void;
  refreshUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  firm: null,
  role: "",
  permissions: [],
  modules: [],
  isLoading: false,
  isInitialized: false,

  setUser: (user) => set({ user }),
  setFirm: (firm) => set({ firm }),
  setRole: (role) => set({ role }),
  setPermissions: (permissions) => set({ permissions }),
  setModules: (modules) => set({ modules }),
  setLoading: (isLoading) => set({ isLoading }),
  setInitialized: (isInitialized) => set({ isInitialized }),

  clearUser: () =>
    set({
      user: null,
      firm: null,
      role: "",
      permissions: [],
      modules: [],
      isLoading: false,
      isInitialized: false,
    }),

  initializeUser: (data) =>
    set({
      user: data.user,
      firm: data.firm,
      role: data.role,
      permissions: data.permissions,
      modules: data.modules,
      isInitialized: true,
      isLoading: false,
    }),

  refreshUser: () =>
    set((state) => ({
      ...state,
      isLoading: true,
    })),
}));
