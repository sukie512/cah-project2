import express from 'express';
import payload from 'payload';
import medusaWebhook from './src/hooks/medusaWebhook';
require('dotenv').config();

const app = express();
app.use(express.json());

// Medusa → Payload webhook
app.use('/webhooks', medusaWebhook);

const start = async () => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET || 'a-very-secret-key-change-this',
    mongoURL: process.env.MONGODB_URI || 'mongodb://localhost/cah-cms',
    express: app,
    onInit: () => {
      payload.logger.info(`Payload Admin: ${payload.getAdminURL()}`);
    },
  });

  app.listen(3001, () => {
    console.log('Payload CMS running on http://localhost:3001');
  });
};

start();
