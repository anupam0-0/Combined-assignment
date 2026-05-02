import { isAllowedDomain, User } from '../src/medium/domain';

describe('isAllowedDomain', () => {
    it('should return true if the user email ends with the allowed domain', () => {
        const user: User = { firstName: 'Alice', lastName: 'Smith', email: 'alice@example.com', age: 22 };
        const domain = '@example.com';
        expect(isAllowedDomain(user, domain)).toBe(true);
    });

    it('should return false if the user email does not end with the allowed domain', () => {
        const user: User = { firstName: 'Bob', lastName: 'Brown', email: 'bob@gmail.com', age: 30 };
        const domain = '@example.com';
        expect(isAllowedDomain(user, domain)).toBe(false);
    });
});
