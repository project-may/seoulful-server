import { Controller, Post, Body } from '@nestjs/common';
import { PushService } from './push.service';

@Controller('push')
export class PushController {
  constructor(private readonly pushService: PushService) {}

  @Post()
  async sendPushMessage(@Body() message: string): Promise<void> {
    await this.pushService.sendPushMessage(message);
  }
}
