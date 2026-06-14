import React from 'react';
import { render, screen } from '@testing-library/react';
import { Assignment3 } from '../components/Assignment3'; 

describe('Assignment3 Component', () => {
    it('renders the list of items', () => {
        render(<Assignment3 />);

        // Check if each item is rendered
        expect(screen.getByText('Chocolates - Price: $10')).toBeInTheDocument();
        expect(screen.getByText('Chips - Price: $20')).toBeInTheDocument();
        expect(screen.getByText('Onion - Price: $30')).toBeInTheDocument();
        expect(screen.getByText('Tomato - Price: $30')).toBeInTheDocument();
        expect(screen.getByText('Tomato - Price: $100')).toBeInTheDocument();
    });

    it('calculates the total value correctly', () => {
        render(<Assignment3 />);

        // Check if the total value is calculated correctly
        const totalValue = 10 + 20 + 30 + 30 + 100; // 190
        expect(screen.getByText(`Total Value: ${totalValue}`)).toBeInTheDocument();
    });
});