import { useState } from "react";
import "./Header.css";

export default function Header({ cartCount, onCartClick, onNavClick }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    if (onNavClick) {
      onNavClick(sectionId);
    }
  };

  return (
    <header className="header">
      <div className="logo">🍽️ Cuisine Restaurant</div>

      <nav className={`nav ${mobileMenuOpen ? "active" : ""}`}>
        <button className="nav-link" onClick={() => handleNavClick("home")}>
          Home
        </button>
        <button className="nav-link" onClick={() => handleNavClick("menu")}>
          Menu
        </button>
        <button className="nav-link" onClick={() => handleNavClick("cuisines")}>
          Cuisines
        </button>
        <button className="nav-link" onClick={() => handleNavClick("contact")}>
          Contact
        </button>
      </nav>

      <div className="header-actions">
        <button className="cart-btn" onClick={onCartClick}>
          🛒 Cart <span className="cart-count">{cartCount}</span>
        </button>
        <button
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰
        </button>
      </div>
    </header>
  );
}
