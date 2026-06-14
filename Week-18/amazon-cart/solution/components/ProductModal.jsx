import { styles } from './ProductModal.module.js';

const ProductModal = ({ product, isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    onClose();
  };

  const handleModalClick = (e) => {
    e.stopPropagation(); // Prevent event bubbling
  };


  return (
    <div style={styles.overlay} onClick={handleOverlayClick} role="dialog">
      <div style={styles.modal} onClick={handleModalClick}>
        <button style={styles.closeButton} onClick={onClose}>&times;</button>
        <h2 style={styles.title}>{(product.name).substring(0, 21)}</h2>
        <div style={styles.content}>
          <div style={styles.imageContainer}>
            <img src={product.image} alt={product.name} style={styles.image} />
          </div>
          <div style={styles.details}>
            <p style={styles.price}>₹{product.price.toFixed(2)}</p>
            <p style={styles.description}>{product.description}</p>
          </div>
        </div>
        <div style={styles.buttonContainer}>
          <button style={styles.addToCartButton}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;