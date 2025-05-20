import { formatDate } from "../utils/formatDate";

describe("formatDate", () => {
  it("should return null for an invalid date format", () => {
    expect(formatDate("invalid-date")).toBeNull();
    expect(formatDate("")).toBeNull();
    expect(formatDate("2023-01-1")).toBeNull();
  });

  it("should return the same date for a valid YYYY-MM-DD format", () => {
    expect(formatDate("2025-05-12")).toBe("2025-05-12");
    expect(formatDate("2000-01-01")).toBe("2000-01-01");
  });

  it("should convert and return a valid date in YYYYMMDD format", () => {
    expect(formatDate("20250512")).toBe("2025-05-12");
  });

  it("should return null for an invalid date in YYYYMMDD format", () => {
    expect(formatDate("20251301")).toBeNull();
  });

  it("should return null for an invalid date in YYYY-MM-DD format", () => {
    expect(formatDate("2025-13-01")).toBeNull();
  });
});
