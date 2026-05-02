import { findMinimumValue } from "../src/hard/arrayOne";

describe("findMinimumValue Function", () => {
  test("should return the minimum value from a non-empty array", () => {
    expect(findMinimumValue([10, 2, 8, 6])).toBe(2);
  });

  test("should handle arrays with a single element", () => {
    expect(findMinimumValue([7])).toBe(7);
  });

  test("should throw an error for an empty array", () => {
    expect(() => findMinimumValue([])).toThrow("Array cannot be empty");
  });
});
