
import { isMultipleOf } from '../src/easy/multipleOf';

test('should return true if the number is a multiple of the divisor', () => {
  expect(isMultipleOf(15, 5)).toBe(true);  // 15 is a multiple of 5
  expect(isMultipleOf(20, 4)).toBe(true);  // 20 is a multiple of 4
});

test('should return false if the number is not a multiple of the divisor', () => {
  expect(isMultipleOf(15, 4)).toBe(false);  // 15 is not a multiple of 4
  expect(isMultipleOf(21, 5)).toBe(false);  // 21 is not a multiple of 5
});

test('should return true for zero if the divisor is non-zero', () => {
  expect(isMultipleOf(0, 7)).toBe(true);  // 0 is a multiple of any number
});

test('should return false if divisor is zero', () => {
  expect(isMultipleOf(15, 0)).toBe(false);  // Division by zero is not allowed
});
