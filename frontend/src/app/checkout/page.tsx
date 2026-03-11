'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/CartContext';
import {
  addEmail, addShippingAddress, listShippingOptions, addShippingMethod,
  createPaymentSession, setPaymentSession, completeCart, formatPrice,
  type MedusaAddress, type MedusaShippingOption,
} from '@/lib/medusa';

type Step = 'contact' | 'shipping' | 'payment' | 'confirm';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, closeCart } = useCart();
  const [step, setStep] = useState<Step>('contact');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [shippingOptions, setShippingOptions] = useState<MedusaShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState('');

  const [email, setEmail] = useState('');
  const [address, setAddress] = useState<MedusaAddress>({
    first_name: '', last_name: '', address_1: '',
    city: '', country_code: 'us', postal_code: '',
  });

  if (orderId) {
    return (
      <div className="max-w-lg mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-black mb-4">Order Placed! 🎉</h1>
        <p className="text-sm text-gray-600 mb-2">Order ID: <strong>{orderId}</strong></p>
        <p className="text-sm mb-8">Thanks for your order. You&apos;ll hear from us soon.</p>
        <button onClick={() => router.push('/')}
          className="bg-black text-white font-bold uppercase text-sm px-8 py-3 hover:bg-gray-900 transition-colors">
          Back to Shop
        </button>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-black mb-4">Your cart is empty.</h1>
      </div>
    );
  }

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await addEmail(cart.id, email);
      setStep('shipping');
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleShipping = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await addShippingAddress(cart.id, address);
      const { shipping_options } = await listShippingOptions(cart.id);
      setShippingOptions(shipping_options);
      if (shipping_options[0]) setSelectedShipping(shipping_options[0].id);
      setStep('payment');
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      if (selectedShipping) await addShippingMethod(cart.id, selectedShipping);
      await createPaymentSession(cart.id);
      await setPaymentSession(cart.id, 'manual');
      setStep('confirm');
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleComplete = async () => {
    setLoading(true); setError('');
    try {
      const result = await completeCart(cart.id);
      localStorage.removeItem('medusa_cart_id');
      setOrderId(result.data.id || 'ORD-' + Date.now());
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-12">
      <h1 className="text-2xl font-black uppercase mb-2">Checkout</h1>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-10 text-xs font-bold uppercase tracking-wide">
        {(['contact', 'shipping', 'payment', 'confirm'] as Step[]).map((s, i) => (
          <span key={s} className={`flex items-center gap-2 ${step === s ? '' : 'text-gray-400'}`}>
            {i > 0 && <span className="text-gray-300">›</span>}
            {s}
          </span>
        ))}
      </div>

      {error && <p className="text-sm text-red-600 border border-red-600 px-4 py-3 mb-6">{error}</p>}

      {/* Step: Contact */}
      {step === 'contact' && (
        <form onSubmit={handleContact} className="flex flex-col gap-4 max-w-sm">
          <h2 className="text-lg font-black mb-2">Contact</h2>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-wide">Email</span>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="border border-black px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black" />
          </label>
          <button type="submit" disabled={loading}
            className="bg-black text-white font-bold uppercase text-sm py-3 hover:bg-gray-900 disabled:opacity-50">
            {loading ? '...' : 'Continue to Shipping'}
          </button>
        </form>
      )}

      {/* Step: Shipping */}
      {step === 'shipping' && (
        <form onSubmit={handleShipping} className="flex flex-col gap-4 max-w-sm">
          <h2 className="text-lg font-black mb-2">Shipping Address</h2>
          {(['first_name', 'last_name', 'address_1', 'city', 'postal_code'] as (keyof MedusaAddress)[]).map(field => (
            <label key={field} className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase tracking-wide">{field.replace('_', ' ')}</span>
              <input required value={address[field]}
                onChange={e => setAddress({ ...address, [field]: e.target.value })}
                className="border border-black px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black" />
            </label>
          ))}
          <button type="submit" disabled={loading}
            className="bg-black text-white font-bold uppercase text-sm py-3 hover:bg-gray-900 disabled:opacity-50">
            {loading ? '...' : 'Continue to Payment'}
          </button>
        </form>
      )}

      {/* Step: Payment */}
      {step === 'payment' && (
        <form onSubmit={handlePayment} className="flex flex-col gap-4 max-w-sm">
          <h2 className="text-lg font-black mb-2">Payment</h2>

          {shippingOptions.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wide mb-2">Shipping Method</p>
              {shippingOptions.map(opt => (
                <label key={opt.id} className="flex items-center gap-3 py-2 cursor-pointer">
                  <input type="radio" name="shipping" value={opt.id}
                    checked={selectedShipping === opt.id}
                    onChange={() => setSelectedShipping(opt.id)} />
                  <span className="text-sm">{opt.name}</span>
                  <span className="text-sm font-bold ml-auto">{formatPrice(opt.amount)}</span>
                </label>
              ))}
            </div>
          )}

          <div className="border border-black px-4 py-3 bg-gray-50">
            <p className="text-xs font-bold uppercase tracking-wide mb-1">Test Payment</p>
            <p className="text-xs text-gray-600">This is a demo. No real payment will be charged.</p>
          </div>

          <button type="submit" disabled={loading}
            className="bg-black text-white font-bold uppercase text-sm py-3 hover:bg-gray-900 disabled:opacity-50">
            {loading ? '...' : 'Review Order'}
          </button>
        </form>
      )}

      {/* Step: Confirm */}
      {step === 'confirm' && (
        <div className="max-w-sm">
          <h2 className="text-lg font-black mb-4">Review Your Order</h2>
          <div className="border border-black p-4 mb-6">
            {cart.items.map(item => (
              <div key={item.id} className="flex justify-between text-sm py-1">
                <span>{item.variant?.product?.title} × {item.quantity}</span>
                <span className="font-bold">{formatPrice(item.subtotal)}</span>
              </div>
            ))}
            <div className="border-t border-black mt-3 pt-3 flex justify-between text-sm font-black">
              <span>Total</span>
              <span>{formatPrice(cart.total || cart.subtotal)}</span>
            </div>
          </div>
          <button onClick={handleComplete} disabled={loading}
            className="w-full bg-black text-white font-bold uppercase text-sm py-3 hover:bg-gray-900 disabled:opacity-50">
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      )}
    </div>
  );
}
