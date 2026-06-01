import { useEffect, useState, useCallback } from "react";

import { mapModulesToSidebarItems } from "@/api/moduleMapper";
import { InitApiResponse, initModules } from "@/api/modules";
import { SidebarItemProps } from "@/shared/types";

interface UseModulesState {
  sidebarItems: SidebarItemProps[];
  moduleData: InitApiResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Cache key for localStorage
const MODULES_CACHE_KEY = "app_modules_cache";
const MODULES_CACHE_TTL_KEY = "app_modules_cache_ttl";
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

const getCachedModules = (): InitApiResponse | null => {
  try {
    const cached = localStorage.getItem(MODULES_CACHE_KEY);
    const cachedTime = localStorage.getItem(MODULES_CACHE_TTL_KEY);

    if (!cached || !cachedTime) {
      return null;
    }

    const cacheAge = Date.now() - parseInt(cachedTime, 10);
    if (cacheAge > CACHE_DURATION_MS) {
      localStorage.removeItem(MODULES_CACHE_KEY);
      localStorage.removeItem(MODULES_CACHE_TTL_KEY);
      return null;
    }

    return JSON.parse(cached);
  } catch {
    return null;
  }
};

const setCachedModules = (data: InitApiResponse): void => {
  try {
    localStorage.setItem(MODULES_CACHE_KEY, JSON.stringify(data));
    localStorage.setItem(MODULES_CACHE_TTL_KEY, Date.now().toString());
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Failed to cache modules:", err);
  }
};

export const useModules = (): UseModulesState => {
  const [sidebarItems, setSidebarItems] = useState<SidebarItemProps[]>([]);
  const [moduleData, setModuleData] = useState<InitApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchModules = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cached = getCachedModules();
      if (cached) {
        setModuleData(cached);
        setSidebarItems(mapModulesToSidebarItems(cached.modules));
        setLoading(false);
        return;
      }

      // Fetch from API if not cached
      const data = await initModules();
      setModuleData(data);
      setSidebarItems(mapModulesToSidebarItems(data.modules));

      // Cache the result
      setCachedModules(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch modules";
      setError(errorMessage);
      // eslint-disable-next-line no-console
      console.error("Error fetching modules:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  return {
    sidebarItems,
    moduleData,
    loading,
    error,
    refetch: fetchModules,
  };
};

// Helper hook to clear cache (useful for testing and manual refresh)
export const useClearModulesCache = (): (() => void) => {
  return useCallback(() => {
    try {
      localStorage.removeItem(MODULES_CACHE_KEY);
      localStorage.removeItem(MODULES_CACHE_TTL_KEY);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to clear modules cache:", err);
    }
  }, []);
};
