import NepaliDate from "nepali-date-converter";
import { addDays, format } from "date-fns";

/**
 * Nepali (Bikram Sambat) date parts.
 * `month` is 0-based: Baisakh = 0 … Chaitra = 11 (matches nepali-date-converter).
 */
export interface NepaliDateParts {
  year: number;
  month: number;
  day: number;
}

/** Devanagari digits ०–९ (index = the Arabic digit). */
export const NEPALI_DIGITS = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"] as const;

/** Convert a number or digit-string to Nepali (Devanagari) numerals, e.g. 2083 -> "२०८३". */
export const toNepaliDigits = (value: number | string): string =>
  String(value)
    .split("")
    .map((ch) => (/\d/.test(ch) ? NEPALI_DIGITS[Number(ch)] : ch))
    .join("");

/** Full Nepali month names in Devanagari (Baisakh … Chaitra). */
export const NEPALI_MONTH_NAMES = [
  "वैशाख",
  "जेठ",
  "असार",
  "श्रावण",
  "भदौ",
  "असोज",
  "कात्तिक",
  "मंसिर",
  "पुष",
  "माघ",
  "फाल्गुन",
  "चैत",
] as const;

/** Full Nepali weekday names in Devanagari. Index 0 = Sunday (same order as the calendar grids). */
export const NEPALI_WEEKDAY_NAMES = [
  "आइतबार",
  "सोमबार",
  "मंगलबार",
  "बुधबार",
  "बिहिबार",
  "शुक्रबार",
  "शनिबार",
] as const;

/** Short Nepali weekday labels in Devanagari, used for calendar column headers. */
export const NEPALI_WEEKDAY_SHORT = [
  "आइत",
  "सोम",
  "मंगल",
  "बुध",
  "बिहि",
  "शुक्र",
  "शनि",
] as const;

/**
 * Font stack for Nepali-script text. The app body font (Poppins) covers Devanagari but
 * draws its digits with Latin-like shapes, so numerals must render in a dedicated
 * Devanagari font (Noto Sans Devanagari, with Windows system fallbacks) instead.
 */
export const NEPALI_FONT_STACK =
  '"Noto Sans Devanagari", "Nirmala UI", "Mangal", "Poppins", sans-serif';

const MS_PER_DAY = 86_400_000;

/**
 * Parse an API `yyyy-MM-dd` string as a LOCAL date.
 * (Using `new Date("yyyy-MM-dd")` would parse as UTC midnight and shift a day
 * in negative-offset timezones.)
 */
export const parseApiDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};

/** Format a date as the `yyyy-MM-dd` string the backend APIs expect (local time). */
export const formatApiDate = (date: Date): string => format(date, "yyyy-MM-dd");

/** Convert a Gregorian/AD (JS Date) to Nepali BS parts. */
export const gregorianToNepali = (date: Date): NepaliDateParts => {
  const nepali = NepaliDate.fromAD(date);
  return { year: nepali.getYear(), month: nepali.getMonth(), day: nepali.getDate() };
};

/** Convert Nepali BS parts to a Gregorian/AD (JS Date, local midnight). */
export const nepaliToGregorian = (parts: NepaliDateParts): Date =>
  new NepaliDate(parts.year, parts.month, parts.day).toJsDate();

/** Number of days in a Nepali month (month 0-11). */
export const getNepaliDaysInMonth = (year: number, month: number): number => {
  const start = nepaliToGregorian({ year, month, day: 1 }).getTime();
  const nextYear = month === 11 ? year + 1 : year;
  const nextMonth = (month + 1) % 12;
  const end = nepaliToGregorian({ year: nextYear, month: nextMonth, day: 1 }).getTime();
  return Math.round((end - start) / MS_PER_DAY);
};

/** Gregorian date of the first day of a Nepali month. */
export const getNepaliMonthStart = (year: number, month: number): Date =>
  nepaliToGregorian({ year, month, day: 1 });

/** Gregorian date of the last day of a Nepali month. */
export const getNepaliMonthEnd = (year: number, month: number): Date =>
  nepaliToGregorian({ year, month, day: getNepaliDaysInMonth(year, month) });

