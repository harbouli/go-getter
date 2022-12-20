declare namespace NodeJS {
  export interface ProcessEnv {
    DB_HOST: string;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_DATABASE_NAME: string;
    DB_PORT: string;
    JWT_SECRET: string;
    ENVIRONMENT: 'PRODUCTION' | 'DEVELOPMENT';
    REDIS_HOST: string;
    REDIS_PORT: number;
  }
}
