const dotenv = require("dotenv");
dotenv.config();

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:9000";
const DATABASE_URL = process.env.DATABASE_URL || "";

module.exports = {
  projectConfig: {
    database_url: process.env.DATABASE_URL,
    database_type: "postgres",
    database_extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
    store_cors: process.env.STORE_CORS || "*",
    admin_cors: process.env.ADMIN_CORS || "*",
    jwt_secret: process.env.JWT_SECRET || "supersecret",
    cookie_secret: process.env.COOKIE_SECRET || "supersecret",
  },
  plugins: [
    "medusa-fulfillment-manual",
    "medusa-payment-manual",
  ],
};
