import { Car } from '../src/medium/tesla';

describe('Car Class', () => {
    it('should create a car with make, model, and year', () => {
        const car = new Car('Tesla', 'Model S', 2020);
        expect(car.make).toBe('Tesla');
        expect(car.model).toBe('Model S');
        expect(car.year).toBe(2020);
    });

    it('should return the correct details from getDetails method', () => {
        const car = new Car('Tesla', 'Model 3', 2021);
        expect(car.getDetails()).toBe('This is a 2021 Tesla Model 3.');
    });
});
