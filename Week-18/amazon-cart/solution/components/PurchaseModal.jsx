import { styles } from '../../src/components/AmazonStyleCart.module'
import { CheckCircle } from 'lucide-react';


const PurchaseModal = ({ handlePurchaseComplete, total }) => {
  return (
    <div style={styles.modal} role="dialog">
      <div style={styles.modalContent}>
        <h2>Purchase Successful!</h2>
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <span data-testid="check-circle-icon">
          <CheckCircle size={48} style={{ margin: '0 auto', color: '#48bb78' }} />
          </span>
          <p>Thank you for your purchase. Your order has been successfully processed.</p>
        </div>
        <p>Total Amount: ₹{total}</p>
        <button
          style={styles.closeButton}
          onClick={handlePurchaseComplete}
         
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default PurchaseModal