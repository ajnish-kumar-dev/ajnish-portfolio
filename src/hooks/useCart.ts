import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as cartService from '../services/cartService';
import type { CartWithProduct } from '../services/cartService';

interface CartContextType {
  items: CartWithProduct[];
  loading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  getCartTotal: () => { subtotal: number; count: number };
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartWithProduct[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshCart = async () => {
    if (!user) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const cartItems = await cartService.getCart(user.id);
      setItems(cartItems);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [user?.id]);

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!user) throw new Error('Please login to add items to cart');
    await cartService.addToCart(user.id, productId, quantity);
    await refreshCart();
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (!user) return;
    if (quantity <= 0) {
      await removeItem(cartItemId);
      return;
    }
    await cartService.updateCartItem(user.id, cartItemId, quantity);
    await refreshCart();
  };

  const removeItem = async (cartItemId: string) => {
    if (!user) return;
    await cartService.removeCartItem(user.id, cartItemId);
    await refreshCart();
  };

  const clearCart = async () => {
    if (!user) return;
    await cartService.clearCart(user.id);
    setItems([]);
  };

  const getCartTotal = () => {
    const subtotal = items.reduce((sum, item) => {
      const price = item.product?.price || 0;
      return sum + price * item.quantity;
    }, 0);
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    return { subtotal, count };
  };

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
