import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/components/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Cards Against Humanity',
  description: 'Cards Against Humanity is a fill-in-the-blank party game that turns your awkward personality and lackluster social skills into hours of fun!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Header />
          <main id="maincontent">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
