import { calculateAge } from "../utils/calculateAge";
import { mockCurrentDate } from "./testUtils";

describe("calculateAge", () => {
  const dateMock = mockCurrentDate("2025-05-12T00:00:00Z");

  beforeAll(() => {
    dateMock.setup();
  });

  afterAll(() => {
    dateMock.teardown();
  });

  it("should return the correct age for a past date", () => {
    expect(calculateAge("2000-05-12")).toBe(25);
    expect(calculateAge("2024-05-12")).toBe(1);
  });

  it("should return the correct age for a date later in the year", () => {
    const dateString = "2000-12-31"; // Not yet 25 on 2025-05-12
    expect(calculateAge(dateString)).toBe(24);
    expect(calculateAge("2024-05-13")).toBe(0);
  });

  it("should return the correct age for a date earlier in the year", () => {
    const dateString = "2000-01-01"; // Already 25 on 2025-05-12
    expect(calculateAge(dateString)).toBe(25);
    expect(calculateAge("1989-04-13")).toBe(36);
  });

  it("should handle leap years correctly", () => {
    const dateString = "2004-02-29"; // Leap year birthday
    expect(calculateAge(dateString)).toBe(21); // 2025-05-12
  });
});
