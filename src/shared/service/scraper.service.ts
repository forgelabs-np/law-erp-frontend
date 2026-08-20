import { LawFirmCRMClient } from "./service-axios";
import { api } from "./service-api";
import { ApiResponse, CaseHearingStatus, ScrapeResult, HearingExportResult } from "../types/scraper.types";

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
      responseType: 'blob',
    }
  );
};
