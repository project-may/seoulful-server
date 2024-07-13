import { UseGuards, Controller, Get, Param, Put, HttpStatus, HttpCode, Body } from '@nestjs/common'
import { JwtAuthGuard } from '@/common/jwt/jwt-auth.guard'
import { BookmarkService } from '@/bookmark/bookmark.service'

@Controller('bookmark')
@UseGuards(JwtAuthGuard)
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Get('/:userId')
  @HttpCode(HttpStatus.OK)
  getBookmarkList(@Param('userId') userId: string) {
    return this.bookmarkService.getBookmarkList(userId)
  }

  @Put('/:userId')
  @HttpCode(HttpStatus.OK)
  addBookmark(@Param('userId') userId: string, @Body() body: { eventSeq: number }) {
    return this.bookmarkService.addBookmark(userId, body)
  }
}
