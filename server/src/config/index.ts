import dotenv from "dotenv";
const DEVELOPMENT = "development";

dotenv.config();

const env = process.env.NODE_ENV || DEVELOPMENT;

interface BaseConfig {
  port: number;
  env: string;
  isDev: boolean;
  jwtSecret: string | undefined;
}

const baseConfig: BaseConfig = {
  port: 5000,
  env,
  isDev: env === DEVELOPMENT,
  jwtSecret: process.env.JWT_SECRET,
};

export default baseConfig;
