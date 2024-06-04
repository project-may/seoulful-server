import type { ObjectId } from 'mongoose'

export interface IUserData {
  _id: ObjectId
  user_id: string
  login_method: 'naver' | 'kakao'
  nickname: string
  email: string | null
  profile_img: string | null
  bookmark_list: number[]
  access_token: string | null
  refresh_token: string | null
  created_at: Date
}
