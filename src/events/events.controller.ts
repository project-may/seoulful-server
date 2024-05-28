import { Controller, Get, HttpCode, HttpStatus, Param, Query, UseFilters } from '@nestjs/common'
import { EventsService } from '@/events/events.service'
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter'

@Controller('event')
@UseFilters(HttpExceptionFilter)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('/list')
  @HttpCode(HttpStatus.OK)
  getEventList(@Query('limit') limit: string, @Query('offset') offset: string) {
    const result = this.eventsService.getEventList(limit, offset)
    return result
  }

  @Get('/list/:categorySeq')
  @HttpCode(HttpStatus.OK)
  getEventListByCategory(
    @Param('categorySeq') categorySeq: string,
    @Query('limit') limit: string,
    @Query('offset') offset: string
  ) {
    const result = this.eventsService.getEventsByCategory(categorySeq, limit, offset)
    return result
  }

  @Get('/:eventId')
  @HttpCode(HttpStatus.OK)
  getEventDetail(@Param('eventId') eventId: string) {
    const result = this.eventsService.getEventDetail(eventId)
    return result
  }
}
