import { sum } from '../src/generics/problem-04';

describe('sum function', () => {
  it('should return the sum of numbers in the array', () => {
    expect(sum([1, 2, 3, 4])).toBe(10);
  });

  it('should return 0 for an empty array', () => {
    expect(sum([])).toBe(0);
  });
});
