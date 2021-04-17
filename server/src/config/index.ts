import dotenv from "dotenv";
const DEVELOPMENT = "development";

dotenv.config();

const env = process.env.NODE_ENV || DEVELOPMENT;

const baseConfig = {
  port: 5000,
  env,
  isDev: env === DEVELOPMENT,
  origin: "http://localhost:3000",
} as const;

export default baseConfig;
