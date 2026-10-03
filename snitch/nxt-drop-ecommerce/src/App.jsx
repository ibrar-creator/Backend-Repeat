"use client";

import { useEffect, useMemo, useState } from "react";

const products = [
  {
    id: 1,
    name: "Oversized Black T-Shirt",
    category: "T-Shirts",
    price: 2499,
    oldPrice: 3499,
    rating: 4.8,
    reviews: 128,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1000&q=90",
    badge: "BEST SELLER",
    description:
      "Premium oversized cotton t-shirt with a relaxed streetwear fit.",
  },
  {
    id: 2,
    name: "Premium White Shirt",
    category: "Shirts",
    price: 2999,
    oldPrice: 3999,
    rating: 4.7,
    reviews: 94,
    image:
      "https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?w=1000&q=90",
    badge: "NEW",
    description:
      "Clean premium shirt designed for casual and smart outfits.",
  },
  {
    id: 3,
    name: "Relaxed Blue Jeans",
    category: "Jeans",
    price: 3999,
    oldPrice: 5499,
    rating: 4.9,
    reviews: 201,
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=1000&q=90",
    badge: "TRENDING",
    description:
      "Relaxed fit denim jeans with a modern streetwear silhouette.",
  },
  {
    id: 4,
    name: "Streetwear Hoodie",
    category: "Hoodies",
    price: 3499,
    oldPrice: 4999,
    rating: 4.6,
    reviews: 76,
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1000&q=90",
    badge: "HOT",
    description:
      "Heavyweight hoodie built for comfort and everyday streetwear.",
  },
  {
    id: 5,
    name: "Classic Beige Pants",
    category: "Pants",
    price: 3299,
    oldPrice: 4499,
    rating: 4.8,
    reviews: 88,
    image:
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=1000&q=90",
    badge: "NEW",
    description:
      "Minimal beige pants with a comfortable contemporary fit.",
  },
  {
    id: 6,
    name: "Minimal Black Jacket",
    category: "Jackets",
    price: 4999,
    oldPrice: 6999,
    rating: 4.9,
    reviews: 154,
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1000&q=90",
    badge: "LIMITED",
    description:
      "Minimal black jacket designed for premium everyday looks.",
  },
  {
    id: 7,
    name: "Graphic Oversized Tee",
    category: "T-Shirts",
    price: 2199,
    oldPrice: 2999,
    rating: 4.5,
    reviews: 63,
    image:
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=1000&q=90",
    badge: "SALE",
    description:
      "Bold graphic tee with an oversized relaxed fit.",
  },
  {
    id: 8,
    name: "Premium Cargo Pants",
    category: "Pants",
    price: 3799,
    oldPrice: 4999,
    rating: 4.7,
    reviews: 111,
    image:
      "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=1000&q=90",
    badge: "TRENDING",
    description:
      "Utility-inspired cargo pants with multiple practical pockets.",
  },
];

const categories = [
  "All",
  "T-Shirts",
  "Shirts",
  "Jeans",
  "Hoodies",
  "Pants",
  "Jackets",
];

const sizes = ["S", "M", "L", "XL"];

const dailyImages = [
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1800&q=90",
  "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=1800&q=90",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1800&q=90",
  "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=1800&q=90",
  "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=1800&q=90",
];

const coupons = {
  SNITCH10: 10,
  WELCOME20: 20,
  SAVE500: 500,
};

function getDailyImage() {
  const day = Math.floor(Date.now() / 86400000);
  return dailyImages[day % dailyImages.length];
}

