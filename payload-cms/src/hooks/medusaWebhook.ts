import express from 'express';
import payload from 'payload';

const router = express.Router();

// Receive product updates FROM Medusa → update Payload
router.post('/medusa-sync', async (req, res) => {
  const { event, data } = req.body;

  if (!event || !data) {
    return res.status(400).json({ error: 'Missing event or data' });
  }

  try {
    if (event === 'product.updated') {
      const { id: medusaId, title, description } = data;

      // Find the product in Payload by medusaProductId
      const result = await payload.find({
        collection: 'products',
        where: { medusaProductId: { equals: medusaId } },
        limit: 1,
      });

      if (result.docs.length > 0) {
        const doc = result.docs[0];
        await payload.update({
          collection: 'products',
          id: doc.id,
          data: { title, description },
        });
        return res.json({ success: true, updated: doc.id });
      }
    }

    if (event === 'product.created') {
      // Optionally auto-create in Payload when Medusa creates a product
      const { id: medusaId, title, description } = data;
      await payload.create({
        collection: 'products',
        data: {
          title,
          description: description || '',
          slug: title.toLowerCase().replace(/\s+/g, '-'),
          price: 0,
          medusaProductId: medusaId,
        },
      });
      return res.json({ success: true });
    }

    res.json({ ignored: true });
  } catch (err: any) {
    console.error('Webhook error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
