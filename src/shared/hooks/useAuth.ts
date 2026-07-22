import { useAuthStore } from "@/shared/stores/auth.store";

export const useCurrentUser = () => {
  return useAuthStore((state) => state.user);
};

export const useFirm = () => {
  return useAuthStore((state) => state.firm);
};

export const useRole = () => {
  return useAuthStore((state) => state.role);
};

export const useModules = () => {
  return useAuthStore((state) => state.modules);
};

export const usePermissions = () => {
  return useAuthStore((state) => state.permissions);
};

export const useIsLoading = () => {
  return useAuthStore((state) => state.isLoading);
};

export const useIsInitialized = () => {
  return useAuthStore((state) => state.isInitialized);
};

export const useHasModule = (moduleCode: string) => {
  const modules = useModules();
  return modules.some((module) => module.moduleCode === moduleCode && module.enabled);
};

export const useHasPermission = (permission: string) => {
  const permissions = usePermissions();
  return permissions.includes(permission);
};

export const useClearUser = () => {
  return useAuthStore((state) => state.clearUser);
};
