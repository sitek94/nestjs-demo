import { ForbiddenException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import * as argon from 'argon2'

import { AuthDto } from './dto'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signup(dto: AuthDto) {
    // Generate password hash
    const hash = await argon.hash(dto.password)

    try {
      // Save new user in the db
      const user = await this.prismaService.user.create({
        data: {
          email: dto.email,
          hash,
        },
      })

      return this.signToken({ userId: user.id, email: user.email })
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
    const user = await this.prismaService.user.findUnique({
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

    return this.signToken({ userId: user.id, email: user.email })
  }

  async signToken(user: {
    userId: string
    email: string
  }): Promise<{ access_token: string }> {
    const payload = { sub: user.userId, email: user.email }
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '1d',
      secret: this.configService.get('JWT_SECRET'),
    })

    return {
      access_token: token,
    }
  }
}
