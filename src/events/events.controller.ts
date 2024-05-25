import { Controller, Get, HttpCode, HttpException, HttpStatus, Param, Query } from '@nestjs/common'
import { EventsService } from '@/events/events.service'

@Controller('event')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('/list')
  @HttpCode(HttpStatus.OK)
  async getEventList(@Query('limit') limit: string, @Query('offset') offset: string) {
    try {
      const result = await this.eventsService.getEventList(limit, offset)
      return result
    } catch (err: unknown) {
      if (!(err instanceof HttpException)) {
        throw new HttpException({ message: 'Unknown Error', error: err }, HttpStatus.INTERNAL_SERVER_ERROR)
      }
      throw err
    }
  }

  @Get('/list/:categorySeq')
  @HttpCode(HttpStatus.OK)
  async getEventListByCategory(
    @Param('categorySeq') categorySeq: string,
    @Query('limit') limit: string,
    @Query('offset') offset: string
  ) {
    try {
      const result = await this.eventsService.getEventsByCategory(categorySeq, limit, offset)
      return result
    } catch (err: unknown) {
      if (!(err instanceof HttpException)) {
        throw new HttpException({ message: 'Unknown Error', error: err }, HttpStatus.INTERNAL_SERVER_ERROR)
      }
      throw err
    }
  }

  @Get('/:eventId')
  @HttpCode(HttpStatus.OK)
  async getEventDetail(@Param('eventId') eventId: string) {
    try {
      const result = await this.eventsService.getEventDetail(eventId)
      return result
    } catch (err: unknown) {
      if (!(err instanceof HttpException)) {
        throw new HttpException({ message: 'Unknown Error', error: err }, HttpStatus.INTERNAL_SERVER_ERROR)
      }
      throw err
    }
  }
}
