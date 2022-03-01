import { ForbiddenException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { AuthDto } from './dto'
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: AuthDto) {
    // Generate password hash
    const hash = await argon.hash(dto.password)

    try {
      // Save new user in the db
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      })

      // Don't return the hash to the client!
      delete user.hash

      // Return saved user
      return user
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('The email is already taken')
        }
        throw error
      }
    }
  }

  async signin(dto: AuthDto) {
    // Find the user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    })

    // If no user was found, throw an error
    if (!user) {
      throw new ForbiddenException('User not found')
    }

    // Check if the password is correct
    const valid = await argon.verify(user.hash, dto.password)
    if (!valid) {
      throw new ForbiddenException('Invalid password')
    }

    delete user.hash

    return user
  }
}
