const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001';

export interface HeroSection {
  logoUrl: string;
  tagline: string;
  quote: string;
  quoteSource: string;
  badgeIcons: { url: string; alt: string }[];
  description: string;
}

export interface ProductCard {
  id: string;
  title: string;
  subtitle: string;
  images: { url: string; alt: string }[];
  ctaText: string;
  ctaHref: string;
}

export interface ShopSection {
  heading: string;
  products: ProductCard[];
}

export interface StealSection {
  heading: string;
  body: string;
  downloadUrl: string;
  badgeImageUrl: string;
}

export interface StuffSection {
  heading: string;
  items: { imageUrl: string; label: string; title: string; linkText: string; href: string }[];
}

export interface EmailSection {
  heading: string;
  disclaimer: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface HomePage {
  hero: HeroSection;
  shop: ShopSection;
  steal: StealSection;
  stuff: StuffSection;
  email: EmailSection;
  faqs: FAQItem[];
}

export interface ProductImage {
  url: string;
  alt: string;
}

export interface ProductFeature {
  text: string;
}

export interface RelatedProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  slug: string;
  image: { url: string; alt: string };
  starCount: number;
  starIconUrl: string;
  newBadgeUrl?: string;
  medusaProductId?: string;
}

export interface ProductPage {
  title: string;
  slug: string;
  images: ProductImage[];
  description: string;
  features: ProductFeature[];
  price: number;
  medusaProductId: string;
  relatedProducts: RelatedProduct[];
}

export interface FooterData {
  logo: { url: string; alt: string };
  shopLinks: { label: string; href: string }[];
  infoLinks: { label: string; href: string }[];
  findUsLinks: { label: string; href: string }[];
  socialLinks: { platform: string; href: string; iconUrl: string }[];
  copyright: string;
}

