import "./Categories.css";
import { categories } from "../data/menuData";

export default function Categories({ onCategorySelect, activeCategory }) {
  return (
    <section className="categories">
      <div className="section-heading">
        <p className="subtitle">EXPLORE</p>
        <h2>Choose Your Category</h2>
      </div>

      <div className="category-grid">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`category-card ${activeCategory === category.id ? "active" : ""}`}
            onClick={() => onCategorySelect(category.id)}
          >
            <div className="category-icon">{category.icon}</div>
            <h3>{category.name}</h3>
            <p>{category.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
