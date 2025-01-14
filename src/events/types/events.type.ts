import type { Model, ObjectId } from 'mongoose'

export interface IEventData {
  _id: ObjectId
  event_id: number
  category_seq: number
  gu_seq: number | null
  event_name: string
  period: string
  place: string
  org_name: string
  use_target: string
  ticket_price: string | null
  player: string | null
  describe: string | null
  etc_desc: string | null
  homepage_link: string
  main_img: string
  reg_date: Date // date string yyyy.MM.dd HH:mm
  is_public: boolean
  start_date: Date // date string yyyy.MM.dd HH:mm
  end_date: Date // date string yyyy.MM.dd HH:mm
  theme: string | null
  latitude: number
  longitude: number
  is_free: boolean
  detail_url: string
  geohash: string
}

export type EventsModel = Model<IEventData>
