import { Exclude, Expose, Transform, Type } from 'class-transformer'
import { Types } from 'mongoose'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
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
  @Transform(({ value }) => format(new Date(value).toLocaleDateString('ko-kr'), 'yyyy.M.d HH:mm', { locale: ko }))
  startDate: string

  @Type(() => String)
  @Expose({ name: 'end_date' })
  @Transform(({ value }) => format(new Date(value).toLocaleDateString('ko-kr'), 'yyyy.M.d HH:mm', { locale: ko }))
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

  @Type(() => String)
  @Expose({ name: 'ticket_price' })
  ticketPrice: string | null

  @Type(() => String)
  @Expose()
  player: string | null

  @Type(() => String)
  @Expose()
  describe: string | null

  @Type(() => String)
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
  @Transform(({ value }) => format(new Date(value).toLocaleDateString('ko-kr'), 'yyyy.M.d HH:mm', { locale: ko }))
  regDate: string

  @Type(() => Boolean)
  @Expose({ name: 'is_public' })
  isPublic: boolean

  @Type(() => String)
  @Expose({ name: 'start_date' })
  @Transform(({ value }) => format(new Date(value).toLocaleDateString('ko-kr'), 'yyyy.M.d HH:mm', { locale: ko }))
  startDate: string

  @Type(() => String)
  @Expose({ name: 'end_date' })
  @Transform(({ value }) => format(new Date(value).toLocaleDateString('ko-kr'), 'yyyy.M.d HH:mm', { locale: ko }))
  endDate: string

  @Type(() => String)
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
  @Transform(({ value }) => format(new Date(value).toLocaleDateString('ko-kr'), 'yyyy.M.d HH:mm', { locale: ko }))
  startDate: string

  @Type(() => String)
  @Expose({ name: 'end_date' })
  @Transform(({ value }) => format(new Date(value).toLocaleDateString('ko-kr'), 'yyyy.M.d HH:mm', { locale: ko }))
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