export default function App() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");

  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [quickProduct, setQuickProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("M");

  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState("");

  const [notification, setNotification] = useState("");
  const [dailyImage, setDailyImage] = useState("");

  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setDailyImage(getDailyImage());

    const savedCart = localStorage.getItem("snitch-cart");
    const savedWishlist = localStorage.getItem("snitch-wishlist");

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("snitch-cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(
      "snitch-wishlist",
      JSON.stringify(wishlist)
    );
  }, [wishlist]);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const tomorrow = new Date();

      tomorrow.setHours(24, 0, 0, 0);

      const difference = tomorrow - now;

      setTimeLeft({
        hours: Math.floor(difference / 3600000),
        minutes: Math.floor(
          (difference % 3600000) / 60000
        ),
        seconds: Math.floor(
          (difference % 60000) / 1000
        ),
      });
    };

    updateTimer();

    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, []);

  const showNotification = (message) => {
    setNotification(message);

    setTimeout(() => {
      setNotification("");
    }, 2500);
  };

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const categoryMatch =
        category === "All" ||
        product.category === category;

      const searchMatch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      return categoryMatch && searchMatch;
    });

    if (sort === "price-low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "price-high") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sort === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [category, search, sort]);

  const addToCart = (product, size = "M") => {
    setCart((currentCart) => {
      const existing = currentCart.find(
        (item) =>
          item.id === product.id &&
          item.size === size
      );

      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id &&
          item.size === size
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          size,
          quantity: 1,
        },
      ];
    });

    setQuickProduct(null);
    setCartOpen(true);

    showNotification(`${product.name} added to cart`);
  };

  const increaseQuantity = (id, size) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === id && item.size === size
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  const decreaseQuantity = (id, size) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id && item.size === size
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id, size) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) =>
          !(item.id === id && item.size === size)
      )
    );

    showNotification("Product removed");
  };

  const toggleWishlist = (id) => {
    setWishlist((current) => {
      if (current.includes(id)) {
        showNotification("Removed from wishlist");

        return current.filter((item) => item !== id);
      }

      showNotification("Added to wishlist");

      return [...current, id];
    });
  };

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();

    if (!coupons[code]) {
      setCouponMessage("Invalid coupon code");
      return;
    }

    if (code === "SAVE500") {
      setCoupon({
        type: "fixed",
        value: 500,
      });
    } else {
      setCoupon({
        type: "percentage",
        value: coupons[code],
      });
    }

    setCouponMessage("Coupon applied successfully!");
  };

  const cartItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const subtotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const discount = coupon
    ? coupon.type === "percentage"
      ? Math.round(
          (subtotal * coupon.value) / 100
        )
      : coupon.value
    : 0;

  const shipping =
    subtotal - discount >= 3000 || subtotal === 0
      ? 0
      : 250;

  const total = Math.max(
    0,
    subtotal - discount + shipping
  );

  const remainingForFreeShipping = Math.max(
    0,
    3000 - subtotal
  );

  const shippingProgress = Math.min(
    100,
    (subtotal / 3000) * 100
  );

  const wishlistProducts = products.filter((product) =>
    wishlist.includes(product.id)
  );

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-black">

      {/* ================= NOTIFICATION ================= */}

      {notification && (
        <div className="fixed left-1/2 top-5 z-[200] w-[calc(100%-32px)] max-w-sm -translate-x-1/2 rounded-xl bg-black px-5 py-3 text-center text-sm font-medium text-white shadow-2xl">
          {notification}
        </div>
      )}

      {/* ================= TOP BAR ================= */}

      <div className="bg-black px-4 py-2 text-center text-[10px] font-medium uppercase tracking-[0.18em] text-white sm:text-xs">
        Free shipping on orders above Rs. 3000
      </div>

      {/* ================= NAVBAR ================= */}

      <header className="sticky top-0 z-[80] border-b border-gray-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-10">

          {/* Mobile Menu */}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-10 w-10 items-center justify-center text-2xl md:hidden"
            aria-label="Open menu"
          >
            {menuOpen ? "×" : "☰"}
          </button>

          {/* Logo */}

          <a
            href="#home"
            className="text-xl font-black tracking-[-0.08em] sm:text-2xl md:text-3xl"
          >
            SNITCH
          </a>

          {/* Desktop Navigation */}

          <nav className="hidden items-center gap-7 text-xs font-semibold uppercase tracking-wide md:flex lg:gap-10">
            <a
              href="#home"
              className="transition hover:text-gray-500"
            >
              Home
            </a>

            <a
              href="#products"
              className="transition hover:text-gray-500"
            >
              Shop
            </a>

            <a
              href="#new-arrivals"
              className="transition hover:text-gray-500"
            >
              New Arrivals
            </a>

            <a
              href="#sale"
              className="transition hover:text-gray-500"
            >
              Sale
            </a>

            <a
              href="#contact"
              className="transition hover:text-gray-500"
            >
              Contact
            </a>
          </nav>

          {/* Actions */}

          <div className="flex items-center gap-2 sm:gap-4">

            <button
              onClick={() => setWishlistOpen(true)}
              className="relative flex h-10 w-10 items-center justify-center text-xl"
            >
              ♡

              {wishlist.length > 0 && (
                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[9px] text-white">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setCartOpen(true)}
              className="relative flex h-10 w-10 items-center justify-center text-xl"
            >
              🛒

              {cartItems > 0 && (
                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[9px] text-white">
                  {cartItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}

        {menuOpen && (
          <div className="border-t border-gray-100 bg-white px-5 py-6 md:hidden">
            <nav className="flex flex-col gap-5 text-sm font-semibold uppercase tracking-wide">

              <a
                href="#home"
                onClick={closeMenu}
              >
                Home
              </a>

              <a
                href="#products"
                onClick={closeMenu}
              >
                Shop
              </a>

              <a
                href="#new-arrivals"
                onClick={closeMenu}
              >
                New Arrivals
              </a>

              <a
                href="#sale"
                onClick={closeMenu}
              >
                Sale
              </a>

              <a
                href="#contact"
                onClick={closeMenu}
              >
                Contact
              </a>

            </nav>
          </div>
        )}
      </header>

      {/* ================= HERO ================= */}

      <section
        id="home"
        className="relative min-h-[78vh] overflow-hidden bg-black sm:min-h-[82vh] lg:min-h-[calc(100vh-80px)]"
      >
        {dailyImage && (
          <img
            src={dailyImage}
            alt="Snitch fashion collection"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        )}

        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[78vh] max-w-[1600px] items-center px-5 py-20 sm:min-h-[82vh] sm:px-8 md:px-12 lg:min-h-[calc(100vh-80px)] lg:px-16 xl:px-20">

          <div className="max-w-2xl text-white">

            <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] sm:text-sm">
              New Collection 2026
            </p>

            <h1 className="text-[clamp(3.2rem,11vw,8.5rem)] font-black leading-[0.82] tracking-[-0.07em]">
              WEAR
              <br />
              YOUR
              <br />
              ATTITUDE
            </h1>

            <p className="mt-7 max-w-lg text-sm leading-7 text-white/85 sm:text-base md:text-lg">
              Discover premium streetwear made for modern
              lifestyles. Clean silhouettes, bold designs and
              everyday comfort.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">

              <a
                href="#products"
                className="inline-flex items-center justify-center bg-white px-7 py-4 text-xs font-bold uppercase tracking-wider text-black transition hover:bg-black hover:text-white sm:px-8"
              >
                Shop Collection →
              </a>

              <a
                href="#new-arrivals"
                className="inline-flex items-center justify-center border border-white/70 px-7 py-4 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-white hover:text-black sm:px-8"
              >
                Explore New
              </a>

            </div>

          </div>
        </div>

        {/* Scroll */}

        <div className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 text-xs uppercase tracking-[0.25em] text-white/70 sm:block">
          Scroll to explore ↓
        </div>
      </section>

      {/* ================= DAILY DEAL ================= */}

      <section className="border-b border-gray-100 bg-black px-4 py-5 text-white sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400">
              Daily Drop
            </p>

            <p className="mt-1 text-sm font-semibold sm:text-base">
              New style drops every day
            </p>
          </div>

          <div className="flex items-center gap-2">

            <div className="rounded-lg bg-white/10 px-3 py-2">
              <span className="text-lg font-bold">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
              <span className="ml-1 text-[9px] text-gray-400">
                HRS
              </span>
            </div>

            <span>:</span>

            <div className="rounded-lg bg-white/10 px-3 py-2">
              <span className="text-lg font-bold">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
              <span className="ml-1 text-[9px] text-gray-400">
                MIN
              </span>
            </div>

            <span>:</span>

            <div className="rounded-lg bg-white/10 px-3 py-2">
              <span className="text-lg font-bold">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
              <span className="ml-1 text-[9px] text-gray-400">
                SEC
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* ================= PRODUCTS ================= */}

      <section
        id="products"
        className="mx-auto max-w-[1600px] px-4 py-14 sm:px-6 sm:py-20 lg:px-10 xl:px-16"
      >

        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 sm:text-xs">
              Shop Collection
            </p>

            <h2 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
              Featured Products
            </h2>
          </div>

          <p className="max-w-md text-sm leading-6 text-gray-500">
            Premium everyday essentials designed for modern
            streetwear lovers.
          </p>

        </div>

        {/* Search + Sort */}

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div className="w-full md:max-w-sm">

            <div className="relative">

              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 pr-10 text-sm outline-none transition focus:border-black focus:bg-white"
              />

              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-gray-400">
                ⌕
              </span>

            </div>

          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-12 w-full rounded-lg border border-gray-200 bg-white px-4 text-sm outline-none md:w-52"
          >
            <option value="featured">
              Featured
            </option>

            <option value="price-low">
              Price: Low to High
            </option>

            <option value="price-high">
              Price: High to Low
            </option>

            <option value="rating">
              Highest Rated
            </option>
          </select>

        </div>

        {/* Categories */}

        <div className="mb-10 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">

          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`whitespace-nowrap rounded-full px-5 py-2.5 text-xs font-semibold transition sm:px-6 ${
                category === item
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {item}
            </button>
          ))}

        </div>

        {/* Product Grid */}

        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-lg font-semibold">
              No products found
            </p>

            <button
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
              className="mt-4 bg-black px-6 py-3 text-sm text-white"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group min-w-0"
              >

                {/* Image */}

                <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-100">

                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />

                  {/* Badge */}

                  <span className="absolute left-2 top-2 rounded-full bg-white px-2 py-1 text-[8px] font-bold tracking-wide sm:left-3 sm:top-3 sm:px-3 sm:py-1.5 sm:text-[9px]">
                    {product.badge}
                  </span>

                  {/* Wishlist */}

                  <button
                    onClick={() =>
                      toggleWishlist(product.id)
                    }
                    className={`absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg shadow-sm transition sm:right-3 sm:top-3 sm:h-10 sm:w-10 ${
                      wishlist.includes(product.id)
                        ? "text-red-500"
                        : "text-black"
                    }`}
                  >
                    {wishlist.includes(product.id)
                      ? "♥"
                      : "♡"}
                  </button>

                  {/* Quick View */}

                  <button
                    onClick={() => {
                      setQuickProduct(product);
                      setSelectedSize("M");
                    }}
                    className="absolute bottom-3 left-2 right-2 hidden bg-white py-3 text-[10px] font-bold uppercase tracking-wider transition hover:bg-black hover:text-white sm:block sm:left-3 sm:right-3"
                  >
                    Quick View
                  </button>

                </div>

                {/* Product Details */}

                <div className="pt-3 sm:pt-4">

                  <p className="text-[9px] uppercase tracking-wider text-gray-400 sm:text-[10px]">
                    {product.category}
                  </p>

                  <h3 className="mt-1 truncate text-xs font-semibold sm:text-sm md:text-base">
                    {product.name}
                  </h3>

                  <div className="mt-1 flex items-center gap-1 text-[10px] sm:text-xs">
                    <span>★</span>
                    <span>{product.rating}</span>
                    <span className="text-gray-400">
                      ({product.reviews})
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-1.5 sm:gap-2">

                    <span className="text-xs font-bold sm:text-sm md:text-base">
                      Rs. {product.price.toLocaleString()}
                    </span>

                    <span className="text-[10px] text-gray-400 line-through sm:text-xs">
                      Rs. {product.oldPrice.toLocaleString()}
                    </span>

                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    className="mt-3 w-full bg-black py-2.5 text-[9px] font-bold uppercase tracking-wider text-white transition hover:bg-gray-800 sm:py-3 sm:text-[10px]"
                  >
                    Add to Cart
                  </button>

                </div>
              </div>
            ))}
          </div>
        )}

      </section>

      {/* ================= PROMO ================= */}

      <section className="bg-gray-100 px-4 py-14 sm:px-6 sm:py-20 lg:px-10">
        <div className="mx-auto grid max-w-[1400px] overflow-hidden rounded-2xl bg-black md:grid-cols-2">

          <div className="flex flex-col justify-center p-7 text-white sm:p-10 md:p-14 lg:p-20">

            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400">
              Premium Collection
            </p>

            <h2 className="mt-4 text-3xl font-black leading-tight sm:text-4xl md:text-5xl">
              BUILT FOR
              <br />
              EVERY DAY.
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-gray-400">
              Minimal designs. Premium fabrics. Comfortable
              fits. Everything you need to upgrade your
              everyday wardrobe.
            </p>

            <a
              href="#products"
              className="mt-7 inline-flex w-fit bg-white px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-black transition hover:bg-gray-200"
            >
              Shop Now
            </a>

          </div>

          <div className="min-h-[350px] md:min-h-[500px]">

            <img
              src={dailyImage}
              alt="Premium collection"
              className="h-full w-full object-cover"
            />

          </div>

        </div>
      </section>

      {/* ================= NEW ARRIVALS ================= */}

      <section
        id="new-arrivals"
        className="mx-auto max-w-[1600px] px-4 py-14 sm:px-6 sm:py-20 lg:px-10 xl:px-16"
      >

        <div className="mb-8 flex items-end justify-between">

          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 sm:text-xs">
              Just Dropped
            </p>

            <h2 className="text-3xl font-black sm:text-4xl">
              New Arrivals
            </h2>
          </div>

          <span className="hidden text-xs text-gray-400 sm:block">
            04 Products
          </span>

        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">

          {products.slice(0, 4).map((product) => (
            <div
              key={product.id}
              className="group"
            >

              <div className="aspect-[3/4] overflow-hidden rounded-xl bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>

              <div className="pt-3">

                <h3 className="truncate text-xs font-semibold sm:text-sm">
                  {product.name}
                </h3>

                <p className="mt-1 text-xs font-bold">
                  Rs. {product.price.toLocaleString()}
                </p>

              </div>

            </div>
          ))}

        </div>

      </section>

      {/* ================= SALE ================= */}

      <section
        id="sale"
        className="relative overflow-hidden bg-black px-5 py-16 text-center text-white sm:px-8 sm:py-24"
      >

        <div className="relative z-10 mx-auto max-w-3xl">

          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-gray-400 sm:text-xs">
            Limited Time
          </p>

          <h2 className="mt-4 text-5xl font-black tracking-[-0.05em] sm:text-7xl md:text-8xl">
            UP TO 40% OFF
          </h2>

          <p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-gray-400 sm:text-base">
            Grab your favorite styles before they are gone.
            Limited stock available.
          </p>

          <a
            href="#products"
            className="mt-8 inline-flex bg-white px-8 py-4 text-xs font-bold uppercase tracking-wider text-black transition hover:bg-gray-200"
          >
            Shop Sale
          </a>

        </div>

      </section>

      {/* ================= CONTACT ================= */}

      <section
        id="contact"
        className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-24 lg:px-12"
      >

        <div className="grid gap-10 md:grid-cols-2 md:items-end">

          <div>

            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">
              Stay Connected
            </p>

            <h2 className="mt-4 text-4xl font-black sm:text-5xl md:text-6xl">
              JOIN THE
              <br />
              SNITCH CLUB.
            </h2>

          </div>

          <div>

            <p className="mb-5 max-w-md text-sm leading-6 text-gray-500">
              Get updates about new drops, exclusive deals and
              upcoming collections.
            </p>

            <div className="flex flex-col gap-2 sm:flex-row">

              <input
                type="email"
                placeholder="Enter your email"
                className="h-12 flex-1 rounded-lg border border-gray-200 px-4 text-sm outline-none focus:border-black"
              />

              <button className="h-12 bg-black px-7 text-xs font-bold uppercase tracking-wider text-white">
                Subscribe
              </button>

            </div>

          </div>

        </div>

      </section>

      {/* ================= FOOTER ================= */}

      <footer className="border-t border-gray-100 bg-white">

        <div className="mx-auto grid max-w-[1600px] gap-10 px-5 py-12 sm:px-8 md:grid-cols-4 lg:px-12">

          <div className="md:col-span-2">

            <h2 className="text-3xl font-black tracking-[-0.08em]">
              SNITCH
            </h2>

            <p className="mt-4 max-w-sm text-sm leading-6 text-gray-500">
              Modern fashion for modern lifestyles. Premium
              streetwear, clean designs and everyday comfort.
            </p>

          </div>

          <div>

            <h3 className="text-xs font-bold uppercase tracking-wider">
              Shop
            </h3>

            <div className="mt-5 flex flex-col gap-3 text-sm text-gray-500">

              <a href="#products">All Products</a>
              <a href="#new-arrivals">New Arrivals</a>
              <a href="#sale">Sale</a>

            </div>

          </div>

          <div>

            <h3 className="text-xs font-bold uppercase tracking-wider">
              Help
            </h3>

            <div className="mt-5 flex flex-col gap-3 text-sm text-gray-500">

              <a href="#contact">Contact Us</a>
              <a href="#contact">Shipping</a>
              <a href="#contact">Returns</a>

            </div>

          </div>

        </div>

        <div className="border-t border-gray-100 px-5 py-5 text-center text-[10px] text-gray-400 sm:px-8">
          © 2026 SNITCH. All rights reserved.
        </div>

      </footer>

      {/* ================= CART DRAWER ================= */}

      {cartOpen && (
        <div
          className="fixed inset-0 z-[150] bg-black/50"
          onClick={() => setCartOpen(false)}
        />
      )}

      <aside
        className={`fixed right-0 top-0 z-[160] flex h-full w-full flex-col bg-white shadow-2xl transition-transform duration-300 sm:max-w-[430px] ${
          cartOpen
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >

        <div className="flex items-center justify-between border-b px-5 py-5">

          <div>
            <h2 className="text-lg font-bold">
              Your Cart
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              {cartItems} items
            </p>
          </div>

          <button
            onClick={() => setCartOpen(false)}
            className="text-2xl"
          >
            ×
          </button>

        </div>

        {/* Shipping Progress */}

        <div className="border-b px-5 py-4">

          {remainingForFreeShipping > 0 ? (
            <p className="text-xs text-gray-500">
              Add{" "}
              <span className="font-bold text-black">
                Rs. {remainingForFreeShipping.toLocaleString()}
              </span>{" "}
              more for free shipping
            </p>
          ) : (
            <p className="text-xs font-semibold text-green-600">
              🎉 You unlocked free shipping!
            </p>
          )}

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full bg-black transition-all"
              style={{
                width: `${shippingProgress}%`,
              }}
            />
          </div>

        </div>

        {/* Cart Items */}

        <div className="flex-1 overflow-y-auto px-5">

          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">

              <div className="text-5xl">
                🛒
              </div>

              <h3 className="mt-5 text-lg font-bold">
                Your cart is empty
              </h3>

              <p className="mt-2 text-sm text-gray-400">
                Add something you love.
              </p>

              <button
                onClick={() => setCartOpen(false)}
                className="mt-6 bg-black px-6 py-3 text-xs font-bold uppercase text-white"
              >
                Continue Shopping
              </button>

            </div>
          ) : (
            <div className="divide-y">

              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="flex gap-4 py-5"
                >

                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-24 w-20 rounded-lg object-cover"
                  />

                  <div className="min-w-0 flex-1">

                    <div className="flex justify-between gap-3">

                      <div>
                        <h3 className="truncate text-sm font-semibold">
                          {item.name}
                        </h3>

                        <p className="mt-1 text-xs text-gray-400">
                          Size: {item.size}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          removeFromCart(
                            item.id,
                            item.size
                          )
                        }
                        className="text-gray-400"
                      >
                        ×
                      </button>

                    </div>

                    <div className="mt-4 flex items-center justify-between">

                      <div className="flex items-center rounded-lg border">

                        <button
                          onClick={() =>
                            decreaseQuantity(
                              item.id,
                              item.size
                            )
                          }
                          className="px-3 py-1.5"
                        >
                          −
                        </button>

                        <span className="px-2 text-sm">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            increaseQuantity(
                              item.id,
                              item.size
                            )
                          }
                          className="px-3 py-1.5"
                        >
                          +
                        </button>

                      </div>

                      <p className="text-sm font-bold">
                        Rs.{" "}
                        {(
                          item.price * item.quantity
                        ).toLocaleString()}
                      </p>

                    </div>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

        {/* Cart Bottom */}

        {cart.length > 0 && (
          <div className="border-t bg-white p-5">

            {/* Coupon */}

            <div className="mb-5">

              <div className="flex gap-2">

                <input
                  value={couponInput}
                  onChange={(e) =>
                    setCouponInput(e.target.value)
                  }
                  placeholder="Coupon code"
                  className="h-11 min-w-0 flex-1 rounded-lg border px-3 text-xs outline-none"
                />

                <button
                  onClick={applyCoupon}
                  className="h-11 rounded-lg bg-black px-4 text-xs font-bold text-white"
                >
                  Apply
                </button>

              </div>

              {couponMessage && (
                <p className="mt-2 text-xs text-gray-500">
                  {couponMessage}
                </p>
              )}

            </div>

            <div className="space-y-2 text-sm">

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Subtotal
                </span>

                <span>
                  Rs. {subtotal.toLocaleString()}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>
                    - Rs. {discount.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex justify-between">

                <span className="text-gray-500">
                  Shipping
                </span>

                <span>
                  {shipping === 0
                    ? "FREE"
                    : `Rs. ${shipping}`}
                </span>

              </div>

              <div className="flex justify-between border-t pt-3 text-base font-bold">
                <span>Total</span>

                <span>
                  Rs. {total.toLocaleString()}
                </span>
              </div>

            </div>

            <button className="mt-5 w-full bg-black py-4 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-gray-800">
              Checkout →
            </button>

          </div>
        )}

      </aside>

      {/* ================= WISHLIST DRAWER ================= */}

      {wishlistOpen && (
        <div
          className="fixed inset-0 z-[150] bg-black/50"
          onClick={() => setWishlistOpen(false)}
        />
      )}

      <aside
        className={`fixed right-0 top-0 z-[160] flex h-full w-full flex-col bg-white shadow-2xl transition-transform duration-300 sm:max-w-[430px] ${
          wishlistOpen
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >

        <div className="flex items-center justify-between border-b px-5 py-5">

          <h2 className="text-lg font-bold">
            Wishlist
          </h2>

          <button
            onClick={() => setWishlistOpen(false)}
            className="text-2xl"
          >
            ×
          </button>

        </div>

        <div className="flex-1 overflow-y-auto px-5">

          {wishlistProducts.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">

              <div className="text-5xl">
                ♡
              </div>

              <h3 className="mt-5 font-bold">
                Wishlist is empty
              </h3>

              <p className="mt-2 text-sm text-gray-400">
                Save products you love.
              </p>

            </div>
          ) : (
            <div className="divide-y">

              {wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-4 py-5"
                >

                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-28 w-24 rounded-lg object-cover"
                  />

                  <div className="flex min-w-0 flex-1 flex-col">

                    <h3 className="truncate text-sm font-semibold">
                      {product.name}
                    </h3>

                    <p className="mt-1 text-sm font-bold">
                      Rs. {product.price.toLocaleString()}
                    </p>

                    <button
                      onClick={() =>
                        addToCart(product)
                      }
                      className="mt-auto bg-black px-4 py-2 text-[10px] font-bold uppercase text-white"
                    >
                      Add to Cart
                    </button>

                  </div>

                  <button
                    onClick={() =>
                      toggleWishlist(product.id)
                    }
                    className="text-red-500"
                  >
                    ♥
                  </button>

                </div>
              ))}

            </div>
          )}

        </div>

      </aside>

      {/* ================= QUICK VIEW MODAL ================= */}

      {quickProduct && (
        <div className="fixed inset-0 z-[180] flex items-center justify-center bg-black/60 p-4">

          <div className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white">

            <button
              onClick={() => setQuickProduct(null)}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-2xl shadow"
            >
              ×
            </button>

            <div className="grid md:grid-cols-2">

              <div className="aspect-[3/4] md:aspect-auto md:min-h-[550px]">

                <img
                  src={quickProduct.image}
                  alt={quickProduct.name}
                  className="h-full w-full object-cover"
                />

              </div>

              <div className="flex flex-col justify-center p-6 sm:p-10">

                <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400">
                  {quickProduct.category}
                </p>

                <h2 className="mt-3 text-2xl font-black sm:text-3xl">
                  {quickProduct.name}
                </h2>

                <div className="mt-3 flex items-center gap-2 text-sm">
                  <span>★</span>
                  <span>{quickProduct.rating}</span>
                  <span className="text-gray-400">
                    ({quickProduct.reviews} reviews)
                  </span>
                </div>

                <div className="mt-5 flex items-center gap-3">

                  <span className="text-xl font-bold">
                    Rs.{" "}
                    {quickProduct.price.toLocaleString()}
                  </span>

                  <span className="text-sm text-gray-400 line-through">
                    Rs.{" "}
                    {quickProduct.oldPrice.toLocaleString()}
                  </span>

                </div>

                <p className="mt-5 text-sm leading-7 text-gray-500">
                  {quickProduct.description}
                </p>

                {/* Sizes */}

                <div className="mt-7">

                  <p className="mb-3 text-xs font-bold uppercase tracking-wider">
                    Select Size
                  </p>

                  <div className="flex gap-2">

                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() =>
                          setSelectedSize(size)
                        }
                        className={`flex h-11 w-11 items-center justify-center border text-xs font-semibold ${
                          selectedSize === size
                            ? "border-black bg-black text-white"
                            : "border-gray-200 hover:border-black"
                        }`}
                      >
                        {size}
                      </button>
                    ))}

                  </div>

                </div>

                <button
                  onClick={() =>
                    addToCart(
                      quickProduct,
                      selectedSize
                    )
                  }
                  className="mt-8 w-full bg-black py-4 text-xs font-bold uppercase tracking-wider text-white"
                >
                  Add to Cart →
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}