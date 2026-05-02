import { mergeObjects } from '../src/generics/problem-03';

describe('mergeObjects function', () => {
  it('should merge two objects', () => {
    const result = mergeObjects({ name: "Alice" }, { age: 25 });
    expect(result).toEqual({ name: "Alice", age: 25 });
  });

  it('should merge two objects with different keys', () => {
    const result = mergeObjects({ title: "Engineer" }, { department: "IT" });
    expect(result).toEqual({ title: "Engineer", department: "IT" });
  });
});
