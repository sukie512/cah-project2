'use client';

import { useState, useEffect } from 'react';
import { useCart } from './CartContext';
import { getMedusaProduct } from '@/lib/medusa';

interface Props {
  medusaProductId: string;
  price: number;
}

export default function AddToCartButton({ medusaProductId, price }: Props) {
  const { addItem } = useCart();
  const [variantId, setVariantId] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getMedusaProduct(medusaProductId)
      .then(({ product }) => {
        if (product?.variants?.[0]) setVariantId(product.variants[0].id);
      })
      .catch(() => {
        // Medusa not running — use fallback variant
        setVariantId(`fallback_${medusaProductId}`);
      });
  }, [medusaProductId]);

  const handleAdd = async () => {
    if (!variantId) return;
    setLoading(true);
    try {
      await addItem(variantId);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch {
      // show added anyway for demo
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-6">
      <button
        onClick={handleAdd}
        disabled={loading}
        className={`font-bold uppercase text-sm px-8 py-3 transition-colors ${
          added
            ? 'bg-gray-200 text-black cursor-default'
            : 'bg-black text-white hover:bg-gray-900'
        }`}
      >
        {added ? 'Added!' : loading ? '...' : 'Add to Cart'}
      </button>
      <span className="text-2xl font-black">${price}</span>
    </div>
  );
}
