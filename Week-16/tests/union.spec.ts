import { getArea, Shape } from '../src/medium/union';

describe('getArea Function', () => {
  it('should calculate the area of a circle', () => {
    const circle: Shape = { radius: 3 };
    expect(getArea(circle)).toBeCloseTo(28.274, 3); // π * 3²
  });

  it('should calculate the area of a rectangle', () => {
    const rectangle: Shape = { width: 4, height: 5 };
    expect(getArea(rectangle)).toBe(20); // 4 * 5
  });

  it('should return 0 for invalid shapes (empty object)', () => {
    // TypeScript would prevent invalid inputs at compile-time, but we can ensure type-safety
    const invalidShape = {} as Shape;
    expect(() => getArea(invalidShape)).toThrow();
  });
});
