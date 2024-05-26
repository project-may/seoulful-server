import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { AppController } from '@/app.controller'
import { AppService } from '@/app.service'
import { PushModule } from '@/push/push.module'
import { EventsModule } from '@/events/events.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (env: ConfigService) => ({
        uri: env.get<string>('MONGO_URI_PRODUCTION')
      }),
      inject: [ConfigService]
    }),
    ScheduleModule.forRoot(),
    PushModule,
    EventsModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
