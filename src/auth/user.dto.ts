import { Type, Expose, Transform, Exclude } from 'class-transformer'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Types } from 'mongoose'
import type { ObjectId } from 'mongoose'
import type { IUserData } from '@/auth/types/user.types'

export class UserDTO implements Partial<IUserData> {
  @Type(() => Types.ObjectId)
  @Exclude()
  _id: ObjectId

  @Type(() => String)
  @Expose({ name: 'user_id' })
  userId: string

  @Type(() => String)
  @Expose({ name: 'login_method' })
  loginMethod: 'naver' | 'kakao'

  @Type(() => String)
  @Expose()
  nickname: string

  @Type(({ object }) => {
    if (object.email === null) return null
    else return String
  })
  @Expose()
  email: string | null

  @Type(() => String)
  @Expose({ name: 'profile_img' })
  profileImg: string | null

  @Type(() => Array<number>)
  @Expose({ name: 'bookmark_list' })
  bookmarkList: number[]

  @Type(({ object }) => {
    if (object.user_access_token === null) return null
    else return String
  })
  @Expose({ name: 'user_access_token' })
  accessToken: string | null

  @Type(({ object }) => {
    if (object.user_refresh_token === null) return null
    else return String
  })
  @Expose({ name: 'user_refresh_token' })
  refreshToken: string | null

  @Type(() => Date)
  @Expose({ name: 'created_at' })
  @Transform(({ value }) => format(value, 'yyyy.MM.dd(E) HH:mm:ss', { locale: ko }))
  createdAt: string
}

export class UserResponseDTO {
  data: UserDTO
  constructor(userData: UserDTO) {
    this.data = userData
  }
}
