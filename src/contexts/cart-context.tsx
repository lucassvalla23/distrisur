import React, { createContext, useState, useContext, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  boxPrice?: number;
  boxQuantity?: number;
  image: string;
  quantity: number;
  isBox: boolean;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, isBox: boolean) => void;
  updateQuantity: (id: string, quantity: number, isBox: boolean) => void;
  clearCart: () => void;
  itemCount: number;
  total: number;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  itemCount: 0,
  total: 0
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    // Load cart from localStorage on initial render
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Calculate total items and price
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  const total = items.reduce((sum, item) => {
    const itemPrice = item.isBox ? (item.boxPrice || 0) : item.price;
    return sum + (itemPrice * item.quantity);
  }, 0);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  // Add item to cart
  const addItem = (item: CartItem) => {
    setItems(prevItems => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(
        i => i.id === item.id && i.isBox === item.isBox
      );

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += item.quantity;
        return updatedItems;
      } else {
        // Add new item if it doesn't exist
        return [...prevItems, item];
      }
    });
  };

  // Remove item from cart
  const removeItem = (id: string, isBox: boolean) => {
    setItems(prevItems => 
      prevItems.filter(item => !(item.id === id && item.isBox === isBox))
    );
  };

  // Update item quantity
  const updateQuantity = (id: string, quantity: number, isBox: boolean) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id && item.isBox === isBox
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      itemCount,
      total
    }}>
      {children}
    </CartContext.Provider>
  );
};
