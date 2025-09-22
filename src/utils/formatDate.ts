const YYYY_MM_DD_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Validates and formats a date string.
 *
 * - If the input is in YYYYMMDD format, it converts it to YYYY-MM-DD.
 * - If the input is in YYYY-MM-DD format, it validates and returns it as is.
 * - Returns null if the date is invalid
 *
 * @param dateString - The input date string to validate and format.
 * @returns The formatted date string in YYYY-MM-DD format, or null if invalid.
 */
export function formatDate(dateString: string): string | null {
  // Check if the input is in YYYYMMDD format
  if (/^\d{8}$/.test(dateString)) {
    const year = dateString.slice(0, 4);
    const month = dateString.slice(4, 6);
    const day = dateString.slice(6, 8);
    dateString = `${year}-${month}-${day}`;
  } else if (!YYYY_MM_DD_REGEX.test(dateString)) {
    return null;
  }
  if (!dateStringIsValid(dateString)) {
    return null;
  }
  return dateString;
}

/**
 * Checks if a date is valid (returns false for invalid dates like 2025-02-29 or 2025-04-31)
 * @param dateString - date in YYYY-MM-DD format
 */
function dateStringIsValid(dateString: string): boolean {
  const match = dateString.match(YYYY_MM_DD_REGEX);
  if (!match) {
    return false;
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    return false;
  }
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() + 1 === month &&
    date.getDate() === day
  );
}
