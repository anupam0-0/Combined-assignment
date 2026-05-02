import { filterUsersByCountry, User } from "../src/hard/arrayTwo";

describe("filterUsersByCountry Function", () => {
  const users: User[] = [
    { name: "Alice", age: 25, country: "India" },
    { name: "Bob", age: 30, country: "USA" },
    { name: "Charlie", age: 22, country: "India" },
    { name: "David", age: 28, country: "Canada" }
  ];

  test("should return users from India", () => {
    const result = filterUsersByCountry(users, "India");
    expect(result).toEqual([
      { name: "Alice", age: 25, country: "India" },
      { name: "Charlie", age: 22, country: "India" }
    ]);
  });

  test("should return an empty array if no users are from the specified country", () => {
    const result = filterUsersByCountry(users, "Germany");
    expect(result).toEqual([]);
  });

  test("should handle an empty user list", () => {
    const result = filterUsersByCountry([], "India");
    expect(result).toEqual([]);
  });
});
