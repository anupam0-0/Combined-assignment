import { getSeatDescription, SeatPosition } from "../src/hard/enums";

describe("getSeatDescription Function", () => {
  it("should return a message for a window seat", () => {
    expect(getSeatDescription(SeatPosition.Window)).toBe("You have selected a window seat.");
  });

  it("should return a message for a middle seat", () => {
    expect(getSeatDescription(SeatPosition.Middle)).toBe("You have selected a middle seat.");
  });

  it("should return a message for an aisle seat", () => {
    expect(getSeatDescription(SeatPosition.Aisle)).toBe("You have selected an aisle seat.");
  });

  it("should throw an error for an invalid seat position", () => {
    // Casting to bypass TypeScript's strict enum checks for testing invalid input
    expect(() => getSeatDescription("INVALID" as SeatPosition)).toThrow("Invalid seat position");
  });
});
