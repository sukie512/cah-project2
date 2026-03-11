'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/components/CartContext';
import { formatPrice } from '@/lib/medusa';

export default function CartPage() {
  const { cart, updateItem, removeItem, isLoading } = useCart();

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-black mb-4">Your cart is empty.</h1>
        <Link href="/" className="underline text-sm">Keep shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-12">
      <h1 className="text-2xl font-black mb-8 uppercase">Cart</h1>

      <div className="flex flex-col gap-6">
        {cart.items.map((item) => (
          <div key={item.id} className="flex gap-4 pb-6 border-b border-black">
            {item.thumbnail && (
              <Image src={item.thumbnail} alt={item.title} width={80} height={80}
                className="w-20 h-20 object-contain border border-black flex-shrink-0" />
            )}
            <div className="flex-1">
              <p className="font-bold text-sm">{item.variant?.product?.title}</p>
              <p className="text-xs text-gray-600 mb-3">{item.variant?.title}</p>
              <div className="flex items-center gap-2">
                <button onClick={() => updateItem(item.id, Math.max(0, item.quantity - 1))}
                  disabled={isLoading}
                  className="w-7 h-7 border border-black flex items-center justify-center hover:bg-black hover:text-white text-sm">−</button>
                <span className="text-sm w-6 text-center">{item.quantity}</span>
                <button onClick={() => updateItem(item.id, item.quantity + 1)}
                  disabled={isLoading}
                  className="w-7 h-7 border border-black flex items-center justify-center hover:bg-black hover:text-white text-sm">+</button>
                <button onClick={() => removeItem(item.id)} disabled={isLoading}
                  className="ml-4 text-xs text-gray-400 hover:text-black underline">Remove</button>
              </div>
            </div>
            <div className="font-bold text-sm">{formatPrice(item.subtotal)}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-end gap-4">
        <div className="flex justify-between w-full max-w-xs text-sm font-bold">
          <span>Subtotal</span>
          <span>{formatPrice(cart.subtotal)}</span>
        </div>
        <Link href="/checkout"
          className="bg-black text-white font-bold uppercase text-sm px-10 py-3 hover:bg-gray-900 transition-colors">
          Checkout
        </Link>
      </div>
    </div>
  );
}