/** Add a number of days to a Nepali date (BS arithmetic through AD). */
export const addNepaliDays = (parts: NepaliDateParts, days: number): NepaliDateParts =>
  gregorianToNepali(addDays(nepaliToGregorian(parts), days));

/** Shift a Nepali date by whole months, clamping the day to the target month length. */
export const shiftNepaliMonth = (parts: NepaliDateParts, delta: number): NepaliDateParts => {
  const total = parts.month + delta;
  const year = parts.year + Math.floor(total / 12);
  const month = ((total % 12) + 12) % 12;
  return { year, month, day: Math.min(parts.day, getNepaliDaysInMonth(year, month)) };
};

/** Sunday of the week (Sun–Sat) containing the given Nepali date. */
export const getNepaliWeekStart = (parts: NepaliDateParts): NepaliDateParts =>
  addNepaliDays(parts, -nepaliToGregorian(parts).getDay());

/** Weekday index of a Nepali date (0 = Sunday … 6 = Saturday). */
export const getNepaliWeekday = (parts: NepaliDateParts): number =>
  nepaliToGregorian(parts).getDay();

/** e.g. "सोमबार, २५ श्रावण २०८३". */
export const formatNepaliDate = (parts: NepaliDateParts): string =>
  `${NEPALI_WEEKDAY_NAMES[getNepaliWeekday(parts)]}, ${toNepaliDigits(parts.day)} ${NEPALI_MONTH_NAMES[parts.month]} ${toNepaliDigits(parts.year)}`;

/** e.g. "श्रावण २०८३". */
export const formatNepaliMonthYear = (year: number, month: number): string =>
  `${NEPALI_MONTH_NAMES[month]} ${toNepaliDigits(year)}`;

/** e.g. "२४ – ३० श्रावण २०८३" or "२५ श्रावण – १ भदौ २०८३". */
export const formatNepaliDateRange = (start: NepaliDateParts, end: NepaliDateParts): string => {
  if (start.year === end.year && start.month === end.month) {
    return `${toNepaliDigits(start.day)} – ${toNepaliDigits(end.day)} ${NEPALI_MONTH_NAMES[start.month]} ${toNepaliDigits(start.year)}`;
  }
  if (start.year === end.year) {
    return `${toNepaliDigits(start.day)} ${NEPALI_MONTH_NAMES[start.month]} – ${toNepaliDigits(end.day)} ${NEPALI_MONTH_NAMES[end.month]} ${toNepaliDigits(end.year)}`;
  }
  return `${toNepaliDigits(start.day)} ${NEPALI_MONTH_NAMES[start.month]} ${toNepaliDigits(start.year)} – ${toNepaliDigits(end.day)} ${NEPALI_MONTH_NAMES[end.month]} ${toNepaliDigits(end.year)}`;
};

/**
 * Compact Gregorian month range for a period, e.g. "Jul–Aug 2026" or "Jul 2026".
 * Used as the secondary label under the Nepali header.
 */
export const formatGregorianMonthRange = (start: Date, end: Date): string => {
  if (start.getFullYear() === end.getFullYear()) {
    if (start.getMonth() === end.getMonth()) {
      return `${format(start, "MMM")} ${start.getFullYear()}`;
    }
    return `${format(start, "MMM")}–${format(end, "MMM")} ${start.getFullYear()}`;
  }
  return `${format(start, "MMM")} ${start.getFullYear()} – ${format(end, "MMM")} ${end.getFullYear()}`;
};

/** Stable key for grouping/mapping Nepali dates, e.g. "2083-3-25". */
export const nepaliDateKey = (parts: NepaliDateParts): string =>
  `${parts.year}-${parts.month}-${parts.day}`;

/** Whether two Nepali dates (or nulls) represent the same day. */
export const isSameNepaliDate = (
  a: NepaliDateParts | null | undefined,
  b: NepaliDateParts | null | undefined
): boolean =>
  !!a && !!b && a.year === b.year && a.month === b.month && a.day === b.day;
