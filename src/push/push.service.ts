import { HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { msToCronExpression } from 'src/util/time.formatting.util';

@Injectable()
export class PushService {
  constructor(
    private http: HttpService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  async sendPushMessage(pushDto: any): Promise<void> {
    try {
      console.log('hi');
    } catch (error) {
      throw new HttpException(
        'Failed to send push notification',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async startSchedule(time: number): Promise<{ time: number }> {
    const name = 'cronjob';
    const cronExpression = msToCronExpression(time); // Example usage
    const job = new CronJob(cronExpression, () => {});
    this.schedulerRegistry.addCronJob(name, job);
    const cronjob = this.schedulerRegistry.getCronJob('cronjob');
    cronjob.start();
    return { time };
  }

  async stopSchedule(
    message: string,
  ): Promise<{ lastDate: Date; message: string }> {
    const name = 'cronjob';
    const job = this.schedulerRegistry.getCronJob(name);
    job.stop();
    const lastDate = job.lastDate();
    return { lastDate, message };
  }
}
