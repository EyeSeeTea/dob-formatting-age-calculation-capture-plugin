/**
 * Calculates the date of birth given an age.
 * Returns January 1st of the year that makes the age valid.
 * E.g., if age is 22 and current year is 2025, returns 01/01/2003.
 */
export function calculateDob(age: number): Date {
  if (age < 0) {
    throw new Error("Age cannot be negative");
  }
  const currentYear = new Date().getFullYear();
  const birthYear = currentYear - age;
  return new Date(birthYear, 0, 1); // January 1st of the birth year
}
