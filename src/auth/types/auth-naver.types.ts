export interface NaverTokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

export interface NaverUserInfoResponse {
  resultcode: string
  message: string
  response: {
    email: string
    nickname: string
    profile_image: string
    age: string
    gender: string
    id: string
    name: string
    birthday: string
  }
}
