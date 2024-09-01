import { Module, RequestMethod } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_FILTER } from '@nestjs/core'
import { AppController } from '@/app.controller'
import { AppService } from '@/app.service'
import { EventsModule } from '@/events/events.module'
import { AuthModule } from '@/auth/auth.module'
import { Log, LogSchema } from '@/schema/logs.schema'
import { LoggingMiddleware } from '@/middleware/logging.middleware'
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter'
import { WildcardModule } from '@/common/wildcard/wildcard.module'
import { BookmarkModule } from '@/bookmark/bookmark.module'
import type { MiddlewareConsumer } from '@nestjs/common'

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
    EventsModule,
    AuthModule,
    BookmarkModule,
    WildcardModule
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_FILTER, useClass: HttpExceptionFilter }]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}
