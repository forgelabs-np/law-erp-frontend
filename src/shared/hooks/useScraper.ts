import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import {
  getCaseHearingStatus,
  manualScrape,
  generateWeeklyExport,
  getAllCourts,
  getCourtsByType,
} from "../service/scraper.service";
import { ApiErrorResponse } from "../types/response";
import { toastFail, toastSuccess } from "../toast";
import { CourtType, ScrapeResult } from "../types/scraper.types";

// ============================================================
// Query keys
// ============================================================

export const scraperKeys = {
  allCourts: ["scraper", "courts"] as const,
  courtsByType: (courtType: CourtType) =>
    ["scraper", "courts", courtType] as const,
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
// Courts
// ============================================================

export const useAllCourtsQuery = () => {
  return useQuery({
    queryKey: scraperKeys.allCourts,
    queryFn: () => getAllCourts(),
    select: (response) => response?.data?.data,
  });
};

export const useCourtsByTypeQuery = (courtType: CourtType | null) => {
  return useQuery({
    queryKey: scraperKeys.courtsByType(courtType ?? "DISTRICT"),
    queryFn: () => getCourtsByType(courtType as CourtType),
    enabled: !!courtType,
    select: (response) => response?.data?.data,
  });
}; // ============================================================
// Admin Manual Scrape
// ============================================================

const MANUAL_SCRAPE_ERROR_MESSAGE = "Unable to update court data";

export interface ScrapeOutcome {
  type: "success" | "error";
  message: string;
}

/**
 * Single source of truth for the manual-scrape notification copy, so the
 * mutation and any caller that sequences its own notifications (the Court Sync
 * progress flow) cannot drift apart.
 */
export const getManualScrapeOutcome = (
  data: ScrapeResult | undefined
): ScrapeOutcome => {
  if (!data?.success) {
    return {
      type: "error",
      message: data?.error || MANUAL_SCRAPE_ERROR_MESSAGE,
    };
  }

  if (data.rows === 0) {
    return {
      type: "success",
      message: "No hearing records were published for this date",
    };
  }

  return {
    type: "success",
    message: `Court data updated successfully. ${data.rows} hearing records processed.`,
  };
};

export const notifyScrapeOutcome = ({ type, message }: ScrapeOutcome) => {
  if (type === "success") toastSuccess(message);
  else toastFail(message);
};

/**
 * A request abandoned on purpose (2-minute wait elapsed, page left, retry) is
 * not an API failure and must never surface as one.
 */
export const isRequestCanceled = (error: unknown) => {
  if (axios.isCancel(error)) return true;

  const candidate = error as { name?: string; code?: string } | null;
  return (
    candidate?.name === "AbortError" ||
    candidate?.name === "CanceledError" ||
    candidate?.code === "ERR_CANCELED"
  );
};

export interface ManualScrapeVariables {
  courtId: number;
  dateBs: string;
  /** Cancels the browser request when the caller's wait window elapses. */
  signal?: AbortSignal;
}

/**
 * @param options.notify
 *   `false` keeps the mutation purely as transport (query invalidation still
 *   runs) so the caller can show the outcome after its own completion
 *   animation. Defaults to `true` — the original behaviour.
 */
export const useManualScrape = (options?: { notify?: boolean }) => {
  const queryClient = useQueryClient();
  const notify = options?.notify ?? true;

  return useMutation({
    mutationFn: ({ courtId, dateBs, signal }: ManualScrapeVariables) =>
      manualScrape(courtId, dateBs, signal),
    onSuccess: (response) => {
      const data = response?.data?.data;

      if (data?.success) {
        // Invalidate hearing status queries for cases that might be affected
        queryClient.invalidateQueries({ queryKey: ["case-hearing-status"] });
      }

      if (!notify) return;
      notifyScrapeOutcome(getManualScrapeOutcome(data));
    },
    onError: (error: ApiErrorResponse) => {
      if (isRequestCanceled(error)) return;
      if (!notify) return;
      toastFail(MANUAL_SCRAPE_ERROR_MESSAGE);
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
