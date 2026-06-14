import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest'; 
import '@testing-library/jest-dom';
import AuthSystem from '../components/AuthSystem';

describe('AuthSystem', () => {
  it('renders Login component when not logged in', () => {
    render(<AuthSystem />);
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });
});
