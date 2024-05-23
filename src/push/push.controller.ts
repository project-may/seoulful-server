import { Controller, Body, Post, HttpStatus, HttpCode } from '@nestjs/common'
import { PushService } from '@/push/push.service'

@Controller('push')
export class PushController {
  constructor(private readonly pushService: PushService) {}

  // @Post('/message')
  // @HttpCode(HttpStatus.OK)
  // async sendPushMessage(@Body() message: string): Promise<void> {
  //   await this.pushService.sendPushMessage(message)
  // }

  // 예약을 여러개 하려면?
  @Post('/reserve-start')
  @HttpCode(HttpStatus.OK)
  async startSchedule(@Body() time: number): Promise<void> {
    await this.pushService.startSchedule(time)
  }

  @Post('/reserve-stop')
  @HttpCode(HttpStatus.OK)
  async stopSchedule(@Body() message: string): Promise<void> {
    await this.pushService.stopSchedule(message)
  }
}
