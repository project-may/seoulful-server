import { Module } from '@nestjs/common'
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { BookmarkController } from '@/bookmark/bookmark.controller'
import { BookmarkService } from '@/bookmark/bookmark.service'
import { User, UserSchema } from '@/schema/user.schema'
import { Events, EventsSchema } from '@/schema/events.schema'

/* 
북마크 구현
- 북마크는 PUT요청, GET 요청 두 개의 api가 나와야한다.
- PUT 요청으로 북마크를 추가한다.
  - 추가하는 데이터는 users 컬렉션의 bookmark_list 필드에 저장한다.
    - 어차피 response는 event 객체로 내려가야함
    - 서버에서 users.bookmark_list에 updateOne을 사용해서 추가
- GET 요청으로 유저의 북마크 리스트를 가져온다.
  - users 컬렉션의 bookmark_list 필드를 가져온다.
  - users.bookmark_list를 조회 후 해당 시퀀스를 가지고 event 컬렉션으로 쿼리를 한다.
*/

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Events.name, schema: EventsSchema }
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService): Promise<JwtModuleOptions> => ({
        secret: configService.get('JWT_SECRET'),
        verifyOptions: {
          algorithms: ['HS256']
        }
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [BookmarkController],
  providers: [BookmarkService]
})
export class BookmarkModule {}
