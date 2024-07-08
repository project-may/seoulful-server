import { Module } from '@nestjs/common'
import { WildcardController } from '@/common/wildcard/wildcard.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Log, LogSchema } from '@/schema/logs.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Log.name,
        schema: LogSchema
      }
    ])
  ],
  controllers: [WildcardController]
})
export class WildcardModule {}
