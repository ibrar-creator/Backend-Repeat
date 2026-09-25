import "./Hero.css";

export default function Hero({ onExplore }) {
  return (
    <section className="hero">
      <div className="hero-content">
        <p className="subtitle">WELCOME TO FOODHUB</p>

        <h1>
          Delicious Food,
          <span>Made For You.</span>
        </h1>

        <p className="description">
          Fresh ingredients, delicious recipes and unforgettable taste. Choose
          your favorite food and place your order.
        </p>

        <button className="primary-btn" onClick={onExplore}>
          Explore Menu
        </button>
      </div>

      <div className="hero-image">
        <div className="food-circle">🍔</div>
      </div>
    </section>
  );
}
