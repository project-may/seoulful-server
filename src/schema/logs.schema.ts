import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

import type { HttpStatus } from '@nestjs/common'
import type { Model, ObjectId } from 'mongoose'

@Schema({ versionKey: false })
export class Log extends Document {
  @Prop({ type: Types.ObjectId, required: true, unique: true })
  request_id: ObjectId

  @Prop({ type: String, required: true })
  level: 'log' | 'warn' | 'error'

  @Prop({ type: String, required: true })
  error_name: string

  @Prop({ type: String, required: true })
  method: string

  @Prop({ type: Number, required: true })
  status_code: HttpStatus

  @Prop({ type: String, required: true })
  message: string

  @Prop({ type: String, required: true })
  original_url: string

  @Prop({ type: String, required: true })
  hostname: string

  @Prop({ type: Object, required: true })
  headers: Record<string, unknown>

  @Prop({ type: Number, required: true, default: Date.now() })
  timestamp: number
}

export const LogSchema = SchemaFactory.createForClass(Log)

export type LogModel = Model<Log>
