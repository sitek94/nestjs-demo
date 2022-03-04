import { Controller, Get, UseGuards } from '@nestjs/common'
import { JwtGuard } from '../auth/guards'
import { GetUser } from '../auth/decorators'
import { User } from '@prisma/client'

@Controller('users')
export class UserController {
  @UseGuards(JwtGuard)
  @Get('me')
  getMe(@GetUser() user: User) {
    return user
  }
}
