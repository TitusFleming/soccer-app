declare global {
  namespace NodeJS {
    interface ProcessEnv {
      OPENAI_API_KEY: string;
      POSTGRES_PRISMA_URL: string;
      POSTGRES_URL_NON_POOLING: string;
    }
  }
}

export {}
