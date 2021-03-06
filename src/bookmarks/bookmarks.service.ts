import { ForbiddenException, Injectable } from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'
import { CreateBookmarkDto } from './dto'
import { EditBookmarkDto } from './dto/edit-bookmark.dto'

@Injectable()
export class BookmarksService {
  constructor(private prismaService: PrismaService) {}

  getBookmarks(userId: string) {
    return this.prismaService.bookmark.findMany({
      where: { userId },
    })
  }

  getBookmarkById(userId: string, bookmarkId: string) {
    return this.prismaService.bookmark.findFirst({
      where: { id: bookmarkId, userId },
    })
  }

  createBookmark(userId: string, dto: CreateBookmarkDto) {
    return this.prismaService.bookmark.create({
      data: {
        ...dto,
        userId,
      },
    })
  }

  async editBookmarkById(
    userId: string,
    bookmarkId: string,
    dto: EditBookmarkDto,
  ) {
    const bookmark = await this.prismaService.bookmark.findUnique({
      where: { id: bookmarkId },
    })

    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException('Access to resource denied')
    }

    return this.prismaService.bookmark.update({
      where: { id: bookmarkId },
      data: {
        ...dto,
      },
    })
  }

  async deleteBookmarkById(userId: string, bookmarkId: string) {
    const bookmark = await this.prismaService.bookmark.findUnique({
      where: { id: bookmarkId },
    })

    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException('Access to resource denied')
    }

    return this.prismaService.bookmark.delete({
      where: { id: bookmarkId },
    })
  }
}
