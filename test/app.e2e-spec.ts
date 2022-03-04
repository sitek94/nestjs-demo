import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import * as pactum from 'pactum'

import { AppModule } from '../src/app.module'
import { AuthDto } from '../src/auth/dto'
import { PrismaService } from '../src/prisma/prisma.service'
import { EditUserDto } from '../src/user/dto'
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
      email: 'aragorn@strider.com',
      password: 'arwen', // Omg so cute
    }

    describe('Sign up', () => {
      it('should throw if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400)
      })

      it('should throw if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
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
          .withBody(dto)
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
          .withBody({
            password: dto.password,
          })
          .expectStatus(400)
      })

      it('should throw if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
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
          .withBody(dto)
          .expectStatus(200)
          .stores('userAccessToken', 'access_token')
      })
    })
  })

  describe('Users', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .expectStatus(200)
      })
    })
    describe('Edit user', () => {
      it('should edit current user', () => {
        const dto: EditUserDto = {
          email: 'aragorn@gondor.org',
          firstName: 'Aragorn',
          lastName: 'Elessar',
        }
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.email)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.lastName)
      })
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
