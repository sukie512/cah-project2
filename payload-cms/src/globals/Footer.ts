import { GlobalConfig } from 'payload/types';

const FooterGlobal: GlobalConfig = {
  slug: 'footer',
  fields: [
    {
      name: 'logo',
      type: 'group',
      fields: [
        { name: 'url', type: 'text', defaultValue: 'https://www.cardsagainsthumanity.com/images/logo-footer.svg' },
        { name: 'alt', type: 'text', defaultValue: 'Cards Against Humanity' },
      ],
    },
    {
      name: 'shopLinks',
      type: 'array',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'href', type: 'text' },
      ],
    },
    {
      name: 'infoLinks',
      type: 'array',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'href', type: 'text' },
      ],
    },
    {
      name: 'findUsLinks',
      type: 'array',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'href', type: 'text' },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        { name: 'platform', type: 'text' },
        { name: 'href', type: 'text' },
        { name: 'iconUrl', type: 'text' },
      ],
    },
    { name: 'copyright', type: 'text', defaultValue: '©2026 Cards Against Humanity LLC' },
  ],
};

export default FooterGlobal;
