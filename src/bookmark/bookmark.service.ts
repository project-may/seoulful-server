import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User } from '@/schema/user.schema'
import { Events } from '@/schema/events.schema'
import { EventDTO, EventListResponseDTO } from '@/events/events.dto'
import { UserDTO, UserResponseDTO } from '@/auth/user.dto'
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
    try {
      const user: IUserData = await this.userModel.findOne({ user_id: userId })
      if (!user) throw new NotFoundException('해당 유저를 찾을 수 없습니다.')

      const bookmarkCounts = user.bookmark_list.length

      if (user.bookmark_list.length === 0) {
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
        user.bookmark_list.map(
          (eventSeq) => this.eventsModel.findOne({ event_id: eventSeq }, subQuery) as Promise<IEventData>
        )
      )

      const resultData = bookmarkEvents.map((data) => new EventDTO(data))

      return new EventListResponseDTO(resultData, bookmarkCounts)
    } catch (err) {
      if (err instanceof HttpException) throw err
      else throw new InternalServerErrorException(err)
    }
  }

  async addBookmark(userId: string, payload?: { eventSeq?: number }) {
    try {
      if (!payload || payload.eventSeq == null) throw new BadRequestException('eventSeq가 존재하지 않습니다.')

      const user: IUserData = await this.userModel.findOne({ user_id: userId })
      if (!user) throw new NotFoundException('해당 유저를 찾을 수 없습니다.')

      const isExist = user.bookmark_list.includes(payload.eventSeq)
      if (isExist) throw new BadRequestException('이미 북마크한 행사입니다.')

      const updatedUser: IUserData = await this.userModel.findOneAndUpdate(
        { user_id: userId },
        { $push: { bookmark_list: payload.eventSeq } },
        { new: true, projection: { _id: 0, bookmark_list: 1 } }
      )

      const resultUserData = new UserDTO(updatedUser)

      return new UserResponseDTO(resultUserData)
    } catch (err) {
      if (err instanceof HttpException) throw err
      else throw new InternalServerErrorException(err)
    }
  }

  async deleteBookmark(userId: string, payload?: { eventSeq?: number }) {
    try {
      if (!payload || payload.eventSeq == null) throw new BadRequestException('eventSeq가 존재하지 않습니다.')

      const user: IUserData = await this.userModel.findOne({ user_id: userId })
      if (!user) throw new NotFoundException('해당 유저를 찾을 수 없습니다.')

      const isExist = user.bookmark_list.includes(payload.eventSeq)
      if (!isExist) throw new BadRequestException('북마크한 행사가 아닙니다.')

      const updatedUser: IUserData = await this.userModel.findOneAndUpdate(
        { user_id: userId } satisfies Partial<IUserData>,
        { $pull: { bookmark_list: payload.eventSeq } },
        { new: true, projection: { _id: 0, bookmark_list: 1 } }
      )

      const resultUserData = new UserDTO(updatedUser)

      return new UserResponseDTO(resultUserData)
    } catch (err) {
      if (err instanceof HttpException) throw err
      else throw new InternalServerErrorException(err)
    }
  }
}
