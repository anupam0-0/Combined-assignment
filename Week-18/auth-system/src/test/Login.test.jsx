import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Login from '../components/Login';
import { AuthContext } from '../components/AuthSystem';

describe('Login Component', () => {
  it('renders correctly', () => {
    render(<Login />);
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('updates the username input', () => {
    render(<Login />);
    const input = screen.getByPlaceholderText('Enter your username');
    fireEvent.change(input, { target: { value: 'testuser' } });
    expect(input.value).toBe('testuser');
  });

  it('calls the login method from AuthContext when available', () => {
    const mockLogin = vi.fn();
    render(
      <AuthContext.Provider value={{ login: mockLogin }}>
        <Login />
      </AuthContext.Provider>
    );

    const input = screen.getByPlaceholderText('Enter your username');
    const button = screen.getByRole('button', { name: 'Login' });

    fireEvent.change(input, { target: { value: 'testuser' } });
    fireEvent.click(button);

    expect(mockLogin).toHaveBeenCalledWith('testuser');
    expect(input.value).toBe('');
  });

  it('calls the propOnLogin function when AuthContext is not available', () => {
    const mockPropOnLogin = vi.fn();
    render(<Login onLogin={mockPropOnLogin} />);

    const input = screen.getByPlaceholderText('Enter your username');
    const button = screen.getByRole('button', { name: 'Login' });

    fireEvent.change(input, { target: { value: 'testuser' } });
    fireEvent.click(button);

    expect(mockPropOnLogin).toHaveBeenCalledWith('testuser');
    expect(input.value).toBe('');
  });
});
