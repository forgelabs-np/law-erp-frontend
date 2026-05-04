/** Normalize privilege to string[] - handles both array and JSON string */
export function normalizePrivilege(privilege?: string | string[]): string[] {
  if (!privilege) return [];
  if (Array.isArray(privilege)) {
    return privilege.filter((v): v is string => typeof v === "string");
  }
  try {
    const parsed = JSON.parse(privilege) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((v): v is string => typeof v === "string")
      : [];
  } catch {
    return [];
  }
}
