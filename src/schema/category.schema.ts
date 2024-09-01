import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema()
export class Category extends Document {
  @Prop({ type: Number, required: true })
  category_id: number

  @Prop({ type: String, required: true })
  category_name: string
}
export const CategorySchema = SchemaFactory.createForClass(Category)
