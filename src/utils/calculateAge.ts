/**
 * Calculates the age based on a given date string.
 *
 * @param dateString - The date of birth in string format (e.g., "YYYY-MM-DD").
 * @returns The calculated age as a number.
 *
 */
export function calculateAge(dateString: string): number {
  const today = new Date();
  const birthDate = new Date(dateString);

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  // Adjust age if the current month and day are before the birth month and day
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}
