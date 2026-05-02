import { greetWithInitials } from "../src/easy/greet"

describe('greetWithInitials', () => {
  it('should greet with initials for a full name', () => {
    expect(greetWithInitials('Pixy Glee')).toBe('Hello, P.G.');
  });

  it('should handle a single name correctly', () => {
    expect(greetWithInitials('Pixy')).toBe('Hello, P.');
  });

  it('should handle multiple words in the name', () => {
    expect(greetWithInitials('Pixy Glee Johnson')).toBe('Hello, P.G.J.');
  });
});
