import { render, screen } from '@testing-library/react';
import PurchaseModal from '../components/PurchaseModal';
import { CheckCircle } from 'lucide-react';
import { styles } from '../components/AmazonStyleCart.module';
import { describe, it, expect, vi } from 'vitest';


describe('PurchaseModal Component', () => {
  const handlePurchaseComplete = vi.fn();
  const total = 1200;

  it('renders the modal with the correct content and styles', () => {
    render(
      <PurchaseModal
        handlePurchaseComplete={handlePurchaseComplete}
        total={total}
      />
    );

    // Check if the modal is rendered
    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveStyle(styles.modal);

    // Check if the modal content is rendered
    const modalContent = screen.getByText('Purchase Successful!').closest('div');
    expect(modalContent).toBeInTheDocument();
    expect(modalContent).toHaveStyle(styles.modalContent);

    // Check if the heading is rendered
    expect(screen.getByText('Purchase Successful!')).toBeInTheDocument();

    // Check if the CheckCircle icon is rendered
    const checkCircleIconWrapper = screen.getByTestId('check-circle-icon');
    expect(checkCircleIconWrapper).toBeInTheDocument();

    // Check if the CheckCircle icon is inside the wrapper
    const checkCircleIcon = checkCircleIconWrapper.querySelector('svg');
    expect(checkCircleIcon).toBeInTheDocument();
    expect(checkCircleIcon).toHaveAttribute('width', '48');
    expect(checkCircleIcon).toHaveAttribute('height', '48');
    expect(checkCircleIcon).toHaveStyle({ color: '#48bb78', margin: '0 auto' });

    // Check if the thank you message is rendered
    expect(
      screen.getByText(
        'Thank you for your purchase. Your order has been successfully processed.'
      )
    ).toBeInTheDocument();

    // Check if the total amount is rendered
    expect(screen.getByText(`Total Amount: ₹${total}`)).toBeInTheDocument();

    // Check if the close button is rendered
    const closeButton = screen.getByRole('button', { name: /close/i });
    expect(closeButton).toBeInTheDocument();
    expect(closeButton).toHaveStyle({
      backgroundColor: 'rgb(49, 130, 206)',
      borderRadius: '4px',
      color: 'rgb(255, 255, 255)', // Use rgb(255, 255, 255) instead of white
      padding: '8px',
      transition: 'background-color 0.15s',
      width: '100%',
    });
  });

  it('calls handlePurchaseComplete when the close button is clicked', () => {
    render(
      <PurchaseModal
        handlePurchaseComplete={handlePurchaseComplete}
        total={total}
      />
    );

    // Simulate clicking the close button
    const closeButton = screen.getByRole('button', { name: /close/i });
    closeButton.click();

    // Verify that the function was called
    expect(handlePurchaseComplete).toHaveBeenCalledTimes(1);
  });
});