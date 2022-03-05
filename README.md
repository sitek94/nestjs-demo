# NestJS Demo

## Notes

- `@Injectable()` decorator is used when you want to inject some dependencies into your class.
- [Prisma: Cascade](https://www.prisma.io/docs/concepts/components/prisma-schema/relations/referential-actions#cascade) -
  when `User` is deleted, then their post are deleted as well

## Resources

- [NestJs Course for Beginners - Create a REST API](https://www.youtube.com/watch?v=GHTA143_b-s)
- [argon2](https://github.com/ranisalt/node-argon2) - hashing password and token
- [JWT](https://jwt.io/) - JSON Web Tokens 

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Bootstrapped with NestJS

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.
