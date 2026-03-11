import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getHomePage } from '@/lib/payload';
import FAQSection from '@/components/FAQSection';
import StuffCarousel from '@/components/StuffCarousel';
import ProductCardFlip from '@/components/ProductCardFlip';
import EmailForm from '@/components/EmailForm';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Cards Against Humanity',
  description: 'Cards Against Humanity is a fill-in-the-blank party game that turns your awkward personality and lackluster social skills into hours of fun!',
};

export default async function HomePage() {
  const page = await getHomePage();

  return (
    <>
      <section className="flex flex-col items-center text-center px-4 pt-16 pb-8">
        <Image
          src={page.hero.logoUrl}
          alt="Cards Against Humanity"
          width={300}
          height={120}
          priority
          className="w-64 md:w-80 mb-6"
          unoptimized
        />
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-2">
          {page.hero.tagline}
        </h1>
        <blockquote className="text-lg md:text-xl italic mb-1">{page.hero.quote}</blockquote>
        <cite className="text-sm not-italic text-gray-600 mb-8">{page.hero.quoteSource}</cite>
        <p className="max-w-xl text-base md:text-lg leading-relaxed mb-4">
          <strong>Cards Against Humanity</strong> is a fill-in-the-blank party game that turns your awkward personality and lackluster social skills into hours of fun! Wow.
        </p>
        <blockquote className="text-lg italic mb-2">&ldquo;Stupid.&rdquo;</blockquote>
        <cite className="text-sm not-italic text-gray-600 mb-8">Bloomberg</cite>
        <p className="max-w-lg text-sm md:text-base text-center">
          The game is simple. Each round, one player asks a question from a black card, and everyone else answers with their funniest white card.
        </p>
      </section>

      <hr className="border-t border-black mx-4 md:mx-8" />

      <section className="px-4 md:px-8 py-12">
        <h2 className="text-2xl md:text-3xl font-black mb-10">{page.shop.heading}</h2>
        <div className="flex flex-col gap-12">
          {page.shop.products.map((product) => (
            <ProductCardFlip key={product.id} product={product} />
          ))}
        </div>
      </section>

      <hr className="border-t border-black mx-4 md:mx-8" />

      <section className="px-4 md:px-8 py-12 relative">
        <h2 className="text-2xl md:text-3xl font-black mb-6">{page.steal.heading}</h2>
        <p className="max-w-2xl text-sm md:text-base leading-relaxed mb-4">
          Since day one, Cards Against Humanity has been available as a{' '}
          <a href={page.steal.downloadUrl} target="_blank" rel="noopener noreferrer" className="underline">
            free download on our website
          </a>
          . You can download the PDFs and printing instructions right here—all you need is a printer, scissors, and a prehensile appendage.
        </p>
        <p className="text-xs text-gray-500 mb-6">
          Please note: there&apos;s no legal way to use these PDFs to make money, so don&apos;t ask.
        </p>
        <div className="flex items-center gap-6">
          <a href={page.steal.downloadUrl} className="bg-black text-white font-bold uppercase text-sm px-6 py-3 hover:bg-gray-900 transition-colors" target="_blank" rel="noopener noreferrer">
            Download Files
          </a>
          <Image src={page.steal.badgeImageUrl} alt="Free! Download now!" width={100} height={100} className="w-20 h-20" unoptimized />
        </div>
      </section>

      <hr className="border-t border-black mx-4 md:mx-8" />

      <section className="px-4 md:px-8 py-12">
        <p className="text-xs font-bold uppercase tracking-widest mb-2">Advertisement</p>
        <h2 className="text-2xl md:text-3xl font-black mb-8">{page.stuff.heading}</h2>
        <StuffCarousel items={page.stuff.items} />
      </section>

      <hr className="border-t border-black mx-4 md:mx-8" />

      <section className="px-4 md:px-8 py-12">
        <div className="max-w-lg">
          <h2 className="text-xl md:text-2xl font-black mb-6">{page.email.heading}</h2>
          <EmailForm />
          <p className="text-xs text-gray-500 mt-3 italic">{page.email.disclaimer}</p>
        </div>
      </section>

      <hr className="border-t border-black mx-4 md:mx-8" />

      <section className="px-4 md:px-8 py-12">
        <h2 className="text-2xl md:text-3xl font-black mb-8">Your dumb questions.</h2>
        <FAQSection faqs={page.faqs} />
      </section>
    </>
  );
}
