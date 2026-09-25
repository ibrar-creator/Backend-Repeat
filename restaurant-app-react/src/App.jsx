import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import Menu from "./components/Menu";
import Cart from "./components/Cart";
import Footer from "./components/Footer";

function App() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const handleAddToCart = (item, quantity) => {
    setCartItems([
      ...cartItems,
      {
        name: item.name,
        price: item.price,
        quantity: quantity,
        total: item.price * quantity,
      },
    ]);
  };

  const handleRemoveItem = (index) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  const handleCategorySelect = (categoryId) => {
    setActiveCategory(categoryId);
  };

  const handleExplore = () => {
    setActiveCategory(1);
  };

  return (
    <div className="App">
      <Header
        cartCount={cartItems.length}
        onCartClick={() => setCartOpen(true)}
      />

      <main>
        <section id="home">
          <Hero onExplore={handleExplore} />
        </section>

        <section id="cuisines">
          <Categories
            onCategorySelect={handleCategorySelect}
            activeCategory={activeCategory}
          />
        </section>

        {activeCategory && (
          <Menu categoryId={activeCategory} onAddToCart={handleAddToCart} />
        )}
      </main>

      <Cart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveItem}
      />

      <Footer />
    </div>
  );
}

export default App;
