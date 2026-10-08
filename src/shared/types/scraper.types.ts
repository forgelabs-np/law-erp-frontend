/**
 * Types for the Supreme Court Hearing Scraper module
 */

// ============================================================
// API Response Wrapper
// ============================================================

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  responseCode?: number;
  data: T;
}

// ============================================================
// Hearing Record
// ============================================================

export type HearingSource = "DAILY" | "WEEKLY";

export interface HearingRecord {
  hearingDateAd: string;
  hearingDateBs: string;
  judgeName: string;
  subject: string;
  orderType: string;
  source: HearingSource;
}

// ============================================================
// Case Hearing Status
// ============================================================

export interface CaseHearingStatus {
  caseNoInternal: string;
  caseNoBs: string;
  courtId: number;
  courtName: string;
  upcoming: HearingRecord[];
  history: HearingRecord[];
}

// ============================================================
// Scrape Result
// ============================================================

export interface ScrapeResult {
  courtId: number;
  success: boolean;
  rows: number;
  error: string | null;
}

// ============================================================
// Export Result
// ============================================================

export type HearingExportResult = string;

// ============================================================
// Court
// ============================================================

export type CourtType = "DISTRICT" | "HIGH_COURT" | "SUPREME_COURT";

export interface Court {
  courtId: number;
  courtNameNepali: string;
  courtNameEnglish: string;
  courtType: CourtType;
  isActive: boolean;
}
