import { useState } from "react";
import "./Menu.css";
import { menuData } from "../data/menuData";

export default function Menu({ categoryId, onAddToCart }) {
  const [quantities, setQuantities] = useState({});

  if (!categoryId || !menuData[categoryId]) {
    return null;
  }

  const category = menuData[categoryId];

  const handleQuantityChange = (itemId, value) => {
    const qty = Math.max(1, parseInt(value) || 1);
    setQuantities({ ...quantities, [itemId]: qty });
  };

  const handleAddToCart = (item) => {
    const quantity = quantities[item.id] || 1;
    onAddToCart(item, quantity);
    setQuantities({ ...quantities, [item.id]: 1 });
  };

  return (
    <section className="menu" id="menu">
      <div className="section-heading">
        <div className="cuisine-badge">
          {category.cuisine || "World Cuisine"}
        </div>
        <p className="subtitle">MENU</p>
        <h2>{category.name}</h2>
      </div>

      <div className="menu-grid">
        {category.items.map((item) => (
          <div key={item.id} className="menu-card">
            <div className="menu-item-icon">{category.icon}</div>
            <h3>{item.name}</h3>
            <p className="price">Rs {item.price}</p>

            <div className="quantity-selector">
              <button
                className="qty-btn"
                onClick={() =>
                  handleQuantityChange(item.id, (quantities[item.id] || 1) - 1)
                }
              >
                −
              </button>
              <input
                type="number"
                min="1"
                value={quantities[item.id] || 1}
                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
              />
              <button
                className="qty-btn"
                onClick={() =>
                  handleQuantityChange(item.id, (quantities[item.id] || 1) + 1)
                }
              >
                +
              </button>
            </div>

            <button className="add-btn" onClick={() => handleAddToCart(item)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
