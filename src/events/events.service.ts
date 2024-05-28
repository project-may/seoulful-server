import {
  HttpException,
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Events } from '@/schema/events.schema'
import { EventDTO, EventListResponseDTO, EventDetailResponseDTO } from '@/events/events.dto'
import type { EventsModel, IEventData } from '@/events/types/events.type'

@Injectable()
export class EventsService {
  constructor(@InjectModel(Events.name) private eventsModel: EventsModel) {}

  async getEventList(limit: string, offset: string) {
    try {
      if (!limit || !offset) throw new BadRequestException('limit 또는 offset 값이 없습니다.')
      if (Number.isNaN(Number(limit)) || Number.isNaN(Number(offset)))
        throw new BadRequestException('유효하지 않은 limit 혹은 offset 값입니다.')

      const eventListData: IEventData[] = await this.eventsModel
        .find(
          {},
          {
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
        )
        .limit(Number(limit))
        .skip(Number(offset))
        .exec()

      const totalData = await this.eventsModel.countDocuments().exec()
      const resultData = eventListData.map((data) => new EventDTO(data))
      const result = new EventListResponseDTO(resultData, totalData)

      return result
    } catch (err) {
      if (err instanceof HttpException) throw err
      else throw new InternalServerErrorException(err)
    }
  }

  async getEventsByCategory(categorySeq: string, limit: string, offset: string) {
    try {
      if (categorySeq == null || Number.isNaN(Number(categorySeq)))
        throw new BadRequestException('유효하지 않은 카테고리 입니다.')
      if (!limit || !offset) throw new BadRequestException('limit 또는 offset 값이 없습니다.')
      if (Number.isNaN(Number(limit)) || Number.isNaN(Number(offset)))
        throw new BadRequestException('유효하지 않은 limit 혹은 offset 값입니다.')

      const eventsListData: IEventData[] = await this.eventsModel
        .find({ category_seq: categorySeq })
        .limit(Number(limit))
        .skip(Number(offset))
        .exec()
      const totalData = await this.eventsModel.countDocuments({ category_seq: categorySeq }).exec()
      const resultData = eventsListData.map((data) => new EventDTO(data))
      const result = new EventListResponseDTO(resultData, totalData)

      return result
    } catch (err) {
      if (err instanceof HttpException) throw err
      else throw new InternalServerErrorException(err)
    }
  }

  async getEventDetail(eventId: string) {
    try {
      if (Number.isNaN(Number(eventId))) throw new BadRequestException('유효하지 eventSeq입니다.')

      const eventDetailData: IEventData = await this.eventsModel.findOne({ event_id: Number(eventId) }).exec()
      if (!eventDetailData) throw new NotFoundException('존재하지 않는 행사입니다.')

      const detailData = new EventDTO(eventDetailData)
      const result = new EventDetailResponseDTO(detailData)

      return result
    } catch (err) {
      if (err instanceof HttpException) throw err
      else throw new InternalServerErrorException(err)
    }
  }
}
