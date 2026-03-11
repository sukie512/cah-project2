'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  createCart,
  getCart,
  addToCart,
  updateLineItem,
  removeLineItem,
  type MedusaCart,
  type MedusaLineItem,
} from '@/lib/medusa';

interface CartContextValue {
  cart: MedusaCart | null;
  isOpen: boolean;
  isLoading: boolean;
  itemCount: number;
  openCart: () => void;
  closeCart: () => void;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateItem: (lineItemId: string, quantity: number) => Promise<void>;
  removeItem: (lineItemId: string) => Promise<void>;
}

const CartContext = createContext<CartContextValue>({} as CartContextValue);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<MedusaCart | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialise cart from localStorage on mount
  useEffect(() => {
    const init = async () => {
      const stored = localStorage.getItem('medusa_cart_id');
      if (stored) {
        try {
          const { cart: existing } = await getCart(stored);
          setCart(existing);
          return;
        } catch {
          localStorage.removeItem('medusa_cart_id');
        }
      }
      try {
        const { cart: fresh } = await createCart();
        localStorage.setItem('medusa_cart_id', fresh.id);
        setCart(fresh);
      } catch {
        // Medusa not running — skip silently
      }
    };
    init();
  }, []);

  const refreshCart = useCallback(async (cartId: string) => {
    const { cart: updated } = await getCart(cartId);
    setCart(updated);
  }, []);

  const addItem = useCallback(
    async (variantId: string, quantity = 1) => {
      if (!cart) return;
      setIsLoading(true);
      try {
        const { cart: updated } = await addToCart(cart.id, variantId, quantity);
        setCart(updated);
        setIsOpen(true);
      } finally {
        setIsLoading(false);
      }
    },
    [cart],
  );

  const updateItem = useCallback(
    async (lineItemId: string, quantity: number) => {
      if (!cart) return;
      setIsLoading(true);
      try {
        const { cart: updated } = await updateLineItem(cart.id, lineItemId, quantity);
        setCart(updated);
      } finally {
        setIsLoading(false);
      }
    },
    [cart],
  );

  const removeItem = useCallback(
    async (lineItemId: string) => {
      if (!cart) return;
      setIsLoading(true);
      try {
        const { cart: updated } = await removeLineItem(cart.id, lineItemId);
        setCart(updated);
      } finally {
        setIsLoading(false);
      }
    },
    [cart],
  );

  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        isLoading,
        itemCount,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addItem,
        updateItem,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
