import { z } from "zod";

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  FIREBASE_API_KEY:z.string(),
  FIREBASE_AUTH_DOMAIN:z.string(),
  FIREBASE_PROJECT_ID:z.string(),
  FIREBASE_STORAGE_BUCKET:z.string(),
  FIREBASE_MESSAGING_SENDER_ID:z.string(),
  FIREBASE_APP_ID:z.string(),
  PORT: z.coerce.number().optional().default(3333)
})


export type Env = z.infer<typeof envSchema>