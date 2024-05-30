import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { EventsSchema, Events } from '@/schema/events.schema'
import { EventsController } from '@/events/events.controller'
import { EventsService } from '@/events/events.service'
import { Log, LogSchema } from '@/schema/logs.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Events.name,
        schema: EventsSchema
      },
      {
        name: Log.name,
        schema: LogSchema
      }
    ])
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService]
})
export class EventsModule {}
