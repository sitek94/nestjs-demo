import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import * as pactum from 'pactum'

import { AppModule } from '../src/app.module'
import { AuthDto } from '../src/auth/dto'
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
    await app.listen(3333)

    // Prisma
    prismaService = app.get(PrismaService)
    await prismaService.cleanDb()

    // Pactum
    pactum.request.setBaseUrl('http://localhost:3333')
  })

  afterAll(() => {
    app.close()
  })

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'aragorn@gondor.city',
      password: 'arwen', // Omg so cute
    }

    describe('Sign up', () => {
      it('should throw if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withJson({
            password: dto.password,
          })
          .expectStatus(400)
      })

      it('should throw if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withJson({
            email: dto.email,
          })
          .expectStatus(400)
      })

      it('should throw if no body provided', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400)
      })

      it('should sign up', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withJson(dto)
          .expectStatus(201)
        // .inspect()
        // 👆 Uncomment this line to see request and response bodies
      })
    })

    describe('Sign in', () => {
      it('should throw if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withJson({
            password: dto.password,
          })
          .expectStatus(400)
      })

      it('should throw if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withJson({
            email: dto.email,
          })
          .expectStatus(400)
      })

      it('should throw if no body provided', () => {
        return pactum.spec().post('/auth/signin').expectStatus(400)
      })

      it('should sign in', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withJson(dto)
          .expectStatus(200)
      })
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
