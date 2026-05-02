import { multiplyResults } from '../src/easy/multiply';

test('should return the product of two functions results', () => {
  const f1 = () => 5;
  const f2 = () => 10;

  const result = multiplyResults(f1, f2);
  expect(result).toBe(50); // 5 * 10 = 50
});

test('should handle zero correctly', () => {
  const f1 = () => 0;
  const f2 = () => 10;

  const result = multiplyResults(f1, f2);
  expect(result).toBe(0); // 0 * 10 = 0
});

test('should handle negative numbers', () => {
  const f1 = () => -5;
  const f2 = () => 10;

  const result = multiplyResults(f1, f2);
  expect(result).toBe(-50); // -5 * 10 = -50
});

test('should handle floating point numbers', () => {
  const f1 = () => 2.5;
  const f2 = () => 4.2;

  const result = multiplyResults(f1, f2);
  expect(result).toBeCloseTo(10.5, 5); // 2.5 * 4.2 = 10.5
});
