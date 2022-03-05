import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'

import { GetUser } from '../auth/decorators'
import { JwtGuard } from '../auth/guards'
import { BookmarksService } from './bookmarks.service'
import { CreateBookmarkDto } from './dto'
import { EditBookmarkDto } from './dto/edit-bookmark.dto'

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarksController {
  constructor(private bookmarksService: BookmarksService) {}

  @Get()
  getBookmarks(@GetUser('id') userId: string) {
    return this.bookmarksService.getBookmarks(userId)
  }

  @Get(':id')
  getBookmarkById(
    @GetUser('id') userId: string,
    @Param('id', ParseUUIDPipe) bookmarkId: string,
  ) {
    return this.bookmarksService.getBookmarkById(userId, bookmarkId)
  }

  @Post()
  createBookmark(
    @GetUser('id') userId: string,
    @Body() dto: CreateBookmarkDto,
  ) {
    return this.bookmarksService.createBookmark(userId, dto)
  }

  @Patch(':id')
  editBookmarkById(
    @GetUser('id') userId: string,
    @Param('id', ParseUUIDPipe) bookmarkId: string,
    @Body() dto: EditBookmarkDto,
  ) {
    return this.bookmarksService.editBookmarkById(userId, bookmarkId, dto)
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteBookmarkById(
    @GetUser('id') userId: string,
    @Param('id', ParseUUIDPipe) bookmarkId: string,
  ) {
    return this.bookmarksService.deleteBookmarkById(userId, bookmarkId)
  }
}
