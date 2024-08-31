import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema()
export class Events extends Document {
  @Prop({ type: Number, required: true })
  event_id: number

  @Prop({ type: Number, required: true, ref: 'Category' })
  category_seq: number

  @Prop({ type: Number, default: null, ref: 'Gu' })
  gu_seq: number

  @Prop({ type: String, required: true })
  event_name: string

  @Prop({ type: String, required: true })
  period: string

  @Prop({ type: String, required: true })
  place: string

  @Prop({ type: String, required: true })
  org_name: string

  @Prop({ type: String, required: true })
  use_target: string

  @Prop({ type: String, default: null })
  ticket_price: string | null

  @Prop({ type: String, default: null })
  player: string | null

  @Prop({ type: String, default: null })
  describe: string | null

  @Prop({ type: String, default: null })
  etc_desc: string | null

  @Prop({ type: String, required: true })
  homepage_link: string

  @Prop({ type: String, required: true })
  main_img: string

  @Prop({ type: String, required: true })
  reg_date: string

  @Prop({ type: Boolean, required: true })
  is_public: boolean

  @Prop({ type: String, required: true })
  start_date: string

  @Prop({ type: String, required: true })
  end_date: string

  @Prop({ type: String, default: null })
  theme: string | null

  @Prop({ type: Number, required: true })
  latitude: number

  @Prop({ type: Number, required: true })
  longitude: number

  @Prop({ type: Boolean, required: true })
  is_free: boolean

  @Prop({ type: String, required: true })
  detail_url: string

  @Prop({ type: String, required: true })
  geohash: string
}

export const EventsSchema = SchemaFactory.createForClass(Events)
