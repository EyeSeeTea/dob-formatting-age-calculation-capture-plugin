import { calculateAgeInMonths } from "../utils/calculateAgeInMonths";
import { mockCurrentDate } from "./testUtils";

describe("calculateAgeInMonths", () => {
  const dateMock = mockCurrentDate("2025-05-12T00:00:00Z");

  beforeAll(() => {
    dateMock.setup();
  });

  afterAll(() => {
    dateMock.teardown();
  });

  it("should return the correct age in months for exact year anniversaries", () => {
    expect(calculateAgeInMonths("2024-05-12")).toBe(12);
    expect(calculateAgeInMonths("2023-05-12")).toBe(24);
    expect(calculateAgeInMonths("2022-05-12")).toBe(36);
  });

  it("should return 0 for dates in the same month or in the future", () => {
    expect(calculateAgeInMonths("2025-05-01")).toBe(0);
    expect(calculateAgeInMonths("2025-05-11")).toBe(0);
    expect(calculateAgeInMonths("2025-05-13")).toBe(0);
    expect(calculateAgeInMonths("2027-01-01")).toBe(0);
    expect(calculateAgeInMonths("2024-05-13")).toBe(11); // 11 months ago + 1 day
  });

  it("should return the correct age in months for different months", () => {
    expect(calculateAgeInMonths("2025-04-12")).toBe(1);
    expect(calculateAgeInMonths("2025-03-12")).toBe(2);
    expect(calculateAgeInMonths("2025-01-12")).toBe(4);
    expect(calculateAgeInMonths("2024-12-12")).toBe(5);
    expect(calculateAgeInMonths("2025-04-01")).toBe(1); // ~1 month ago
    expect(calculateAgeInMonths("2025-03-01")).toBe(2); // ~2 months ago
  });

  it("should handle cross-year calculations correctly", () => {
    expect(calculateAgeInMonths("2024-05-11")).toBe(12); // 1 year + 1 day
    expect(calculateAgeInMonths("2024-01-12")).toBe(16); // 1 year + 4 months
    expect(calculateAgeInMonths("2023-12-12")).toBe(17); // 1 year + 5 months
    expect(calculateAgeInMonths("2000-05-12")).toBe(25 * 12); // 25 years = 300 months
    expect(calculateAgeInMonths("1990-01-01")).toBe(35 * 12 + 4); // ~35 years + 4 months
  });

  it("should handle leap years correctly", () => {
    expect(calculateAgeInMonths("2024-02-29")).toBe(14); // From Feb 29, 2024 to May 12, 2025 = 14 months
  });

  it("should handle day adjustments correctly", () => {
    expect(calculateAgeInMonths("2025-04-10")).toBe(1); // Same month, past day -> 1 month
    expect(calculateAgeInMonths("2024-06-15")).toBe(10); // Future day in birth month -> 10 months
    expect(calculateAgeInMonths("2024-06-10")).toBe(11); // Past day in birth month -> 11 months
  });
});
