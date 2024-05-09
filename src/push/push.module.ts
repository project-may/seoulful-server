import { Module } from '@nestjs/common';
import { PushService } from './push.service';
import { PushController } from './push.controller';
import { HttpModule } from '@nestjs/axios';
import { FirebaseService } from 'src/common/config/firebase.service';
import { SchedulerRegistry } from '@nestjs/schedule';

@Module({
  imports: [HttpModule],
  providers: [PushService, FirebaseService, SchedulerRegistry],
  controllers: [PushController],
})
export class PushModule {}
