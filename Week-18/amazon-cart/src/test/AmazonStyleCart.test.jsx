import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import AmazonStyleCart from '../components/AmazonStyleCart.jsx';
import { cartItemsState } from '../store/cartItemsState.js';


// Mock the PurchaseModal and Header components
vi.mock('../components/index.js', () => ({
    PurchaseModal: ({ handlePurchaseComplete, total }) => (
      <div>
        <p>Purchase Modal</p>
        <p>Total: {total}</p>
        <button onClick={handlePurchaseComplete}>Complete Purchase</button>
      </div>
    ),
    Header: ({ itemCount }) => <div>Header - Items: {itemCount}</div>,
  }));

describe('AmazonStyleCart', () => {
  const initialCartItems = [
    { id: 1, name: 'Product 1', price: 10.0, quantity: 2, image: 'image1.jpg' },
    { id: 2, name: 'Product 2', price: 20.0, quantity: 1, image: 'image2.jpg' },
  ];

  const renderComponent = (cartItems = initialCartItems) => {
    return render(
      <RecoilRoot
        initializeState={({ set }) => {
          set(cartItemsState, cartItems);
        }}
      >
        <AmazonStyleCart />
      </RecoilRoot>
    );
  };

  it('renders the cart with items', () => {
    renderComponent();
    expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
  });

  it('renders an empty cart message when no items are present', () => {
    renderComponent([]);
    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
  });

  it('increases the quantity of an item when the plus button is clicked', () => {
    renderComponent();
    const plusButtons = screen.getAllByRole('button', { name: /increase quantity/i });
    const plusButton = plusButtons[0]; // First item's plus button
    fireEvent.click(plusButton);
    expect(screen.getByText('3')).toBeInTheDocument(); // Quantity increased from 2 to 3
  });
  it('decreases the quantity of an item when the minus button is clicked', () => {
    renderComponent();
  
    // Find all minus buttons (decrease quantity)
    const minusButtons = screen.getAllByRole('button', { name: /decrease quantity/i });
    const minusButton = minusButtons[0]; // First item's minus button
  
    // Click the minus button
    fireEvent.click(minusButton);
  
    // Verify the quantity has decreased from 2 to 1
    const quantityElement = screen.getByTestId('quantity-1');
    expect(quantityElement).toHaveTextContent('1');
  });
  

  it('removes an item when the delete button is clicked', () => {
    renderComponent();
    const deleteButton = screen.getAllByText('Delete')[0];
    fireEvent.click(deleteButton);
    expect(screen.queryByText('Product 1')).not.toBeInTheDocument();
  });

  it('opens the purchase modal when the checkout button is clicked', () => {
    renderComponent();
    const checkoutButton = screen.getByText('Proceed to Buy');
    fireEvent.click(checkoutButton);
    expect(screen.getByText('Purchase Modal')).toBeInTheDocument();
  });

  it('clears the cart and closes the modal when the purchase is completed', () => {
    renderComponent();
    const checkoutButton = screen.getByText('Proceed to Buy');
    fireEvent.click(checkoutButton);
    const completePurchaseButton = screen.getByText('Complete Purchase');
    fireEvent.click(completePurchaseButton);
    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
  });
});


