import { GlobalConfig } from 'payload/types';

const HomePage: GlobalConfig = {
  slug: 'home-page',
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'logoUrl', type: 'text', defaultValue: 'https://www.cardsagainsthumanity.com/images/logo-hero.svg' },
        { name: 'tagline', type: 'text', defaultValue: 'Cards Against Humanity' },
        { name: 'quote', type: 'text', defaultValue: '"Bad."' },
        { name: 'quoteSource', type: 'text', defaultValue: 'NPR' },
        { name: 'description', type: 'textarea' },
        {
          name: 'badgeIcons',
          type: 'array',
          fields: [
            { name: 'url', type: 'text' },
            { name: 'alt', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'shop',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', defaultValue: 'Buy the game.' },
        {
          name: 'products',
          type: 'array',
          fields: [
            { name: 'title', type: 'text' },
            { name: 'subtitle', type: 'text' },
            {
              name: 'images',
              type: 'array',
              fields: [
                { name: 'url', type: 'text' },
                { name: 'alt', type: 'text' },
              ],
            },
            { name: 'ctaText', type: 'text' },
            { name: 'ctaHref', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'steal',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', defaultValue: 'Steal the game.' },
        { name: 'body', type: 'textarea' },
        { name: 'downloadUrl', type: 'text' },
        { name: 'badgeImageUrl', type: 'text' },
      ],
    },
    {
      name: 'stuff',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', defaultValue: "Stuff we've done." },
        {
          name: 'items',
          type: 'array',
          fields: [
            { name: 'imageUrl', type: 'text' },
            { name: 'label', type: 'text' },
            { name: 'title', type: 'text' },
            { name: 'linkText', type: 'text' },
            { name: 'href', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'email',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'disclaimer', type: 'text' },
      ],
    },
    {
      name: 'faqs',
      type: 'array',
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
  ],
};

export default HomePage;
