import { calculateDob, calculateDobFromAgeInMonths } from "./calculateDob";
import { mockCurrentDate } from "./testUtils";

describe("calculateDob", () => {
  const MOCK_DATE_NOW = "2025-06-24T00:00:00Z";
  const dateMock = mockCurrentDate(MOCK_DATE_NOW);

  beforeAll(() => {
    dateMock.setup();
  });

  afterAll(() => {
    dateMock.teardown();
  });

  it("should return January 1st of the correct birth year for a given age", () => {
    expect(calculateDob(22)).toEqual(new Date(2003, 0, 1));
    expect(calculateDob(0)).toEqual(new Date(2025, 0, 1));
    expect(calculateDob(1)).toEqual(new Date(2024, 0, 1));
    expect(calculateDob(100)).toEqual(new Date(1925, 0, 1));
  });

  it("should throw an error for negative ages", () => {
    expect(() => calculateDob(-1)).toThrow("Age cannot be negative");
    expect(() => calculateDob(-5)).toThrow("Age cannot be negative");
  });
});

describe("calculateDobFromAgeInMonths", () => {
  const MOCK_DATE_NOW = "2025-06-24T00:00:00Z";
  const dateMock = mockCurrentDate(MOCK_DATE_NOW);

  beforeAll(() => {
    dateMock.setup();
  });

  afterAll(() => {
    dateMock.teardown();
  });

  it("should return the correct birth date for a given age in months", () => {
    expect(calculateDobFromAgeInMonths(0)).toEqual(new Date(2025, 5, 1)); // June 1, 2025
    expect(calculateDobFromAgeInMonths(12)).toEqual(new Date(2024, 5, 1)); // June 1, 2024
    expect(calculateDobFromAgeInMonths(1)).toEqual(new Date(2025, 4, 1)); // May 1, 2025
  });

  it("should handle ages greater than 12 months correctly", () => {
    expect(calculateDobFromAgeInMonths(13)).toEqual(new Date(2024, 4, 1)); // May 1, 2024 (13 months ago)
    expect(calculateDobFromAgeInMonths(14)).toEqual(new Date(2024, 3, 1)); // Apr 1, 2024 (14 months ago)
    expect(calculateDobFromAgeInMonths(24)).toEqual(new Date(2023, 5, 1)); // June 1, 2023 (24 months ago)
    expect(calculateDobFromAgeInMonths(25)).toEqual(new Date(2023, 4, 1)); // May 1, 2023 (25 months ago)
    expect(calculateDobFromAgeInMonths(36)).toEqual(new Date(2022, 5, 1)); // June 1, 2022 (36 months ago)
  });

  it("should throw an error for negative ages in months", () => {
    expect(() => calculateDobFromAgeInMonths(-1)).toThrow(
      "Age in months cannot be negative"
    );
    expect(() => calculateDobFromAgeInMonths(-5)).toThrow(
      "Age in months cannot be negative"
    );
  });
});
