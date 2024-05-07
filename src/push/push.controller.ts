import { Controller, Post, Body } from '@nestjs/common';
import { PushService } from './push.service';

@Controller('push')
export class PushController {
  constructor(private readonly pushService: PushService) {}

  @Post()
  async sendPushMessage(@Body() message: string): Promise<void> {
    await this.pushService.sendPushMessage(message);
  }

  // 예약을 여러개 하려면?

  @Post('/reserve-start')
  async startSchedule(@Body() time: number): Promise<void> {
    await this.pushService.startSchedule(time);
  }

  @Post('/reserve-stop')
  async stopSchedule(@Body() message: string): Promise<void> {
    await this.pushService.stopSchedule(message);
  }
}
