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
  regDate: Date
  isPublic: boolean
  startDate: Date
  endDate: Date
  theme: string | null
  latitude: number
  longitude: number
  isFree: boolean
  detailUrl: string

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
  }
}

export class EventListResponseDTO {
  data: EventDTO[]
  totalCount: number

  constructor(data: EventDTO[], totalCount: number) {
    this.data = data
    this.totalCount = totalCount
  }
}

export class EventDetailResponseDTO {
  data: EventDTO
  constructor(data: EventDTO) {
    this.data = data
  }
}
