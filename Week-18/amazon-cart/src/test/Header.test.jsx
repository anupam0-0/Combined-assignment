import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from '../components/Header';
import { describe, test, expect } from 'vitest'; 

describe('Header Component', () => {
  it('renders the header with the correct content', () => {
    const itemCount = 5;
    render(
      <Router>
        <Header itemCount={itemCount} />
      </Router>
    );

    // Check if the logo is rendered
    expect(screen.getByText('amazon.in')).toBeInTheDocument();

    // Check if the user greeting is rendered
    expect(screen.getByText('Hello, User')).toBeInTheDocument();

    // Check if the cart link is rendered
    const cartLink = screen.getByRole('link', { name: '' }); // The cart link has no accessible name
    expect(cartLink).toBeInTheDocument();

    // Check if the item count is rendered correctly
    expect(screen.getByText(itemCount.toString())).toBeInTheDocument();
  });

  it('renders the header with 0 items when itemCount is not provided', () => {
    render(
      <Router>
        <Header />
      </Router>
    );

    // Check if the item count defaults to 0
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
