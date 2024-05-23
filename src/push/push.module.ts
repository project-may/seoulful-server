import { Module } from '@nestjs/common'
import { SchedulerRegistry } from '@nestjs/schedule'
import { HttpModule } from '@nestjs/axios'
import { PushService } from '@/push/push.service'
import { PushController } from '@/push/push.controller'
import { FirebaseService } from '@/common/config/firebase.service'

@Module({
  imports: [HttpModule],
  providers: [PushService, FirebaseService, SchedulerRegistry],
  controllers: [PushController]
})
export class PushModule {}
