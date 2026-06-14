import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'vitest';
import { Assignment1 } from '../components/Assignment1';

describe('Assignment1 Component', () => {
  it('calculates the factorial correctly', async () => {
    render(<Assignment1 />);
    
    const input = screen.getByRole('spinbutton');
    const output = screen.getByText(/Calculated Value:/);

    // Simulate user input and calculate factorial for 5
    fireEvent.change(input, { target: { value: '5' } });
    await waitFor(() => expect(output).toHaveTextContent('Calculated Value: 120'));

    // Simulate user input and calculate factorial for 3
    fireEvent.change(input, { target: { value: '3' } });
    await waitFor(() => expect(output).toHaveTextContent('Calculated Value: 6'));
  });

  it('does not recalculate factorial when input is the same', async () => {
    render(<Assignment1 />);

    const input = screen.getByRole('spinbutton');
    const output = screen.getByText(/Calculated Value:/);

    // Initial input 5
    fireEvent.change(input, { target: { value: '5' } });
    await waitFor(() => expect(output).toHaveTextContent('Calculated Value: 120'));

    // Change input to the same value (5)
    fireEvent.change(input, { target: { value: '5' } });

    // Since we can't spy on the internal calculation, we can just check that the output remains the same
    await waitFor(() => expect(output).toHaveTextContent('Calculated Value: 120'));
  });
});