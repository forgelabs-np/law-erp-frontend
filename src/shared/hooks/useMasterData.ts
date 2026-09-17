import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  refreshMasterDataCache,
  getProvinces,
  getDistrictsByProvince,
  getDistricts,
  getMasterDataCacheStats,
} from "../service/masterData.service";
import { ApiErrorResponse } from "../types/response";
import { toastFail, toastSuccess } from "../toast";

// ============================================================
// Query keys
// ============================================================

export const masterDataKeys = {
  all: ["master-data"] as const,
  provinces: ["master-data", "provinces"] as const,
  districts: ["master-data", "districts"] as const,
  districtsByProvince: (provinceId: string) =>
    ["master-data", "districts", provinceId] as const,
  cacheStats: ["master-data", "cache-stats"] as const,
};

// ============================================================
// Get All Provinces
// ============================================================

export const useProvincesQuery = () => {
  return useQuery({
    queryKey: masterDataKeys.provinces,
    queryFn: () => getProvinces(),
    select: (response) => response?.data?.data,
  });
};

// ============================================================
// Get Districts by Province
// ============================================================

export const useDistrictsByProvinceQuery = (provinceId: string | null) => {
  return useQuery({
    queryKey: masterDataKeys.districtsByProvince(provinceId ?? ""),
    queryFn: () => getDistrictsByProvince(provinceId as string),
    enabled: !!provinceId,
    select: (response) => response?.data?.data,
  });
};

// ============================================================
// Get All Districts
// ============================================================

export const useDistrictsQuery = () => {
  return useQuery({
    queryKey: masterDataKeys.districts,
    queryFn: () => getDistricts(),
    select: (response) => response?.data?.data,
  });
};

// ============================================================
// Get Master Data Cache Stats
// ============================================================

export const useMasterDataCacheStatsQuery = () => {
  return useQuery({
    queryKey: masterDataKeys.cacheStats,
    queryFn: () => getMasterDataCacheStats(),
    select: (response) => response?.data?.data,
  });
};

// ============================================================
// Refresh Master Data Cache
// ============================================================

export const useRefreshMasterDataCacheMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => refreshMasterDataCache(),
    onSuccess: () => {
      toastSuccess("Master data cache refreshed successfully");
      // Invalidate all master-data queries
      queryClient.invalidateQueries({ queryKey: masterDataKeys.all });
    },
    onError: (_error: ApiErrorResponse) => {
      toastFail("Failed to refresh master data cache");
    },
  });
};
