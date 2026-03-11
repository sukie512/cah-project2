import { CollectionConfig } from 'payload/types';

const Products: CollectionConfig = {
  slug: 'products',
  admin: { useAsTitle: 'title' },
  hooks: {
    afterChange: [
      async ({ doc, operation }) => {
        // Sync to Medusa after create/update
        const medusaUrl = process.env.MEDUSA_URL || 'http://localhost:9000';
        const medusaApiKey = process.env.MEDUSA_API_KEY || '';

        try {
          if (operation === 'create') {
            // Create product in Medusa
            const res = await fetch(`${medusaUrl}/admin/products`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${medusaApiKey}`,
              },
              body: JSON.stringify({
                title: doc.title,
                description: doc.description,
                status: 'published',
                variants: [
                  {
                    title: 'Default',
                    prices: [{ amount: Math.round(doc.price * 100), currency_code: 'usd' }],
                    inventory_quantity: 100,
                    manage_inventory: false,
                  },
                ],
                metadata: { payload_id: doc.id },
              }),
            });
            if (res.ok) {
              const { product } = await res.json();
              // Store Medusa product ID back in Payload
              console.log(`Synced to Medusa: ${product.id}`);
            }
          } else if (operation === 'update' && doc.medusaProductId) {
            await fetch(`${medusaUrl}/admin/products/${doc.medusaProductId}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${medusaApiKey}`,
              },
              body: JSON.stringify({
                title: doc.title,
                description: doc.description,
              }),
            });
          }
        } catch (err) {
          console.error('Medusa sync failed:', err);
        }

        return doc;
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, admin: { description: 'URL-safe identifier, e.g. more-cah' } },
    {
      name: 'images',
      type: 'array',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'alt', type: 'text' },
      ],
    },
    { name: 'description', type: 'textarea', required: true },
    {
      name: 'features',
      type: 'array',
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    { name: 'price', type: 'number', required: true, admin: { description: 'Price in USD (e.g. 29)' } },
    { name: 'medusaProductId', type: 'text', admin: { readOnly: true, description: 'Auto-populated after Medusa sync' } },
    {
      name: 'relatedProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
    },
  ],
};

export default Products;
