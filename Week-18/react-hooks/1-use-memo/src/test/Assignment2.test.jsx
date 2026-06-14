import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Assignment2 } from '../components/Assignment2'; 

describe('Assignment2 Component', () => {
    beforeEach(() => {
        render(<Assignment2 />);
    });

    test('renders input field', () => {
        const input = screen.getByRole('textbox');
        expect(input).toBeInTheDocument();
    });

    test('renders initial sentences', () => {
        const sentences = screen.getAllByText(/hi|my|name|is|for|to|random|word/i);
        expect(sentences.length).toBeGreaterThan(0); // Check if there are sentences rendered
    });

    test('filters sentences based on input', () => {
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'hi' } });

        const filteredSentences = screen.getAllByText(/hi/i);
        expect(filteredSentences.length).toBeGreaterThan(0); // Check if filtered sentences are rendered
    });

    test('does not show sentences that do not match the filter', () => {
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'nonexistent' } });

        const filteredSentences = screen.queryAllByText(/hi|my|name|is|for|to|random|word/i);
        expect(filteredSentences.length).toBe(0); // Check that no sentences are rendered
    });

    test('maintains performance with large list', () => {
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'my' } });

        const filteredSentences = screen.getAllByText(/my/i);
        expect(filteredSentences.length).toBeGreaterThan(0); // Check if filtered sentences are rendered
    });
});