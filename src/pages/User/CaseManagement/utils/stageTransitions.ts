import { CaseStage, CaseType } from "../types/case.types";

// Civil lifecycle transitions
const CIVIL_TRANSITIONS: Record<CaseStage, CaseStage[]> = {
  FILED: ["UNDER_SUMMONS", "CLOSED"],
  UNDER_SUMMONS: ["RESPONSE_PENDING", "CLOSED"],
  RESPONSE_PENDING: ["MEDIATION", "CLOSED"],
  MEDIATION: ["EVIDENCE", "CLOSED"],
  EVIDENCE: ["ARGUMENT", "CLOSED"],
  ARGUMENT: ["JUDGMENT_AWAITED", "CLOSED"],
  JUDGMENT_AWAITED: ["JUDGMENT_DELIVERED", "CLOSED"],
  JUDGMENT_DELIVERED: ["APPEAL", "EXECUTION", "CLOSED"],
  APPEAL: ["EXECUTION", "CLOSED"],
  EXECUTION: ["CLOSED"],
  CLOSED: [],
  // Criminal stages not applicable for civil
  FIR_REGISTERED: [],
  UNDER_INVESTIGATION: [],
  CHARGE_SHEET_FILED: [],
  PLEA: [],
  TRIAL: [],
  SENTENCING: [],
};

// Criminal lifecycle transitions
const CRIMINAL_TRANSITIONS: Record<CaseStage, CaseStage[]> = {
  FIR_REGISTERED: ["UNDER_INVESTIGATION", "CLOSED"],
  UNDER_INVESTIGATION: ["CHARGE_SHEET_FILED", "CLOSED"],
  CHARGE_SHEET_FILED: ["PLEA", "CLOSED"],
  PLEA: ["TRIAL", "CLOSED"],
  TRIAL: ["JUDGMENT_AWAITED", "CLOSED"],
  JUDGMENT_AWAITED: ["JUDGMENT_DELIVERED", "CLOSED"],
  JUDGMENT_DELIVERED: ["APPEAL", "SENTENCING", "CLOSED"],
  APPEAL: ["SENTENCING", "CLOSED"],
  SENTENCING: ["CLOSED"],
  CLOSED: [],
  // Civil stages not applicable for criminal
  FILED: [],
  UNDER_SUMMONS: [],
  RESPONSE_PENDING: [],
  MEDIATION: [],
  EVIDENCE: [],
  ARGUMENT: [],
  EXECUTION: [],
};

/**
 * Get the allowed next stages for a given current stage and case type.
 * This is used to populate the stage transition dropdown with only valid options.
 *
 * @param currentStage - The current stage of the case
 * @param caseType - The type of case (CIVIL or CRIMINAL)
 * @returns Array of valid next stages
 */
export const getNextStages = (
  currentStage: CaseStage,
  caseType: CaseType
): CaseStage[] => {
  const transitions =
    caseType === "CIVIL" ? CIVIL_TRANSITIONS : CRIMINAL_TRANSITIONS;
  return transitions[currentStage] || [];
};

/**
 * Check if a stage transition is valid.
 *
 * @param fromStage - The current stage
 * @param toStage - The target stage
 * @param caseType - The type of case
 * @returns true if the transition is valid
 */
export const isValidTransition = (
  fromStage: CaseStage,
  toStage: CaseStage,
  caseType: CaseType
): boolean => {
  const allowedNextStages = getNextStages(fromStage, caseType);
  return allowedNextStages.includes(toStage);
};

/**
 * Get the initial stage for a new case based on its type.
 *
 * @param caseType - The type of case
 * @returns The initial stage
 */
export const getInitialStage = (caseType: CaseType): CaseStage => {
  return caseType === "CIVIL" ? "FILED" : "FIR_REGISTERED";
};

/**
 * Get all stages for a given case type (for filter dropdowns).
 *
 * @param caseType - The type of case
 * @returns Array of all applicable stages
 */
export const getAllStages = (caseType?: CaseType): CaseStage[] => {
  if (caseType === "CIVIL") {
    return [
      "FILED",
      "UNDER_SUMMONS",
      "RESPONSE_PENDING",
      "MEDIATION",
      "EVIDENCE",
      "ARGUMENT",
      "JUDGMENT_AWAITED",
      "JUDGMENT_DELIVERED",
      "APPEAL",
      "EXECUTION",
      "CLOSED",
    ];
  }
  if (caseType === "CRIMINAL") {
    return [
      "FIR_REGISTERED",
      "UNDER_INVESTIGATION",
      "CHARGE_SHEET_FILED",
      "PLEA",
      "TRIAL",
      "JUDGMENT_AWAITED",
      "JUDGMENT_DELIVERED",
      "APPEAL",
      "SENTENCING",
      "CLOSED",
    ];
  }
  // Return all stages if no type specified
  return [
    "FILED",
    "UNDER_SUMMONS",
    "RESPONSE_PENDING",
    "MEDIATION",
    "EVIDENCE",
    "ARGUMENT",
    "JUDGMENT_AWAITED",
    "JUDGMENT_DELIVERED",
    "APPEAL",
    "EXECUTION",
    "CLOSED",
    "FIR_REGISTERED",
    "UNDER_INVESTIGATION",
    "CHARGE_SHEET_FILED",
    "PLEA",
    "TRIAL",
    "SENTENCING",
  ];
};
