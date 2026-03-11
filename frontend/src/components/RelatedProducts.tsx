'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import type { RelatedProduct } from '@/lib/payload';
import AddToCartButton from './AddToCartButton';

export default function RelatedProducts({ products }: { products: RelatedProduct[] }) {
  return (
    <div className="flex flex-col gap-10">
      {products.map((product) => (
        <RelatedProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function RelatedProductCard({ product }: { product: RelatedProduct }) {
  return (
    <div className="flex flex-col md:flex-row gap-8 items-start pb-10 border-b border-black last:border-0">
      {/* Image */}
      <div className="flex-shrink-0">
        <Link href={`/products/${product.slug}`}>
          <Image
            src={product.image.url}
            alt={product.image.alt}
            width={200}
            height={180}
            className="w-40 h-auto object-contain"
          />
        </Link>
      </div>

      {/* Details */}
      <div className="flex-1">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-lg font-black mb-2 hover:underline">{product.title}</h3>
        </Link>

        {/* Stars */}
        <div className="flex gap-1 mb-3">
          {Array.from({ length: product.starCount }).map((_, i) => (
            <Image
              key={i}
              src={product.starIconUrl}
              alt="star"
              width={16}
              height={16}
              className="w-4 h-4"
            />
          ))}
        </div>

        <p className="text-sm mb-4 text-gray-700">{product.description}</p>

        <AddToCartButton
          medusaProductId={product.medusaProductId || `prod_${product.slug}`}
          price={product.price}
        />
      </div>
    </div>
  );
}
