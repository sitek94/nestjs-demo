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

  describe('Auth', () => {
    describe('Sign in', () => {
      it.todo('should sign in')
    })

    describe('Sign up', () => {
      it.todo
    })
  })

  describe('Users', () => {
    describe('Get me', () => {
      it.todo
    })
    describe('Edit user', () => {
      it.todo
    })
  })

  describe('Bookmarks', () => {
    describe('Create bookmark', () => {
      it.todo
    })

    describe('Get bookmarks', () => {
      it.todo
    })

    describe('Get bookmarks by id', () => {
      it.todo
    })

    describe('Edit bookmark', () => {
      it.todo
    })

    describe('Delete bookmark', () => {
      it.todo
    })
  })
})
