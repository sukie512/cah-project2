'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import type { ProductCard } from '@/lib/payload';

interface Props {
  product: ProductCard;
}

export default function ProductCardFlip({ product }: Props) {
  const [hovered, setHovered] = useState(false);
  const hasTwo = product.images.length >= 2;
  const src = hasTwo && hovered ? product.images[1].url : product.images[0].url;
  const alt = hasTwo && hovered ? product.images[1].alt : product.images[0].alt;

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
      {/* Image with flip on hover */}
      <div
        className="flex-shrink-0 cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Image
          src={src}
          alt={alt}
          width={220}
          height={300}
          className="w-40 md:w-52 h-auto object-contain transition-opacity duration-200"
        />
      </div>

      {/* Text */}
      <div className="flex flex-col items-center md:items-start text-center md:text-left">
        <p className="text-base md:text-lg mb-4">{product.subtitle}</p>
        <Link
          href={product.ctaHref}
          className="inline-block bg-black text-white font-bold uppercase text-sm px-6 py-3 hover:bg-gray-900 transition-colors"
        >
          {product.ctaText}
        </Link>
      </div>
    </div>
  );
}
