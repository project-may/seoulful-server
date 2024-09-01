import { Controller, Get, HttpCode, HttpStatus, Param, Query, UseFilters } from '@nestjs/common'
import { EventsService } from '@/events/events.service'
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter'

@Controller('event')
@UseFilters(HttpExceptionFilter)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('/list')
  @HttpCode(HttpStatus.OK)
  getEventList(
    @Query('limit') limit: string,
    @Query('offset') offset: string,
    @Query('categorySeq') categorySeq?: string
  ) {
    const result = this.eventsService.getEventList(limit, offset, categorySeq)
    return result
  }

  @Get('/list/search')
  @HttpCode(HttpStatus.OK)
  getEventListBySearch(
    @Query('limit') limit: string,
    @Query('offset') offset: string,
    @Query('eventName') eventName?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('categorySeq') categorySeq?: number,
    @Query('guSeq') guSeq?: number
  ) {
    const result = this.eventsService.getEventListBySearch(
      limit,
      offset,
      eventName,
      startDate,
      endDate,
      categorySeq,
      guSeq
    )

    return result
  }

  @Get('/detail/:eventId')
  @HttpCode(HttpStatus.OK)
  getEventDetail(@Param('eventId') eventId: string) {
    const result = this.eventsService.getEventDetail(eventId)
    return result
  }

  @Get('/nearby')
  @HttpCode(HttpStatus.OK)
  getNearbyEventList(@Query('geohash') geohash: string) {
    const result = this.eventsService.getNearbyEventList(geohash)
    return result
  }
}
