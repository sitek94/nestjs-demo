import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from './auth/auth.module'
import { PrismaModule } from './prisma/prisma.module'
import { UserModule } from './user/user.module'
import { BookmarksController } from './bookmarks/bookmarks.controller';
import { BookmarksService } from './bookmarks/bookmarks.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    PrismaModule,
  ],
  controllers: [BookmarksController],
  providers: [BookmarksService],
})
export class AppModule {}
