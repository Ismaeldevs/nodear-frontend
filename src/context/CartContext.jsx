import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState([]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const addToCart = (product, size, color, quantity) => {
    setItems((prevItems) => {
      // Check if item exists (same id, size, color)
      const existingItemIndex = prevItems.findIndex(
        item => item.id === product.id && item.size === size && item.color === color
      );

      if (existingItemIndex > -1) {
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += quantity;
        return newItems;
      } else {
        return [...prevItems, { ...product, size, color, quantity }];
      }
    });
    openCart();
  };

  const removeFromCart = (itemId, size, color) => {
    setItems(items.filter(item => !(item.id === itemId && item.size === size && item.color === color)));
  };

  const updateQuantity = (itemId, size, color, delta) => {
     setItems(prevItems => prevItems.map(item => {
         if (item.id === itemId && item.size === size && item.color === color) {
             return { ...item, quantity: Math.max(1, item.quantity + delta) };
         }
         return item;
     }));
  };

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = items.reduce((sum, item) => {
    const price = typeof item.price === 'string' 
      ? parseFloat(item.price.replace('$', '')) 
      : parseFloat(item.price);
    return sum + (price * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{ 
      isOpen, 
      openCart, 
      closeCart, 
      toggleCart, 
      items, 
      addToCart, 
      removeFromCart,
      updateQuantity,
      cartCount,
      cartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
