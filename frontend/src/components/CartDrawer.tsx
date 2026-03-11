'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from './CartContext';
import { formatPrice } from '@/lib/medusa';

export default function CartDrawer() {
  const { cart, isOpen, closeCart, updateItem, removeItem, isLoading } = useCart();

  if (!isOpen) return null;

  const subtotal = cart?.subtotal ?? 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-50"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside className="cart-drawer fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 flex flex-col border-l border-black">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-black">
          <h2 className="text-base font-bold uppercase tracking-wide">Cart</h2>
          <button onClick={closeCart} aria-label="Close cart" className="text-2xl leading-none">&times;</button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {!cart || cart.items.length === 0 ? (
            <p className="text-sm text-gray-500 mt-8 text-center">Your cart is empty.</p>
          ) : (
            <ul className="flex flex-col gap-5">
              {cart.items.map((item) => (
                <li key={item.id} className="flex gap-4 items-start">
                  {item.thumbnail && (
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      width={64}
                      height={64}
                      className="object-contain border border-black flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold leading-tight">{item.variant?.product?.title}</p>
                    <p className="text-xs text-gray-600">{item.variant?.title}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateItem(item.id, Math.max(0, item.quantity - 1))}
                        className="w-6 h-6 border border-black text-sm flex items-center justify-center hover:bg-black hover:text-white"
                        disabled={isLoading}
                      >−</button>
                      <span className="text-sm w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateItem(item.id, item.quantity + 1)}
                        className="w-6 h-6 border border-black text-sm flex items-center justify-center hover:bg-black hover:text-white"
                        disabled={isLoading}
                      >+</button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-sm font-bold">{formatPrice(item.subtotal)}</span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-xs text-gray-400 hover:text-black underline"
                      disabled={isLoading}
                    >Remove</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {cart && cart.items.length > 0 && (
          <div className="px-5 py-4 border-t border-black">
            <div className="flex justify-between text-sm font-bold mb-4">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full bg-black text-white text-center text-sm font-bold uppercase py-3 tracking-wide hover:bg-gray-900 transition-colors"
            >
              Checkout
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
