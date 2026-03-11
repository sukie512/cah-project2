'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useCart } from './CartContext';
import CartDrawer from './CartDrawer';

export default function Header() {
  const { itemCount, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-black">
        <div className="flex items-center justify-between px-4 md:px-8 h-14">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="https://www.cardsagainsthumanity.com/images/logo-header.svg"
              alt="Cards Against Humanity"
              width={160}
              height={28}
              priority
              className="h-7 w-auto"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-wide">
            <Link href="/shop/all" className="hover:underline">Shop</Link>
            <Link href="/about" className="hover:underline">About</Link>
            <button
              onClick={openCart}
              className="hover:underline flex items-center gap-1"
              aria-label={`Cart with ${itemCount} items`}
            >
              {itemCount}Cart
            </button>
          </nav>

          {/* Mobile nav */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={openCart} className="text-sm font-bold uppercase">
              {itemCount}Cart
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              className="flex flex-col gap-1 w-6"
            >
              <span className={`block h-0.5 bg-black transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`block h-0.5 bg-black transition-all ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-black transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <nav className="md:hidden border-t border-black">
            <div className="flex flex-col">
              <Link href="/shop/all" className="px-4 py-3 text-sm font-bold uppercase border-b border-black hover:bg-black hover:text-white" onClick={() => setMenuOpen(false)}>Shop</Link>
              <Link href="/about" className="px-4 py-3 text-sm font-bold uppercase hover:bg-black hover:text-white" onClick={() => setMenuOpen(false)}>About</Link>
            </div>
          </nav>
        )}
      </header>

      <CartDrawer />
    </>
  );
}
