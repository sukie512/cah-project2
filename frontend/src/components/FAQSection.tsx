'use client';

import { useState } from 'react';
import type { FAQItem } from '@/lib/payload';

export default function FAQSection({ faqs }: { faqs: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="max-w-3xl">
      {faqs.map((faq, i) => (
        <div key={i} className="border-t border-black">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full text-left py-5 flex items-start justify-between gap-4 hover:underline"
            aria-expanded={open === i}
          >
            <h3 className="text-base font-bold">{faq.question}</h3>
            <span className="text-xl leading-none flex-shrink-0 mt-0.5">
              {open === i ? '−' : '+'}
            </span>
          </button>
          {open === i && (
            <div className="pb-5 text-sm leading-relaxed text-gray-700">
              <p>{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
      <div className="border-t border-black" />
    </div>
  );
}
