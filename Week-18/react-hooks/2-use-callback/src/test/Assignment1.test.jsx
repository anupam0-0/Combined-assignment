import { render, screen, fireEvent } from '@testing-library/react';
import { Assignment1 } from '../components/Assignment1'; 

describe('Assignment1 Component', () => {
    test('renders with initial count', () => {
        render(<Assignment1 />);
        const countElement = screen.getByText(/Count:/i);
        expect(countElement).toHaveTextContent('Count: 0');
    });

    test('increments count when Increment button is clicked', () => {
        render(<Assignment1 />);
        const incrementButton = screen.getByText(/Increment/i);
        const countElement = screen.getByText(/Count:/i);

        fireEvent.click(incrementButton);
        expect(countElement).toHaveTextContent('Count: 1');

        fireEvent.click(incrementButton);
        expect(countElement).toHaveTextContent('Count: 2');
    });

    test('decrements count when Decrement button is clicked', () => {
        render(<Assignment1 />);
        const decrementButton = screen.getByText(/Decrement/i);
        const countElement = screen.getByText(/Count:/i);

        fireEvent.click(decrementButton);
        expect(countElement).toHaveTextContent('Count: -1');

        fireEvent.click(decrementButton);
        expect(countElement).toHaveTextContent('Count: -2');
    });

    test('increments and decrements count correctly', () => {
        render(<Assignment1 />);
        const incrementButton = screen.getByText(/Increment/i);
        const decrementButton = screen.getByText(/Decrement/i);
        const countElement = screen.getByText(/Count:/i);

        fireEvent.click(incrementButton);
        expect(countElement).toHaveTextContent('Count: 1');

        fireEvent.click(decrementButton);
        expect(countElement).toHaveTextContent('Count: 0');

        fireEvent.click(incrementButton);
        expect(countElement).toHaveTextContent('Count: 1');

        fireEvent.click(decrementButton);
        fireEvent.click(decrementButton);
        expect(countElement).toHaveTextContent('Count: -1');
    });
});