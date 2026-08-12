// Enums
export type HearingStatus =
  | "SCHEDULED"
  | "COMPLETED"
  | "CANCELLED"
  | "ADJOURNED";

export type HearingType =
  | "OTHER"
  | "STATUS_CONF"
  | "FIRST_HEARING"
  | "EVIDENCE"
  | "PLEA"
  | "JUDGMENT"
  | "ARGUMENT";

// Interfaces
export interface Hearing {
  id: string;
  caseId: string;
  caseNumber: string;
  title: string;
  date: string;
  time: string;
  endTime: string;
  courtRoom: string;
  judgeName: string;
  hearingType: HearingType;
  status: HearingStatus;
  outcome?: string;
  notes?: string;
  attendees?: string;
  advocateId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHearingRequest {
  caseNumber: string;
  title: string;
  date: string;
  time: string;
  endTime: string;
  courtRoom: string;
  judgeName?: string;
  hearingType: HearingType;
  notes?: string;
  attendees?: string;
  advocateId?: string;
}

export interface UpdateHearingRequest {
  title?: string;
  date?: string;
  time?: string;
  endTime?: string;
  courtRoom?: string;
  judgeName?: string;
  hearingType?: HearingType;
  status?: HearingStatus;
  outcome?: string;
  notes?: string;
  attendees?: string;
  advocateId?: string;
}

export interface HearingFilters {
  status?: HearingStatus;
  hearingType?: HearingType;
  advocateId?: string;
  judgeName?: string;
  courtRoom?: string;
  fromDate?: string;
  toDate?: string;
}
