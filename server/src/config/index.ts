import dotenv from "dotenv";
const DEVELOPMENT = "development";
const PRODUCTION = "production";

dotenv.config();

const env = process.env.NODE_ENV || DEVELOPMENT;

const baseConfig = {
  port: 5000,
  env,
  isDev: env === DEVELOPMENT,
  isProd: env === PRODUCTION,
  origin: "http://localhost:3000",
  sessionSecret: process.env.SESSION_SECRET,
  cookieMaxAge: 1000 * 60 * 60 * 24 * 14,
  cookieName: "COOOK",
} as const;

export default baseConfig;
