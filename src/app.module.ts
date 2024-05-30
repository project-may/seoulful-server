import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { AppController } from '@/app.controller'
import { AppService } from '@/app.service'
import { PushModule } from '@/push/push.module'
import { EventsModule } from '@/events/events.module'
import { Log, LogSchema } from '@/schema/logs.schema'
import { LoggingMiddleware } from '@/middleware/loggin.middleware'
import { APP_FILTER } from '@nestjs/core'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'

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
    MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }]),
    ScheduleModule.forRoot(),
    PushModule,
    EventsModule
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_FILTER, useClass: HttpExceptionFilter }]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}
