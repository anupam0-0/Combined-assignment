import { createPair } from '../src/generics/problem-02';

describe('createPair function', () => {
  it('should return a tuple with string and number', () => {
    expect(createPair("Hello", 100)).toEqual(["Hello", 100]);
  });

  it('should return a tuple with boolean and object', () => {
    expect(createPair(true, { name: "Alice" })).toEqual([true, { name: "Alice" }]);
  });
});
