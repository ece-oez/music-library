import { z } from 'zod'

const configSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().min(1).default('postgres://tracks:tracks@localhost:5432/tracks_n_plates'),
  FRONTEND_ORIGIN: z.string().url().default('http://localhost:5173'),
})

export const config = configSchema.parse(process.env)
