import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getCaseHearingStatus,
  manualScrape,
  generateWeeklyExport,
} from "../service/scraper.service";
import { ApiErrorResponse, ApiResponse } from "../types/response";
import { toastFail, toastSuccess } from "../toast";
import {
  CaseHearingStatus,
  ScrapeResult,
  HearingExportResult,
} from "../types/scraper.types";

// ============================================================
// Query keys
// ============================================================

export const scraperKeys = {
  caseHearingStatus: (caseNoInternal: string) =>
    ["case-hearing-status", caseNoInternal] as const,
};

// ============================================================
// Case Hearing Status
// ============================================================

export const useCaseHearingStatus = (caseNoInternal: string) => {
  return useQuery({
    queryKey: scraperKeys.caseHearingStatus(caseNoInternal),
    enabled: !!caseNoInternal,
    queryFn: () => getCaseHearingStatus(caseNoInternal),
    select: (response) => response?.data?.data,
  });
};

// ============================================================
// Admin Manual Scrape
// ============================================================

export const useManualScrape = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courtId, dateBs }: { courtId: number; dateBs: string }) =>
      manualScrape(courtId, dateBs),
    onSuccess: (response) => {
      const data = response?.data?.data;
      if (data?.success) {
        if (data.rows === 0) {
          toastSuccess("No hearing records were published for this date");
        } else {
          toastSuccess(
            `Court data updated successfully. ${data.rows} hearing records processed.`
          );
        }
        // Invalidate hearing status queries for cases that might be affected
        queryClient.invalidateQueries({ queryKey: ["case-hearing-status"] });
      } else {
        toastFail(data?.error || "Unable to update court data");
      }
    },
    onError: (error: ApiErrorResponse) => {
      toastFail("Unable to update court data");
    },
  });
};

// ============================================================
// Admin Weekly Export
// ============================================================

export const useGenerateWeeklyExport = () => {
  return useMutation({
    mutationFn: () => generateWeeklyExport(),
    onSuccess: (response) => {
      // Handle Blob response for file download
      const blob = response.data as any;
      if (blob instanceof Blob) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "weekly-hearing-snapshot.csv";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toastSuccess("Weekly hearing report generated successfully");
      } else {
        toastSuccess("Weekly snapshot generated successfully");
      }
    },
    onError: (error: ApiErrorResponse) => {
      toastFail("Unable to generate weekly snapshot");
    },
  });
};
