import { Exclude, Expose, Type } from 'class-transformer'
import { Types } from 'mongoose'
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

export class EventDetailDTO {
  @Type(() => Types.ObjectId)
  @Exclude()
  _id: Types.ObjectId

  @Type(() => Number)
  @Expose({ name: 'event_id' })
  eventId: number

  @Type(() => Number)
  @Expose({ name: 'category_seq' })
  categorySeq: number

  @Type(() => Number)
  @Expose({ name: 'gu_seq' })
  guSeq: number | null

  @Type(() => String)
  @Expose({ name: 'event_name' })
  eventName: string

  @Type(() => String)
  @Expose()
  period: string

  @Type(() => String)
  @Expose()
  place: string

  @Type(() => String)
  @Expose({ name: 'org_name' })
  orgName: string

  @Type(() => String)
  @Expose({ name: 'use_target' })
  useTarget: string

  @Type(() => String || null)
  @Expose({ name: 'ticket_price' })
  ticketPrice: string | null

  @Type(() => String || null)
  @Expose()
  player: string | null

  @Type(() => String || null)
  @Expose()
  describe: string | null

  @Type(() => String || null)
  @Expose({ name: 'etc_desc' })
  etcDesc: string | null

  @Type(() => String)
  @Expose({ name: 'homepage_link' })
  homepageLink: string

  @Type(() => String)
  @Expose({ name: 'main_img' })
  mainImg: string

  @Type(() => String)
  @Expose({ name: 'reg_date' })
  regDate: string

  @Type(() => Boolean)
  @Expose({ name: 'is_public' })
  isPublic: boolean

  @Type(() => String)
  @Expose({ name: 'start_date' })
  startDate: string

  @Type(() => String)
  @Expose({ name: 'end_date' })
  endDate: string

  @Type(() => String || null)
  @Expose()
  theme: string | null

  @Type(() => Number)
  @Expose()
  latitude: number

  @Type(() => Number)
  @Expose()
  longitude: number

  @Type(() => Boolean)
  @Expose({ name: 'is_free' })
  isFree: boolean

  @Type(() => String)
  @Expose({ name: 'detail_url' })
  detailUrl: string

  @Type(() => String)
  @Expose()
  geohash: string
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
  @Type(() => EventDetailDTO)
  @Expose()
  data: EventDetailDTO
}

export class NearbyEventResponseDTO {
  data: Record<string, EventDTO[]>
  constructor(data: Record<string, EventDTO[]>) {
    this.data = data
  }
}
