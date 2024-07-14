import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User } from '@/schema/user.schema'
import { Events } from '@/schema/events.schema'
import { EventDTO, EventListResponseDTO } from '@/events/events.dto'
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
    const { bookmark_list }: IUserData = await this.userModel.findOne({ user_id: userId })
    const bookmarkCounts = bookmark_list.length

    if (bookmark_list.length === 0) {
      return new EventListResponseDTO([], bookmarkCounts)
    }

    const subQuery = {
      _id: 0,
      event_id: 1,
      category_seq: 1,
      event_name: 1,
      period: 1,
      main_img: 1,
      start_date: 1,
      end_date: 1,
      detail_url: 1
    }

    const bookmarkEvents = await Promise.all(
      bookmark_list.map((eventSeq) => this.eventsModel.findOne({ event_id: eventSeq }, subQuery) as Promise<IEventData>)
    )

    const resultData = bookmarkEvents.map((data) => new EventDTO(data))

    return new EventListResponseDTO(resultData, bookmarkCounts)
  }

  addBookmark(userId: string, payload: { eventSeq: number }) {
    return `userId: PUT ${userId}, eventSeq is ${payload.eventSeq}`
  }
}
