import { isEligibleForDriving } from '../src/medium/driving';

describe('isEligibleForDriving', () => {
    it('should return true if the user is eligible for driving', () => {
        expect(isEligibleForDriving({ name: 'Alice', age: 20 })).toBe(true);
    });

    it('should return false if the user is under the age of 16', () => {
        expect(isEligibleForDriving({ name: 'Bob', age: 15 })).toBe(false);
    });

    it('should return true if the user is exactly 16 years old', () => {
        expect(isEligibleForDriving({ name: 'Charlie', age: 16 })).toBe(true);
    });
});
