import React from 'react';
import { render, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import WishList from '../components/WishList';
import { cartItemsState } from '../store/cartItemsState.js';
import { wishItemsState } from '../store/wishItemsState.js';
import { describe, test, expect } from 'vitest'; 
import { MemoryRouter } from 'react-router-dom'; 
import { fireEvent } from '@testing-library/react';

// Mock data for wish items and cart items
const mockWishItems = [
  {
    id: 1,
    name: 'Test Product 1',
    price: 100,
    image: 'https://example.com/image1.jpg',
  },
  {
    id: 2,
    name: 'Test Product 2',
    price: 200,
    image: 'https://example.com/image2.jpg',
  },
];

const mockCartItems = [];

// Initialize Recoil state with mock data
const initializeState = ({ set }) => {
  set(wishItemsState, mockWishItems);
  set(cartItemsState, mockCartItems);
};

// Helper function to render the WishList component with RecoilRoot and MemoryRouter
const renderWishList = () => {
  return render(
    <MemoryRouter> {/* Wrap with MemoryRouter */}
      <RecoilRoot initializeState={initializeState}>
        <WishList />
      </RecoilRoot>
    </MemoryRouter>
  );
};

describe('WishList Component', () => {
  test('renders the WishList component with wish items', () => {
    renderWishList();

    // Check if the wish items are rendered
    expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    expect(screen.getByText('Test Product 2')).toBeInTheDocument();

    // Check if the prices are rendered
    expect(screen.getByText('₹100.00')).toBeInTheDocument();
    expect(screen.getByText('₹200.00')).toBeInTheDocument();

    // Check if the images are rendered
    const productImages = screen.getAllByRole('img');
    expect(productImages[0]).toHaveAttribute('src', 'https://example.com/image1.jpg');
    expect(productImages[1]).toHaveAttribute('src', 'https://example.com/image2.jpg');
  });
  it('handles interactivity in the WishList component', () => {
    renderWishList();

    // Test 1: Clicking "Add to Cart" buttons
    const addToCartButtons = screen.getAllByText('Add to Cart');
    fireEvent.click(addToCartButtons[0]); // Click the first "Add to Cart" button
    // Add assertions here if there's any state change or side effect

    fireEvent.click(addToCartButtons[1]); // Click the second "Add to Cart" button
    // Add assertions here if there's any state change or side effect

    // Test 2: Clicking "Quick View" buttons
    const quickViewButtons = screen.getAllByText('Quick View');
    fireEvent.click(quickViewButtons[0]); // Click the first "Quick View" button
    // Add assertions here if there's any state change or side effect

    fireEvent.click(quickViewButtons[1]); // Click the second "Quick View" button
    // Add assertions here if there's any state change or side effect
  });
  
});