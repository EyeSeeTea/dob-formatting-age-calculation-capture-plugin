import { calculateDob } from "./calculateDob";

describe("calculateDob", () => {
  const originalDate = Date;

  const MOCK_DATE_NOW = "2025-06-24T00:00:00Z";

  beforeAll(() => {
    global.Date = class extends Date {
      constructor(...args: any[]) {
        if (args.length) {
          // @ts-ignore
          super(...args);
        } else {
          super(MOCK_DATE_NOW);
        }
      }
    } as typeof Date;
  });

  afterAll(() => {
    global.Date = originalDate;
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
