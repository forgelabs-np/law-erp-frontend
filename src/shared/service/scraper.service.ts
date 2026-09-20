import { LawFirmCRMClient } from "./service-axios";
import { api } from "./service-api";
import {
  ApiResponse,
  CaseHearingStatus,
  Court,
  CourtType,
  ScrapeResult,
  HearingExportResult,
} from "../types/scraper.types";

// ============================================================
// Case Hearing Status
// ============================================================

export const getCaseHearingStatus = async (caseNoInternal: string) => {
  return LawFirmCRMClient.get<ApiResponse<CaseHearingStatus>>(
    api.SCRAPER.CASE_HEARING_STATUS.replace("{caseNoInternal}", caseNoInternal)
  );
};

// ============================================================
// Admin Manual Scrape
// ============================================================

export const manualScrape = async (courtId: number, dateBs: string) => {
  return LawFirmCRMClient.post<ApiResponse<ScrapeResult>>(
    api.SCRAPER.ADMIN_SCRAPE,
    null,
    {
      params: {
        courtId,
        date: dateBs,
      },
    }
  );
};

// ============================================================
// Admin Weekly CSV Export
// ============================================================

export const generateWeeklyExport = async () => {
  return LawFirmCRMClient.post<ApiResponse<HearingExportResult>>(
    api.SCRAPER.ADMIN_EXPORT,
    {},
    {
      responseType: "blob",
    }
  );
};

// ============================================================
// Courts
// ============================================================

export const getAllCourts = async () => {
  return LawFirmCRMClient.get<ApiResponse<Court[]>>(api.SCRAPER.ALL_COURTS);
};

export const getCourtsByType = async (courtType: CourtType) => {
  return LawFirmCRMClient.get<ApiResponse<Court[]>>(
    api.SCRAPER.COURTS_BY_TYPE.replace("{courtType}", courtType)
  );
};
