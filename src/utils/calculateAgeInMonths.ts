/**
 * Calculates the age in months, based on a given date string.
 *
 * @param dateString - The date of birth in string format (e.g., "YYYY-MM-DD").
 * @returns The calculated age in months as a number.
 *
 */
export function calculateAgeInMonths(dateString: string): number {
  const today = new Date();
  const birthDate = new Date(dateString);
  if (birthDate > today) {
    return 0;
  }
  let months = (today.getFullYear() - birthDate.getFullYear()) * 12;
  months += today.getMonth() - birthDate.getMonth();

  // Adjust if the current day is before the birth day in the month
  if (today.getDate() < birthDate.getDate()) {
    months--;
  }

  return Math.max(0, months);
}
