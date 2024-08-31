import { Expose, Type } from 'class-transformer'
import type { IEventData } from '@/events/types/events.type'

export class EventDTO {
  eventId: number
  categorySeq: number
  guSeq: number | null
  eventName: string
  period: string
  place: string
  orgName: string
  useTarget: string
  ticketPrice: string | null
  player: string | null
  describe: string | null
  etcDesc: string | null
  homepageLink: string
  mainImg: string
  regDate: string
  isPublic: boolean
  startDate: string
  endDate: string
  theme: string | null
  latitude: number
  longitude: number
  isFree: boolean
  detailUrl: string
  geohash: string

  constructor(data: IEventData) {
    this.eventId = data.event_id
    this.categorySeq = data.category_seq
    this.guSeq = data.gu_seq
    this.eventName = data.event_name
    this.period = data.period
    this.place = data.place
    this.orgName = data.org_name
    this.useTarget = data.use_target
    this.ticketPrice = data.ticket_price
    this.player = data.player
    this.describe = data.describe
    this.etcDesc = data.etc_desc
    this.homepageLink = data.homepage_link
    this.mainImg = data.main_img
    this.regDate = data.reg_date
    this.isPublic = data.is_public
    this.startDate = data.start_date
    this.endDate = data.end_date
    this.theme = data.theme
    this.latitude = data.latitude
    this.longitude = data.longitude
    this.isFree = data.is_free
    this.detailUrl = data.detail_url
    this.geohash = data.geohash
  }
}

export class EventListDTO {
  @Type(() => Number)
  @Expose({ name: 'event_id' })
  eventId: number

  @Type(() => Number)
  @Expose({ name: 'category_seq' })
  categorySeq: number

  @Type(() => String)
  @Expose({ name: 'event_name' })
  eventName: string

  @Type(() => String)
  @Expose()
  period: string

  @Type(() => String)
  @Expose({ name: 'main_img' })
  mainImg: string

  @Type(() => String)
  @Expose({ name: 'start_date' })
  startDate: string

  @Type(() => String)
  @Expose({ name: 'end_date' })
  endDate: string

  @Type(() => String)
  @Expose({ name: 'detail_url' })
  detailUrl: string
}

export class EventListResponseDTO {
  @Type(() => EventListDTO)
  @Expose()
  data: EventListDTO[]

  @Type(() => Number)
  @Expose()
  totalCount: number
}

export class EventDetailResponseDTO {
  data: EventDTO
  constructor(data: EventDTO) {
    this.data = data
  }
}

export class NearbyEventResponseDTO {
  data: Record<string, EventDTO[]>
  constructor(data: Record<string, EventDTO[]>) {
    this.data = data
  }
}
