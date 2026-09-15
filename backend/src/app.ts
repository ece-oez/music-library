import Fastify from 'fastify'
import cors from '@fastify/cors'
import cookie from '@fastify/cookie'
import { config } from './config.js'

export function buildApp() {
  const app = Fastify({ logger: true })

  void app.register(cors, { origin: config.FRONTEND_ORIGIN, credentials: true })
  void app.register(cookie)

  app.get('/api/v1/health', async () => ({ status: 'ok' as const }))

  return app
}
