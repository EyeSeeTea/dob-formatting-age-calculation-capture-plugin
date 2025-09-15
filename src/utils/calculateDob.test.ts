import { calculateDob } from "./calculateDob";
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
