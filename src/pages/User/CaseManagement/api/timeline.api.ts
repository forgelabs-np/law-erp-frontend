import { useQuery } from "@tanstack/react-query";

import { api } from "@/shared/service/service-api";
import { LawFirmCRMClient } from "@/shared/service/service-axios";
import { ApiResponse } from "@/shared/types/response";

import { TimelineEvent } from "../types/case.types";

export type { TimelineEvent };

const getCaseTimeline = async (caseNumber: string) => {
  return LawFirmCRMClient.get<ApiResponse<TimelineEvent[]>>(
    api.CASE_MANAGEMENT.GET_TIMELINE.replace("{caseNumber}", caseNumber)
  );
};

export const useGetCaseTimelineQuery = (caseNumber: string) => {
  return useQuery({
    queryKey: ["case-timeline", caseNumber],
    enabled: !!caseNumber,
    queryFn: () => getCaseTimeline(caseNumber),
    select: (response) => response?.data?.data,
  });
};
