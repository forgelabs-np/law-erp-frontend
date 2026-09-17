import { LawFirmCRMClient } from "./service-axios";
import { api } from "./service-api";
import { ApiResponse } from "../types/response";
import {
  Province,
  District,
  CacheStats,
} from "../types/masterData.types";

// ============================================================
// Refresh Master Data Cache
// ============================================================

export const refreshMasterDataCache = async () => {
  return LawFirmCRMClient.post<ApiResponse<Record<string, string>>>(
    api.MASTER_DATA.REFRESH_CACHE
  );
};

// ============================================================
// Get All Provinces
// ============================================================

export const getProvinces = async () => {
  return LawFirmCRMClient.get<ApiResponse<Province[]>>(
    api.MASTER_DATA.PROVINCES
  );
};

// ============================================================
// Get Districts by Province
// ============================================================

export const getDistrictsByProvince = async (provinceId: string) => {
  return LawFirmCRMClient.get<ApiResponse<District[]>>(
    api.MASTER_DATA.DISTRICTS_BY_PROVINCE.replace("{provinceId}", provinceId)
  );
};

// ============================================================
// Get All Districts
// ============================================================

export const getDistricts = async () => {
  return LawFirmCRMClient.get<ApiResponse<District[]>>(
    api.MASTER_DATA.DISTRICTS
  );
};

// ============================================================
// Get Master Data Cache Stats
// ============================================================

export const getMasterDataCacheStats = async () => {
  return LawFirmCRMClient.get<ApiResponse<CacheStats>>(
    api.MASTER_DATA.CACHE_STATS
  );
};