async function fetchPayload<T>(path: string): Promise<T> {
  const res = await fetch(`${PAYLOAD_URL}/api${path}`, {
    next: { revalidate: 60 },
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error(`Payload fetch failed: ${path} → ${res.status}`);
  return res.json();
}

export async function getHomePage(): Promise<HomePage> {
  try {
    const data = await fetchPayload<{ docs: HomePage[] }>('/globals/home-page');
    return data as unknown as HomePage;
  } catch {
    // Fallback static data for development
    return getHomePageFallback();
  }
}

export async function getProductPage(slug: string): Promise<ProductPage> {
  try {
    const data = await fetchPayload<{ docs: ProductPage[] }>(
      `/products?where[slug][equals]=${slug}&limit=1`,
    );
    return (data as any).docs[0];
  } catch {
    return getProductPageFallback(slug);
  }
}

export async function getFooter(): Promise<FooterData> {
  try {
    return await fetchPayload<FooterData>('/globals/footer');
  } catch {
    return getFooterFallback();
  }
}

// ─── Fallback data (mirrors real site) ───────────────────────────────────────

function getHomePageFallback(): HomePage {
  return {
    hero: {
      logoUrl: 'https://www.cardsagainsthumanity.com/images/logo-hero.svg',
      tagline: 'Cards Against Humanity',
      quote: '"Bad."',
      quoteSource: 'NPR',
      badgeIcons: Array(9).fill({ url: '', alt: 'badge' }),
      description:
        'Cards Against Humanity is a fill-in-the-blank party game that turns your awkward personality and lackluster social skills into hours of fun! Wow.',
    },
    shop: {
      heading: 'Buy the game.',
      products: [
        {
          id: '1',
          title: 'Cards Against Humanity',
          subtitle: "America's #1 gerbil coffin.",
          images: [
            {
              url: 'https://img.cah.io/images/vc07edlh/production/69d14a8c4c8084841b5f3437eb8a06124162dc0d-660x1270.png?auto=format&q=75&w=300',
              alt: 'Cards Against Humanity Front',
            },
            {
              url: 'https://img.cah.io/images/vc07edlh/production/63e9bcc5935e9cae00a4a9594d3637d89608c443-660x1270.png?auto=format&q=75&w=300',
              alt: 'Cards Against Humanity Side',
            },
          ],
          ctaText: 'Buy Now',
          ctaHref: '/products/cards-against-humanity',
        },
        {
          id: '2',
          title: 'Family Edition',
          subtitle: 'Play CAH with your kids.',
          images: [
            {
              url: 'https://img.cah.io/images/vc07edlh/production/048109f3bcd6e2c21cb041f9e5d0ddeac9c3de2f-716x1294.png?auto=format&q=75&w=300',
              alt: 'Family Edition',
            },
          ],
          ctaText: 'Buy Family Edition',
          ctaHref: '/products/family-edition',
        },
        {
          id: '3',
          title: 'Expansions',
          subtitle: 'Moooooore cards!',
          images: [
            {
              url: 'https://img.cah.io/images/vc07edlh/production/6122ebf50190e25b00cbfd9d7960671bf6a0c054-660x1200.png?auto=format&q=75&w=300',
              alt: 'Expansions 1',
            },
            {
              url: 'https://img.cah.io/images/vc07edlh/production/e92ecce7e13c7339aa9bb54f7909e1cd9f7a8cd2-660x1200.png?auto=format&q=75&w=300',
              alt: 'Expansions 2',
            },
          ],
          ctaText: 'Buy Expansions',
          ctaHref: '/shop/expansions',
        },
        {
          id: '4',
          title: '$5 Packs',
          subtitle: "For whatever you're into.",
          images: [
            {
              url: 'https://img.cah.io/images/vc07edlh/production/41556c5c773ab42a27824ae1c8c73315653de2bf-660x1200.png?auto=format&q=75&w=300',
              alt: 'Pack 1',
            },
            {
              url: 'https://img.cah.io/images/vc07edlh/production/83bdf2fb8ba74ceca463163373d12d9ff432230b-660x1200.png?auto=format&q=75&w=300',
              alt: 'Pack 2',
            },
          ],
          ctaText: 'Buy $5 Packs',
          ctaHref: '/shop/packs',
        },
        {
          id: '5',
          title: 'Other Stuff',
          subtitle: 'What is this stuff?',
          images: [
            {
              url: 'https://img.cah.io/images/vc07edlh/production/157834f4caa229fab3949ffb256acc950bf07eb3-660x1200.png?auto=format&q=75&w=300',
              alt: 'Other 1',
            },
            {
              url: 'https://img.cah.io/images/vc07edlh/production/e67c712735852fa2228e1adebbbe24dfae58e8c8-660x1200.png?auto=format&q=75&w=300',
              alt: 'Other 2',
            },
          ],
          ctaText: 'Find Out',
          ctaHref: '/shop/other-stuff',
        },
      ],
    },
    steal: {
      heading: 'Steal the game.',
      body: 'Since day one, Cards Against Humanity has been available as a free download on our website. You can download the PDFs and printing instructions right here—all you need is a printer, scissors, and a prehensile appendage.',
      downloadUrl:
        'https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode',
      badgeImageUrl:
        'https://www.cardsagainsthumanity.com/images/steal-badge.svg',
    },
    stuff: {
      heading: "Stuff we've done.",
      items: [
        {
          imageUrl:
            'https://img.cah.io/images/vc07edlh/production/c1f921d8c8fd60969110124ebb20ad5d9878861c-1080x1080.png?auto=format&q=75&w=300',
          label: 'Read',
          title: 'Black Friday 2018',
          linkText: 'Holy fuck we had some deals.',
          href: '#99-off-sale',
        },
        {
          imageUrl:
            'https://img.cah.io/images/vc07edlh/production/31fcc3f68a626462e5707bcc5ce19ee716f2e173-1080x1080.png?auto=format&q=75&w=300',
          label: 'Read',
          title: 'Science Scholarship',
          linkText: 'A full-tuition scholarship for women.',
          href: '#science-scholarship',
        },
        {
          imageUrl:
            'https://img.cah.io/images/vc07edlh/production/1acdec5a623b0761a127ac03492b998879ead549-680x680.png?auto=format&q=75&w=300',
          label: 'Read',
          title: 'Holiday Hole',
          linkText: 'You paid us to dig a big hole in the ground.',
          href: '#holiday-hole',
        },
      ],
    },
    email: {
      heading: 'To find out first when we release new stuff, give us your email:',
      disclaimer:
        "We'll only email you like twice a year and we won't share your info with anybody else.",
    },
    faqs: [
      {
        question: 'Where can I buy Cards Against Humanity?',
        answer:
          'Our products are available all over the place, such as our webstore, Amazon, and at all of these retailers.',
      },
      {
        question: "Can I still buy it even if I'm not in America?",
        answer:
          'We make localized versions of Cards Against Humanity for Canada, Australia, and the UK, plus a whole special "International Edition" devoid of any exciting country-specific jokes.',
      },
      {
        question: 'How do I play Cards Against Humanity?',
        answer:
          'The game is simple. Each round, one player asks a question with a black card, and everyone else answers with their funniest white card.',
      },
      {
        question: 'Do you sell expansions?',
        answer:
          'Yes! We sell a handful of large boxed expansions and dozens of small themed packs, plus a few accessories and other bullshit.',
      },
      {
        question: 'I bought something from you and now there\'s a problem.',
        answer:
          "Take a deep breath. Contemplate the transience of all things. Then go to our webstore FAQ.",
      },
      {
        question: 'Are the expansions available as free downloads like the main game?',
        answer: 'No. We need to make money somehow.',
      },
      {
        question: 'I love you.',
        answer: 'I love you, too.',
      },
    ],
  };
}

function getProductPageFallback(slug: string): ProductPage {
  return {
    title: 'More Cards Against Humanity',
    slug: 'more-cah',
    images: [
      {
        url: 'https://img.cah.io/images/vc07edlh/production/5e64d25a746ed1ebc9d5025f935fc650a984a105-1400x1260.png?auto=format&q=75&w=600',
        alt: 'More Cards Against Humanity',
      },
    ],
    description:
      'More Cards Against Humanity comes with 600 expansion cards that instantly double the replayability and girth of your deck.',
    features: [
      {
        text: "If you've never bought an expansion and you want more Cards Against Humanity, buy More Cards Against Humanity.",
      },
      {
        text: "It's got all the best jokes from our old Red Box, Blue Box, and Green Box expansions, plus 50 cards we've never printed before.",
      },
      { text: 'Shiny!' },
    ],
    price: 29,
    medusaProductId: 'prod_more_cah',
    relatedProducts: [
      {
        id: 'r1',
        title: 'Tales Vol. 1',
        description: 'A book of fill-in-the-blank stories to play with your CAH cards.',
        price: 19.99,
        slug: 'tales-vol-1',
        image: {
          url: 'https://img.cah.io/images/vc07edlh/production/5de43bd46e3aca7e0dbbe441a5f27de1bb041cda-1401x1261.png?auto=format&q=75&w=300',
          alt: 'Tales Vol. 1',
        },
        starCount: 5,
        starIconUrl:
          'https://cdn.sanity.io/images/vc07edlh/production/d98a87617638bf60abb3bd34aae39e710f2ec718-81x81.svg',
        medusaProductId: 'prod_tales_v1',
      },
      {
        id: 'r2',
        title: 'Shit List',
        description: 'A fresh way to play CAH where YOU write the answers, plus 80 black cards.',
        price: 22.99,
        slug: 'shit-list',
        image: {
          url: 'https://img.cah.io/images/vc07edlh/production/06e90cda6bff2b7f23e2998f3c0a18451649fc94-1400x1261.png?auto=format&q=75&w=300',
          alt: 'Shit List',
        },
        starCount: 5,
        starIconUrl:
          'https://cdn.sanity.io/images/vc07edlh/production/0d3c92b84597615cbf086163fff344e68e2e2359-80x81.svg',
        medusaProductId: 'prod_shit_list',
      },
      {
        id: 'r3',
        title: 'Twists Bundle',
        description: "It's like playing for the first time again, four more times.",
        price: 59.99,
        slug: 'twists-bundle',
        image: {
          url: 'https://img.cah.io/images/vc07edlh/production/20c0b3d96cc73ad923a6d8d25abf900d688fd80b-2801x2521.png?auto=format&q=75&w=300',
          alt: 'Twists Bundle',
        },
        starCount: 5,
        starIconUrl:
          'https://cdn.sanity.io/images/vc07edlh/production/d798a01794503606266a78a74409f913cc586da6-80x81.svg',
        medusaProductId: 'prod_twists_bundle',
      },
    ],
  };
}

function getFooterFallback(): FooterData {
  return {
    logo: {
      url: 'https://www.cardsagainsthumanity.com/images/logo-footer.svg',
      alt: 'Cards Against Humanity',
    },
    shopLinks: [
      { label: 'All Products', href: '/shop/all' },
      { label: 'Main Games', href: '/shop/main-games' },
      { label: 'Expansions', href: '/shop/expansions' },
      { label: 'Family', href: '/shop/family' },
      { label: 'Packs', href: '/shop/packs' },
      { label: 'Other Stuff', href: '/shop/other-stuff' },
    ],
    infoLinks: [
      { label: 'About', href: '/about' },
      { label: 'Support', href: '/support' },
      { label: 'Contact', href: '/contact' },
      { label: 'Retailers', href: '/retailers' },
      { label: 'Steal', href: '/#downloads' },
      { label: 'Careers', href: '/careers' },
    ],
    findUsLinks: [
      { label: 'Facebook', href: 'https://www.facebook.com/CardsAgainstHumanity' },
      { label: 'Instagram', href: 'https://instagram.com/cardsagainsthumanity' },
      { label: 'TikTok', href: 'https://www.tiktok.com/@cardsagainsthumanity' },
      { label: 'Bluesky', href: 'https://bsky.app/profile/cardsagainsthumanity.com' },
      { label: 'Amazon', href: 'https://www.amazon.com/stores/page/66E40BA9-1C4A-4686-BEFB-55B94789694E' },
      { label: 'Target', href: 'https://www.target.com/s?searchTerm=cards+against+humanity' },
    ],
    socialLinks: [
      {
        platform: 'Instagram',
        href: 'https://www.instagram.com/cardsagainsthumanity/',
        iconUrl: 'https://www.cardsagainsthumanity.com/images/icon-instagram.svg',
      },
      {
        platform: 'Facebook',
        href: 'https://www.facebook.com/CardsAgainstHumanity',
        iconUrl: 'https://www.cardsagainsthumanity.com/images/icon-facebook.svg',
      },
    ],
    copyright: '©2026 Cards Against Humanity LLC',
  };
}
