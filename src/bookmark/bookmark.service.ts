import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User } from '@/schema/user.schema'
import { Events } from '@/schema/events.schema'
import type { UserModel } from '@/schema/user.schema'
import type { EventsModel } from '@/events/types/events.type'
import type { IUserData } from '@/auth/types/user.types'
import type { IEventData } from '@/events/types/events.type'

@Injectable()
export class BookmarkService {
  constructor(
    @InjectModel(User.name) private readonly userModel: UserModel,
    @InjectModel(Events.name) private readonly eventsModel: EventsModel
  ) {}

  async getBookmarkList(userId: string) {
    const bookmarkListArr = []
    const { bookmark_list }: IUserData = await this.userModel.findOne({ user_id: userId })

    if (bookmark_list.length > 0) {
      for (const eventSeq of bookmark_list) {
        const event: IEventData = await this.eventsModel.findOne({ event_id: eventSeq })
        bookmarkListArr.push(event)
      }
    }

    return `userId: GET ${userId} bookmark list is ${bookmarkListArr.length === 0 ? 'empty' : bookmarkListArr}`
  }

  addBookmark(userId: string, payload: { eventSeq: number }) {
    return `userId: PUT ${userId}, eventSeq is ${payload.eventSeq}`
  }
}
