import { formatDateYYYYMMDD, formatDateMMDDYYYY } from "./formatDate";

describe("formatDateFormatters", () => {
  describe("formatDateYYYYMMDD", () => {
    it("should return null for an invalid date format", () => {
      expect(formatDateYYYYMMDD("invalid-date")).toBeNull();
      expect(formatDateYYYYMMDD("")).toBeNull();
      expect(formatDateYYYYMMDD("2023-01-1")).toBeNull();
    });

    it("should return the same date for a valid YYYY-MM-DD format", () => {
      expect(formatDateYYYYMMDD("2025-05-12")).toBe("2025-05-12");
      expect(formatDateYYYYMMDD("2000-01-01")).toBe("2000-01-01");
    });

    it("should convert and return a valid date in YYYYMMDD format", () => {
      expect(formatDateYYYYMMDD("20250512")).toBe("2025-05-12");
    });

    it("should return null for an invalid date in YYYYMMDD format", () => {
      expect(formatDateYYYYMMDD("20251301")).toBeNull();
      expect(formatDateYYYYMMDD("20250229")).toBeNull();
      expect(formatDateYYYYMMDD("20250431")).toBeNull();
    });

    it("should return null for an invalid date in YYYY-MM-DD format", () => {
      expect(formatDateYYYYMMDD("2025-13-01")).toBeNull();
      expect(formatDateYYYYMMDD("2025-02-29")).toBeNull();
      expect(formatDateYYYYMMDD("2025-04-31")).toBeNull();
    });
  });

  describe("formatDateMMDDYYYY", () => {
    it("should format MMDDYYYY to YYYY-MM-DD", () => {
      expect(formatDateMMDDYYYY("07042025")).toBe("2025-07-04");
    });

    it("should format MM-DD-YYYY to YYYY-MM-DD", () => {
      expect(formatDateMMDDYYYY("07-04-2025")).toBe("2025-07-04");
    });

    it("should return null for invalid MMDDYYYY format", () => {
      expect(formatDateMMDDYYYY("0704202")).toBeNull();
      expect(formatDateMMDDYYYY("02292025")).toBeNull();
      expect(formatDateMMDDYYYY("04312025")).toBeNull();
    });

    it("should return null for invalid MM-DD-YYYY format", () => {
      expect(formatDateMMDDYYYY("07-04-25")).toBeNull();
    });

    it("should return null for invalid date", () => {
      expect(formatDateMMDDYYYY("13-32-2025")).toBeNull();
      expect(formatDateMMDDYYYY("02-29-2025")).toBeNull();
      expect(formatDateMMDDYYYY("04-31-2025")).toBeNull();
      expect(formatDateMMDDYYYY("13322025")).toBeNull();
      expect(formatDateMMDDYYYY("00012025")).toBeNull();
    });

    it("should return the same YYYY-MM-DD if already valid", () => {
      expect(formatDateMMDDYYYY("2025-07-04")).toBe("2025-07-04");
    });

    it("should return null for invalid YYYY-MM-DD format", () => {
      expect(formatDateMMDDYYYY("2025-13-04")).toBeNull();
      expect(formatDateMMDDYYYY("2025-02-29")).toBeNull();
      expect(formatDateMMDDYYYY("2025-04-31")).toBeNull();
    });
  });
});
