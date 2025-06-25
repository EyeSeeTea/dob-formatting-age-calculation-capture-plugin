import { dateToString } from "./dateToString";

describe("dateToString", () => {
  it("should format a valid date as YYYY-MM-DD", () => {
    expect(dateToString(new Date(2025, 0, 1))).toBe("2025-01-01");
    expect(dateToString(new Date(2025, 11, 31))).toBe("2025-12-31");
    expect(dateToString(new Date(1999, 8, 9))).toBe("1999-09-09");
  });

  it("should return an empty string for invalid dates", () => {
    expect(dateToString(new Date("invalid"))).toBe("");
    expect(dateToString(undefined as any)).toBe("");
    expect(dateToString(null as any)).toBe("");
    expect(dateToString({} as any)).toBe("");
  });
});
