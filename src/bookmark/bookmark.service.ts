import { Injectable } from '@nestjs/common'
import { User, UserModel } from '@/schema/user.schema'
import { InjectModel } from '@nestjs/mongoose'
import type { IUserData } from '@/auth/types/user.types'

@Injectable()
export class BookmarkService {
  constructor(@InjectModel(User.name) private readonly userModel: UserModel) {}

  getBookmarkList(userId: string) {
    return `userId: GET ${userId}`
  }

  addBookmark(userId: string, payload: { eventSeq: number }) {
    return `userId: PUT ${userId}, eventSeq is ${payload.eventSeq}`
  }
}
