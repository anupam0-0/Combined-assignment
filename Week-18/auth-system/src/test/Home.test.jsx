import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest'; 
import Home from '../components/Home';

describe('Home Component', () => {
  it('renders without crashing', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { name: /Welcome to the Auth System Demo/i })).toBeInTheDocument();
  });

  it('displays the correct heading', () => {
    render(<Home />);
    const heading = screen.getByRole('heading', { name: /Welcome to the Auth System Demo/i });
    expect(heading).toBeInTheDocument();
  });

  it('displays the correct paragraphs', () => {
    render(<Home />);
    const paragraph1 = screen.getByText(/This demo showcases two approaches to managing authentication state in React:/i);
    const paragraph2 = screen.getByText(/Use the toggle above to switch between the two approaches./i);
    expect(paragraph1).toBeInTheDocument();
    expect(paragraph2).toBeInTheDocument();
  });

  it('displays the correct list items', () => {
    render(<Home />);
    const listItem1 = screen.getByText(/State Lifting/i);
    const listItem2 = screen.getByText(/Context API/i);
    expect(listItem1).toBeInTheDocument();
    expect(listItem2).toBeInTheDocument();
  });
});
