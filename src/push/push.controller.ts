import { Controller, Body } from '@nestjs/common'
import { PushService } from './push.service'
import { PostApi } from 'src/common/decorator/api.decorator'

@Controller('push')
export class PushController {
  constructor(private readonly pushService: PushService) {}

  @PostApi(() => {}, {
    path: '/message',
    description: '예약 메세지 전송'
  })
  async sendPushMessage(@Body() message: string): Promise<void> {
    await this.pushService.sendPushMessage(message)
  }

  // 예약을 여러개 하려면?

  @PostApi(() => {}, {
    path: '/reserve-start',
    description: '예약 시작'
  })
  async startSchedule(@Body() time: number): Promise<void> {
    await this.pushService.startSchedule(time)
  }

  @PostApi(() => {}, {
    path: '/reserve-stop',
    description: '예약 종료'
  })
  async stopSchedule(@Body() message: string): Promise<void> {
    await this.pushService.stopSchedule(message)
  }
}
