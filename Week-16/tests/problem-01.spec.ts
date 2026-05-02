import { identity } from '../src/generics/problem-01';

describe('identity function', () => {
  it('should return the same string', () => {
    expect(identity("Hello")).toBe("Hello");
  });

  it('should return the same number', () => {
    expect(identity(100)).toBe(100);
  });

  it('should return the same boolean', () => {
    expect(identity(true)).toBe(true);
  });
});
