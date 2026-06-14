import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import axios from 'axios';
import RandomUser from './RandomUser';

// Mock axios
vi.mock('axios');
const mockedAxios = axios;

describe('RandomUser Component', () => {
  const mockUsers = [
    {
      name: { first: 'John', last: 'Doe' },
      email: 'john.doe@example.com',
      picture: { medium: 'https://example.com/john.jpg' },
    },
    {
      name: { first: 'Jane', last: 'Smith' },
      email: 'jane.smith@example.com',
      picture: { medium: 'https://example.com/jane.jpg' },
    },
  ];

  beforeEach(() => {
    // Reset mocks and cleanup
    vi.clearAllMocks();
    cleanup();
  });

  it('renders the component with correct title', () => {
    render(<RandomUser />);
    expect(screen.getByText('Random Users')).toBeInTheDocument();
  });

  it('displays user data correctly in the user cards', async () => {
    // Mock axios response with the correct structure
    mockedAxios.get.mockResolvedValueOnce({ data: { results: mockUsers } });

    render(<RandomUser />);

    // Wait for the users to be rendered
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
      expect(screen.getByText('jane.smith@example.com')).toBeInTheDocument();
    });
  });

  it('renders the "Load More Users" button and handles click', async () => {
    // Mock axios response with the correct structure
    mockedAxios.get.mockResolvedValue({ data: { results: mockUsers } });

    render(<RandomUser />);

    // Wait for the initial users to be rendered
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Click the "Load More Users" button
    const button = screen.getByText('Load More Users');
    fireEvent.click(button);

    // Verify that axios.get was called again
    expect(mockedAxios.get).toHaveBeenCalledTimes(2);
  });

  it('renders loading state when fetching data', () => {
    // Mock axios to delay the response
    mockedAxios.get.mockImplementationOnce(() => {
      return new Promise((resolve) => setTimeout(resolve, 1000));
    });

    render(<RandomUser />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders an empty list when no users are fetched', async () => {
    // Mock axios response with empty results
    mockedAxios.get.mockResolvedValueOnce({ data: { results: [] } });

    render(<RandomUser />);

    // Wait for the component to render
    await waitFor(() => {
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });
  });
});
