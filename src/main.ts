import { NestFactory } from '@nestjs/core'
import { AppModule } from '@/app.module'

async function bootstrap() {
  const PORT = process.env.PORT || 4000
  const app = await NestFactory.create(AppModule, { cors: true })
  const appUrl = process.env.APP_URL_PRODUCTION
  const appUrlLocal = process.env.APP_URL_LOCAL

  // TODO: CSP 대응 필요
  app.enableCors({
    origin: [appUrl, appUrlLocal],
    methods: ['GET', 'HEAD', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
    credentials: true
  })
  await app.listen(PORT)
}

bootstrap()
