const DEVELOPMENT = "development";

const env = process.env.NODE_ENV || DEVELOPMENT;

interface BaseConfig {
  port: number;
  env: string;
  isDev: boolean;
}

const baseConfig: BaseConfig = {
  port: 5000,
  env,
  isDev: env === DEVELOPMENT,
};

export default baseConfig;
