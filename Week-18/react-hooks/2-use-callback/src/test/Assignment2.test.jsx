import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { Assignment2 } from '../components/Assignment2'; 

describe('Assignment2 Component', () => {
    beforeEach(() => {
        // Mock the alert function
        window.alert = vi.fn();
    });

    afterEach(() => {
        // Clear the mock after each test
        vi.clearAllMocks();
    });

    it('should display an alert with the entered text when the button is clicked', () => {
        render(<Assignment2 />);

        // Find the input and button elements
        const input = screen.getByPlaceholderText('Enter some text');
        const button = screen.getByText('Show Alert');

        // Simulate user typing into the input field
        fireEvent.change(input, { target: { value: 'Hello, World!' } });

        // Simulate button click
        fireEvent.click(button);

        // Assert that the alert was called with the correct text
        expect(window.alert).toHaveBeenCalledWith('Hello, World!');
    });

    it('should not call alert if input is empty', () => {
        render(<Assignment2 />);

        // Find the button element
        const button = screen.getByText('Show Alert');

        // Simulate button click
        fireEvent.click(button);

        // Assert that the alert was not called
        expect(window.alert).not.toHaveBeenCalled();
    });
});