import { Test } from '@nestjs/testing'
import { AppModule } from '../src/app.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { PrismaService } from '../src/prisma/prisma.service'

/**
 * NestJS: Testing Utilities
 * https://docs.nestjs.com/fundamentals/testing#testing-utilities
 */

describe('App E2E', () => {
  let app: INestApplication
  let prismaService: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    )

    await app.init()

    prismaService = app.get(PrismaService)
    await prismaService.cleanDb()
  })

  afterAll(() => {
    app.close()
  })

  describe('auth', () => {
    it.todo('should be able to register')
  })
})
