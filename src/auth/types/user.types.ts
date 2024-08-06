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
  user_access_token: string | null
  user_refresh_token: string | null
}

interface IBaseAuthRequestBody {
  code: string
}

export interface IAuthNaverRequestBody extends IBaseAuthRequestBody {
  state: string
}

export interface IAuthKakaoRequestBody extends IBaseAuthRequestBody {
  redirectUrl: string
}

export type AuthProvider = 'naver' | 'kakao'
export type AuthRequestBody = IAuthKakaoRequestBody | IAuthNaverRequestBody
