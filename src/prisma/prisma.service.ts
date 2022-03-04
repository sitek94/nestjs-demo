import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get('DATABASE_URL'),
        },
      },
    })
  }

  cleanDb() {
    return this.$transaction([
      // Bookmarks have to be deleted before Users, because of their relation
      this.bookmark.deleteMany(),
      this.user.deleteMany(),
    ])
  }
}
