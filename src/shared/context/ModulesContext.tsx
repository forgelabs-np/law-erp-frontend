import React, { createContext, useContext, ReactNode } from "react";


import { InitApiResponse } from "@/api/modules";
import { useModules } from "@/shared/hooks/useModules";
import { SidebarItemProps } from "@/shared/types";

interface ModulesContextType {
  sidebarItems: SidebarItemProps[];
  moduleData: InitApiResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  hasPermission: (moduleCode: string, scopes?: string[]) => boolean;
}

const ModulesContext = createContext<ModulesContextType | undefined>(undefined);

export const ModulesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const modules = useModules();

  const hasPermission = (moduleCode: string, scopeCodes?: string[]): boolean => {
    if (!modules.moduleData) return false;

    const module = modules.moduleData.modules.find((m) => m.code === moduleCode);
    if (!module) return false;

    // If no specific scopes required, just check module exists and is active
    if (!scopeCodes || scopeCodes.length === 0) {
      return module.active;
    }

    // Check if all required scopes are available in the module
    const moduleScopes = module.scopes.map((s) => s.code);
    return scopeCodes.every((scope) => moduleScopes.includes(scope));
  };

  return (
    <ModulesContext.Provider value={{ ...modules, hasPermission }}>
      {children}
    </ModulesContext.Provider>
  );
};

export const useModulesContext = (): ModulesContextType => {
  const context = useContext(ModulesContext);
  if (!context) {
    throw new Error("useModulesContext must be used within ModulesProvider");
  }
  return context;
};
