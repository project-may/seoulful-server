import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import type { Model } from 'mongoose'

@Schema({ versionKey: false })
export class User extends Document {
  @Prop({ type: String, required: true })
  user_id: string

  @Prop({ type: String, required: true })
  login_method: 'naver' | 'kakao'

  @Prop({ type: String, required: true })
  nickname: string

  @Prop({ type: String, default: null })
  email: string | null

  @Prop({ type: String, default: null })
  profile_img: string | null

  @Prop({ type: Array, default: [], items: Number, ref: 'events' })
  bookmark_list: number[]

  @Prop({ type: String, default: null })
  access_token: string

  @Prop({ type: String, default: null })
  refresh_token: string

  @Prop({ type: Date, default: new Date() })
  created_at: Date
}

export const UserSchema = SchemaFactory.createForClass(User)

export type UserModel = Model<User>
