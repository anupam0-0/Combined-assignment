import { render, screen, fireEvent } from '@testing-library/react';
import { Assignment1 } from '../components/Assignment1'; 
import { afterEach, describe, expect, it, vi } from 'vitest';

describe('Assignment1 Component', () => {
    afterEach(() => {
        // Clean up after each test
        vi.clearAllMocks();
    });

    it('focuses the input field on mount', () => {
        render(<Assignment1 />);
        
        const input = screen.getByPlaceholderText('Enter text here');
        
        // Check if the input is focused
        expect(input).toHaveFocus();
    });

    it('focuses the input field when the button is clicked', () => {
        render(<Assignment1 />);
        
        const input = screen.getByPlaceholderText('Enter text here');
        const button = screen.getByText('Focus Input');
        
        // Initially, the input should be focused
        expect(input).toHaveFocus();
        
        // Simulate button click
        fireEvent.click(button);
        
        // Check if the input is still focused
        expect(input).toHaveFocus();
    });
});