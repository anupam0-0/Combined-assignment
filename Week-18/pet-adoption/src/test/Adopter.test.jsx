import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import AdopterData from '../../solution/components/AdopterData';

describe('AdopterData Component', () => {
  const mockFormData = [
    {
      petName: 'Buddy',
      petType: 'Dog',
      adopterName: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890'
    }
  ];

  const mockHandleGoBack = vi.fn();

  beforeEach(() => {
    cleanup();
  });

  it('renders table with correct headers', () => {
    const { container } = render(<AdopterData formData={mockFormData} handleGoBack={mockHandleGoBack} />);
    const headers = container.querySelectorAll('th');
    expect(headers[0]).toHaveTextContent('Pet Name');
    expect(headers[1]).toHaveTextContent('Pet Type');
    expect(headers[2]).toHaveTextContent('Adopter Name');
    expect(headers[3]).toHaveTextContent('Email');
    expect(headers[4]).toHaveTextContent('Phone');
  });

  it('displays form data correctly in table rows', () => {
    const { container } = render(<AdopterData formData={mockFormData} handleGoBack={mockHandleGoBack} />);
    const cells = container.querySelectorAll('td');
    expect(cells[0]).toHaveTextContent(mockFormData[0].petName);
    expect(cells[1]).toHaveTextContent(mockFormData[0].petType);
    expect(cells[2]).toHaveTextContent(mockFormData[0].adopterName);
    expect(cells[3]).toHaveTextContent(mockFormData[0].email);
    expect(cells[4]).toHaveTextContent(mockFormData[0].phone);
  });

  it('renders go back button and handles click', () => {
    const { container } = render(<AdopterData formData={mockFormData} handleGoBack={mockHandleGoBack} />);
    const button = container.querySelector('button');
    button.click();
    expect(mockHandleGoBack).toHaveBeenCalledTimes(1);
  });

  it('renders empty table when no data is provided', () => {
    const { container } = render(<AdopterData formData={[]} handleGoBack={mockHandleGoBack} />);
    const tbody = container.querySelector('tbody');
    expect(tbody).toBeInTheDocument();
    expect(tbody.children.length).toBe(0);
  });
});
