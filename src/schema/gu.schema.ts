import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

@Schema()
export class Gu extends Document {
  @Prop({ type: Types.ObjectId, required: true })
  _id: Types.ObjectId

  @Prop({ type: Number, required: true })
  gu_id: number

  @Prop({ type: String, required: true })
  gu_name: string
}

export const GuSchema = SchemaFactory.createForClass(Gu)