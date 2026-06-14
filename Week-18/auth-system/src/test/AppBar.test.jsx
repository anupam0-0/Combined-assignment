import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest'; 
import AppBar from '../components/AppBar';

describe('AppBar Component', () => {
  const mockLogout = vi.fn(); 

  it('renders correctly when logged in', () => {
    render(<AppBar isLoggedIn={true} onLogout={mockLogout} />);
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('renders correctly when logged out', () => {
    render(<AppBar isLoggedIn={false} onLogout={mockLogout} />);
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });
});
