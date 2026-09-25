import "./Footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>🍽️ Cuisine Restaurant</h3>
          <p>Bringing world-class cuisines to your doorstep</p>
          <p className="tagline">Experience Global Flavors, Local Comfort</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#menu">Menu</a>
            </li>
            <li>
              <a href="#about">About Us</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Cuisines Offered</h4>
          <ul>
            <li>🍔 American</li>
            <li>🍝 Italian</li>
            <li>🥢 Chinese</li>
            <li>🌮 Mexican</li>
            <li>🍣 Japanese</li>
            <li>🌶️ Thai & More</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact Info</h4>
          <ul>
            <li>📞 +92-123-456-789</li>
            <li>📧 info@foodhub.com</li>
            <li>🏪 Available 10 AM - 11 PM</li>
            <li>🚚 Free Delivery on Orders Rs 1000</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-links">
            <a href="#" className="social-icon">
              📘
            </a>
            <a href="#" className="social-icon">
              🐦
            </a>
            <a href="#" className="social-icon">
              📷
            </a>
            <a href="#" className="social-icon">
              ▶️
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {currentYear} FoodHub International. All rights reserved. |
          Terms & Conditions | Privacy Policy
        </p>
      </div>
    </footer>
  );
}
