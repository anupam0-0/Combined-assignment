import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProductModal from '../components/ProductModal';
import { styles } from '../components/ProductModal.module.js';

describe('ProductModal Component', () => {
  const product = {
    name: 'Sample Product Name',
    image: 'https://example.com/sample-image.jpg',
    price: 99.99,
    description: 'This is a sample product description.',
  };

  const onClose = vi.fn();

  it('does not render the modal when isOpen is false', () => {
    render(
      <ProductModal
        product={product}
        isOpen={false}
        onClose={onClose}
      />
    );

    // Check if the modal is not rendered
    const modal = screen.queryByRole('dialog');
    expect(modal).not.toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    render(
      <ProductModal
        product={product}
        isOpen={true}
        onClose={onClose}
      />
    );

    // Simulate clicking the close button
    const closeButton = screen.getByRole('button', { name: /×/i });
    fireEvent.click(closeButton);

    // Verify that onClose was called
    expect(onClose).toHaveBeenCalledTimes(1);
  });

});
