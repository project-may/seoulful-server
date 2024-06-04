import type { IUserData } from '@/auth/types/user.types'

export class UserDTO {
  userId: string
  loginMethod: 'naver' | 'kakao'
  nickname: string
  email: string | null
  profileImg: string | null
  bookmarkList: number[]
  accessToken: string | null
  refreshToken: string | null
  createdAt: Date

  constructor(userData: IUserData) {
    this.userId = userData.user_id
    this.loginMethod = userData.login_method
    this.nickname = userData.nickname
    this.email = userData.email
    this.profileImg = userData.profile_img
    this.bookmarkList = userData.bookmark_list
    this.accessToken = userData.access_token
    this.refreshToken = userData.refresh_token
    this.createdAt = userData.created_at
  }
}

export class UserResponseDTO {
  data: UserDTO
  constructor(userData: UserDTO) {
    this.data = userData
  }
}
