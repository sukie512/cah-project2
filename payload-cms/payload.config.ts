import { buildConfig } from 'payload/config';
import { webpackBundler } from '@payloadcms/bundler-webpack';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { slateEditor } from '@payloadcms/richtext-slate';
import Products from './src/collections/Products';
import Media from './src/collections/Media';
import HomePage from './src/globals/HomePage';
import FooterGlobal from './src/globals/Footer';

export default buildConfig({
  serverURL: process.env.PAYLOAD_URL || 'http://localhost:3001',
  admin: {
    bundler: webpackBundler(),
    meta: {
      titleSuffix: '- CAH Admin',
      favicon: '/favicon.ico',
    },
  },
  editor: slateEditor({}),
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || 'mongodb://localhost/cah-cms',
  }),
  collections: [Products, Media],
  globals: [HomePage, FooterGlobal],
  cors: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    process.env.MEDUSA_URL || 'http://localhost:9000',
  ],
  csrf: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
  ],
  typescript: {
    outputFile: './src/payload-types.ts',
  },
});
