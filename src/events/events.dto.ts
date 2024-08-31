import { Exclude, Expose, Type } from 'class-transformer'
import { Types } from 'mongoose'
import type { ObjectId } from 'mongoose'
import type { IEventData } from '@/events/types/events.type'

export class EventListDTO implements Partial<IEventData> {
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

export class EventDetailDTO implements Partial<IEventData> {
  @Type(() => Types.ObjectId)
  @Exclude()
  _id: ObjectId

  @Type(() => Number)
  @Expose({ name: 'event_id' })
  eventId: number

  @Type(() => Number)
  @Expose({ name: 'category_seq' })
  categorySeq: number

  @Type(({ object }) => {
    if (object.gu_seq === null) return null
    else return Number
  })
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

  @Type(({ object }) => {
    if (object.ticket_price === null) return null
    else return String
  })
  @Expose({ name: 'ticket_price' })
  ticketPrice: string | null

  @Type(({ object }) => {
    if (object.player === null) return null
    else return String
  })
  @Expose()
  player: string | null

  @Type(({ object }) => {
    if (object.describe === null) return null
    else return String
  })
  @Expose()
  describe: string | null

  @Type(({ object }) => {
    if (object.etc_desc === null) return null
    else return String
  })
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

  @Type(({ object }) => {
    if (object.theme === null) return null
    else return String
  })
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

export class NearbyEventListDTO implements Partial<IEventData> {
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

  @Type(() => Number)
  @Expose()
  latitude: number

  @Type(() => Number)
  @Expose()
  longitude: number

  @Type(() => String)
  @Expose()
  geohash: string
}

export class EventListResponseDTO {
  data: EventListDTO[]
  totalCount: number

  constructor(data: EventListDTO[], totalCount: number) {
    this.data = data
    this.totalCount = totalCount
  }
}

export class EventDetailResponseDTO {
  data: EventDetailDTO

  constructor(data: EventDetailDTO) {
    this.data = data
  }
}

export class NearbyEventListResponseDTO {
  data: Record<string, NearbyEventListDTO[]>

  constructor(data: Record<string, NearbyEventListDTO[]>) {
    this.data = data
  }
}
