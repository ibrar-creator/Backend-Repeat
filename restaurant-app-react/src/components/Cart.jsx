import { useState } from "react";
import "./Cart.css";

export default function Cart({ isOpen, onClose, cartItems, onRemoveItem }) {
  const [showBill, setShowBill] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.05;
  const deliveryCharge = 200;
  const total = subtotal + tax + deliveryCharge;

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🛒 Your Order</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item, index) => (
                <div key={index} className="cart-item">
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p>
                      {item.quantity} × Rs {item.price} = Rs {item.total}
                    </p>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => onRemoveItem(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {!showBill ? (
              <button
                className="checkout-btn"
                onClick={() => setShowBill(true)}
              >
                View Bill
              </button>
            ) : (
              <div className="bill-section">
                <div className="bill-line">
                  <span>Subtotal:</span>
                  <span>Rs {subtotal}</span>
                </div>
                <div className="bill-line">
                  <span>Tax (5%):</span>
                  <span>Rs {tax.toFixed(0)}</span>
                </div>
                <div className="bill-line">
                  <span>Delivery Charge:</span>
                  <span>Rs {deliveryCharge}</span>
                </div>
                <div className="bill-line total">
                  <span>Total:</span>
                  <span>Rs {total.toFixed(0)}</span>
                </div>

                <button
                  className="order-btn"
                  onClick={() => {
                    alert(
                      `Order placed successfully!\nTotal: Rs ${total.toFixed(0)}`,
                    );
                    onClose();
                  }}
                >
                  Place Order
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
