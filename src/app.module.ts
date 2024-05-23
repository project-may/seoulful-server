import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { AppController } from '@/app.controller'
import { AppService } from '@/app.service'
import { PushModule } from '@/push/push.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ScheduleModule.forRoot(),
    PushModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
