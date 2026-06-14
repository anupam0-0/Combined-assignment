import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Assignment2 } from '../components/Assignment2'; 

describe('Assignment2 Component', () => {
    test('renders the component and displays initial render count', () => {
        render(<Assignment2 />);
        
        // Check if the initial render count is 1
        expect(screen.getByText(/This component has rendered 1 times/i)).toBeInTheDocument();
    });

    test('increments the render count when the button is clicked', () => {
        render(<Assignment2 />);
        
        // Click the button to force re-render
        fireEvent.click(screen.getByRole('button', { name: /Force Re-render/i }));
        
        // Check if the render count is incremented to 2
        expect(screen.getByText(/This component has rendered 2 times/i)).toBeInTheDocument();
        
        // Click the button again to force another re-render
        fireEvent.click(screen.getByRole('button', { name: /Force Re-render/i }));
        
        // Check if the render count is incremented to 3
        expect(screen.getByText(/This component has rendered 3 times/i)).toBeInTheDocument();
    });
});