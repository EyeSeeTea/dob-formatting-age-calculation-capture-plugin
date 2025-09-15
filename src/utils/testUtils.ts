/**
 * Mocks the global Date constructor to return a fixed date when called without arguments.
 *
 * @param mockDateString - The ISO date string to use as the mocked "now" date
 * @returns An object with setup and teardown functions to use in beforeAll/afterAll
 */
export function mockCurrentDate(mockDateString: string) {
  const originalDate = Date;

  const setup = () => {
    global.Date = class extends Date {
      constructor(...args: any[]) {
        if (args.length) {
          // @ts-ignore
          super(...args);
        } else {
          super(mockDateString);
        }
      }
    } as typeof Date;
  };

  const teardown = () => {
    global.Date = originalDate;
  };

  return { setup, teardown };
}
