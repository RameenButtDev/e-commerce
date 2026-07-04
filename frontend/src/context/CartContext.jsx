import React, { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.product === product._id);
      const effectivePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
      if (existing) {
        return prev.map((i) =>
          i.product === product._id ? { ...i, qty: Math.min(i.qty + qty, product.countInStock) } : i
        );
      }
      return [
        ...prev,
        {
          product: product._id,
          name: product.name,
          image: product.images[0] || "",
          price: effectivePrice,
          countInStock: product.countInStock,
          qty,
        },
      ];
    });
  };

  const updateQty = (productId, qty) => {
    setCartItems((prev) => prev.map((i) => (i.product === productId ? { ...i, qty } : i)));
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((i) => i.product !== productId));
  };

  const clearCart = () => setCartItems([]);

  const itemsPrice = cartItems.reduce((acc, i) => acc + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, updateQty, removeFromCart, clearCart, itemsPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
