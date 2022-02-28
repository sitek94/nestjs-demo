import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(
    new ValidationPipe({
      // Filter out properties that should not be received by the method handler
      whitelist: true,
    }),
  )
  await app.listen(3333)
}
bootstrap()
