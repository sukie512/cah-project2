'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

interface StuffItem {
  imageUrl: string;
  label: string;
  title: string;
  linkText: string;
  href: string;
}

export default function StuffCarousel({ items }: { items: StuffItem[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {items.map((item, i) => (
        <div key={i} className="flex flex-col">
          <div className="relative aspect-square overflow-hidden mb-3">
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest mb-1">{item.label}</span>
          <h3 className="text-base font-black mb-1">{item.title}</h3>
          <Link href={item.href} className="text-sm underline hover:no-underline">
            {item.linkText}
          </Link>
        </div>
      ))}
    </div>
  );
}
