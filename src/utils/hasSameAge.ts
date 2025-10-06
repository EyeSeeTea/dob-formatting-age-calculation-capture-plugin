import { calculateAge } from "./calculateAge";

export function hasSameAge(date1: string, date2: string): boolean {
  return calculateAge(date1) === calculateAge(date2);
}
