import { CaseType } from "../types/case.types";

/**
 * Civil-only field names
 */
const CIVIL_FIELDS = [
  "mediationDate",
  "mediationOutcome",
  "writtenStatementDeadline",
] as const;

/**
 * Criminal-only field names
 */
const CRIMINAL_FIELDS = [
  "firNumber",
  "firDate",
  "policeStation",
  "investigationAuthority",
  "arrestDate",
  "chargeSheetDate",
  "bailStatus",
] as const;

/**
 * Check if a field is visible for a given case type.
 *
 * @param fieldName - The field name to check
 * @param caseType - The case type
 * @returns true if the field should be visible
 */
export const isFieldVisible = (
  fieldName: string,
  caseType?: CaseType
): boolean => {
  if (!caseType) return true; // Show all fields if type not specified

  if (CIVIL_FIELDS.includes(fieldName as any)) {
    return caseType === "CIVIL";
  }

  if (CRIMINAL_FIELDS.includes(fieldName as any)) {
    return caseType === "CRIMINAL";
  }

  return true; // Common fields are always visible
};

/**
 * Get all civil-only field names.
 */
export const getCivilFields = () => CIVIL_FIELDS;

/**
 * Get all criminal-only field names.
 */
export const getCriminalFields = () => CRIMINAL_FIELDS;

/**
 * Get the party type labels based on case type.
 *
 * @param caseType - The case type
 * @returns Array of party type labels to show
 */
export const getPartyTypesForCaseType = (caseType: CaseType): string[] => {
  if (caseType === "CIVIL") {
    return ["PLAINTIFF", "DEFENDANT"];
  }
  if (caseType === "CRIMINAL") {
    return ["ACCUSED", "APPELLANT", "RESPONDENT", "APPLICANT"];
  }
  return [];
};

/**
 * Get the default party type for a case type (used in forms).
 *
 * @param caseType - The case type
 * @returns The default party type
 */
export const getDefaultPartyType = (caseType: CaseType): string => {
  return caseType === "CIVIL" ? "PLAINTIFF" : "ACCUSED";
};
