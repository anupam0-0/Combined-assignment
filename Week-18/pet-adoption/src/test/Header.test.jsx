import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import Header from '../../solution/components/Header';

describe('Header Component', () => {
  beforeEach(() => {
    cleanup();
  });

  it('renders the header with the provided message', () => {
    render(<Header message="Welcome to Pet Adoption" />);
    expect(screen.getByRole('heading')).toHaveTextContent('Welcome to Pet Adoption');
  });

  it('renders within a navigation element', () => {
    const { container } = render(<Header message="Test Message" />);
    const nav = container.querySelector('nav');
    expect(nav).toBeInTheDocument();
  });

  it('applies the correct styling', () => {
    const { container } = render(<Header message="Style Test" />);
    const nav = container.querySelector('nav');
    expect(nav).toHaveStyle({
      backgroundColor: '#c59771bd',
      padding: '16px 32px'
    });
  });
});
