declare global {
  namespace NodeJS {
    interface ProcessEnv {
      OPENAI_API_KEY: string;
      DATABASE_URL: string;
    }
  }
}

export {}
