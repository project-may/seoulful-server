import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { AppController } from '@/app.controller'
import { AppService } from '@/app.service'
import { PushModule } from '@/push/push.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI')
      }),
      inject: [ConfigService]
    }),
    ScheduleModule.forRoot(),
    PushModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
