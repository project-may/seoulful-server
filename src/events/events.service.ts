import {
  HttpException,
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import { Events } from '@/schema/events.schema'
import {
  EventDTO,
  EventListResponseDTO,
  EventDetailResponseDTO,
  NearbyEventResponseDTO,
  EventListDTO,
  EventDetailDTO
} from '@/events/events.dto'
import type { EventsModel, IEventData } from '@/events/types/events.type'

@Injectable()
export class EventsService {
  constructor(@InjectModel(Events.name) private eventsModel: EventsModel) {}

  async getEventList(limit: string, offset: string, categorySeq?: string) {
    try {
      if (!limit || !offset) throw new BadRequestException('limit 또는 offset 값이 없습니다.')
      if (Number.isNaN(Number(limit)) || Number.isNaN(Number(offset)))
        throw new BadRequestException('유효하지 않은 limit 혹은 offset 값입니다.')
      if (categorySeq && Number.isNaN(Number(categorySeq)))
        throw new BadRequestException('유효하지 않은 카테고리입니다.')

      const query = {
        ...(categorySeq && { category_seq: categorySeq })
      }

      const subQuery = {
        _id: 0,
        event_id: 1,
        category_seq: 1,
        event_name: 1,
        period: 1,
        main_img: 1,
        start_date: 1,
        end_date: 1,
        detail_url: 1
      }

      const eventListData: IEventData[] = await this.eventsModel
        .find(query, subQuery)
        .limit(Number(limit))
        .skip(Number(offset))
        .lean()
        .exec()

      const totalDataCount = await this.eventsModel
        .countDocuments({ ...(categorySeq && { category_seq: Number(categorySeq) }) })
        .exec()

      const resultData = eventListData.map((data) => plainToInstance(EventListDTO, data))
      const plainObj = { data: instanceToPlain(resultData), totalCount: totalDataCount }
      const result = plainToInstance(EventListResponseDTO, plainObj)

      return result
    } catch (err) {
      if (err instanceof HttpException) throw err
      else throw new InternalServerErrorException(err)
    }
  }

  async getEventDetail(eventId: string) {
    try {
      if (Number.isNaN(Number(eventId))) throw new BadRequestException('유효하지 eventSeq입니다.')

      const eventDetailData: IEventData = await this.eventsModel
        .findOne({ event_id: Number(eventId) })
        .lean()
        .exec()
      if (!eventDetailData) throw new NotFoundException('존재하지 않는 행사입니다.')

      const detailData = plainToInstance(EventDetailDTO, eventDetailData)

      const plainObj = { data: instanceToPlain(detailData) }
      const result = plainToInstance(EventDetailResponseDTO, plainObj)

      return result
    } catch (err) {
      if (err instanceof HttpException) throw err
      else throw new InternalServerErrorException(err)
    }
  }

  async getEventListBySearch(
    limit: string,
    offset: string,
    eventName: string,
    startDate?: string,
    endDate?: string,
    categorySeq?: number,
    guSeq?: number
  ) {
    try {
      if (!limit || !offset) throw new BadRequestException('limit 또는 offset 값이 없습니다.')
      if (Number.isNaN(Number(limit)) || Number.isNaN(Number(offset)))
        throw new BadRequestException('유효하지 않은 limit 혹은 offset 값입니다.')
      if (!eventName) throw new BadRequestException('검색어가 없습니다.')
      if (new Date(startDate) > new Date(endDate))
        throw new BadRequestException('시작일자가 종료일자보다 늦을 수 없습니다.')
      if (categorySeq && Number.isNaN(categorySeq)) throw new BadRequestException('유효하지 않은 카테고리입니다.')
      if (guSeq && Number.isNaN(guSeq)) throw new BadRequestException('유효하지 않은 지역입니다.')

      const query = {
        event_name: { $regex: eventName, $options: 'i' },
        ...(startDate && { start_date: { $gte: startDate } }),
        ...(endDate && { end_date: { $lte: endDate } }),
        ...(categorySeq && { category_seq: categorySeq }),
        ...(guSeq && { gu_seq: guSeq })
      }

      const subQuery = {
        _id: 0,
        event_id: 1,
        category_seq: 1,
        event_name: 1,
        period: 1,
        main_img: 1,
        start_date: 1,
        end_date: 1,
        detail_url: 1
      }

      const eventListData: IEventData[] = await this.eventsModel
        .find(query, subQuery)
        .limit(Number(limit))
        .skip(Number(offset))
        .lean()
        .exec()
      const totalDataCount = await this.eventsModel.countDocuments(query).exec()

      const resultData = eventListData.map((data) => plainToInstance(EventListDTO, data))
      const plainObj = { data: instanceToPlain(resultData), totalCount: totalDataCount }
      const result = plainToInstance(EventListResponseDTO, plainObj)

      return result
    } catch (err) {
      if (err instanceof HttpException) throw err
      else throw new InternalServerErrorException(err)
    }
  }

  async getNearbyEventList(geohash: string) {
    const incomingGeohash = geohash.split(',')
    const queryResult: IEventData[] = []
    const subQuery = {
      _id: 0,
      event_id: 1,
      category_seq: 1,
      event_name: 1,
      period: 1,
      main_img: 1,
      start_date: 1,
      end_date: 1,
      detail_url: 1,
      latitude: 1,
      longitude: 1,
      geohash: 1
    }

    if (incomingGeohash.length === 1 && !incomingGeohash[0]) throw new BadRequestException('geohash가 없습니다.')
    if (incomingGeohash.length > 9) throw new BadRequestException('검색가능한 geohash의 지역은 최대 9개입니다.')

    try {
      for (const geohash of incomingGeohash) {
        if (geohash.length > 6) throw new BadRequestException('유효하지 않은 geohash범위입니다.')
        const query = {
          geohash: { $regex: geohash, $options: 'i' }
        }
        const eventListData: IEventData[] = await this.eventsModel.find(query, subQuery).exec()
        queryResult.push(...eventListData)
      }

      const resultData = incomingGeohash.reduce(
        (acc, geohash) => {
          const includedGeohashData = queryResult.filter((data) => data.geohash.includes(geohash))
          const eventDtoData = includedGeohashData.map((data) => new EventDTO(data))
          acc[geohash] = eventDtoData
          return acc
        },
        {} as Record<string, EventDTO[]>
      )

      queryResult.length = 0

      const result = new NearbyEventResponseDTO(resultData)
      return result
    } catch (err) {
      if (err instanceof HttpException) throw err
      else throw new InternalServerErrorException(err)
    }
  }
}
