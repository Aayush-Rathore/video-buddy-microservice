declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGO_URI: string;
      CORS_ORIGIN: string;

      AWS_S3_ACCEESS_KEY: string;
      AWS_S3_SECRET_KEY: string;
      AWS_S3_END_POINT: string;
      AWS_S3_REGION: string;
      AWS_S3_BUCKET_NAME: string;

      REDIS_HOST: string;
      REDIS_PORT: number;
      REDIS_PASS: string;
    }
  }
}

export {};
