import { DateFormat } from "../DateFormat";

export function formatDate(
  format: DateFormat,
  dateString: string
): string | null {
  const formatters = {
    [DateFormat.YYYYMMDD]: formatDateYYYYMMDD,
    [DateFormat.MMDDYYYY]: formatDateMMDDYYYY,
  };
  return formatters[format](dateString);
}

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
export function formatDateYYYYMMDD(dateString: string): string | null {
  if (/^\d{8}$/.test(dateString)) {
    const year = dateString.slice(0, 4);
    const month = dateString.slice(4, 6);
    const day = dateString.slice(6, 8);
    dateString = `${year}-${month}-${day}`;
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return null;
  }
  const date = new Date(dateString);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return null;
  }

  return dateString;
}

/**
 * Validates and formats a date string.
 *
 * - If the input is in MMDDYYYY or MM-DD-YYYY format, it converts it to YYYY-MM-DD.
 * - If the input is in YYYY-MM-DD format, it validates and returns it as is.
 * - Returns null if the date is invalid
 *
 * @param dateString - The input date string to validate and format.
 * @returns The formatted date string in YYYY-MM-DD format, or null if invalid.
 */
export function formatDateMMDDYYYY(dateString: string): string | null {
  // Check if the input is in MMDDYYYY format
  if (/^\d{8}$/.test(dateString)) {
    const month = dateString.slice(0, 2);
    const day = dateString.slice(2, 4);
    const year = dateString.slice(4, 8);
    dateString = `${year}-${month}-${day}`;
  } else if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
    const [month, day, year] = dateString.split("-");
    dateString = `${year}-${month}-${day}`;
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return null;
  }

  const date = new Date(dateString);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return null;
  }

  return dateString;
}
