export interface KakaoTokenResponse {
  access_token: string
  token_type: string
  refresh_token: string
  id_token: string
  expires_in: number
  scope: string
  refresh_token_expires_in: number
}

export interface KakaoUserInfoResponse {
  id: number
  connected_at: Date
  kakao_account: {
    profile_nickname_needs_agreement: boolean
    profile_image_needs_agreement: boolean
    profile: {
      nickname: string
      thumbnail_image_url: string
      profile_image_url: string
      is_default_image: boolean
      is_default_nickname: boolean
    }
    has_email: boolean
    email_needs_agreement: boolean
    is_email_valid: boolean
    is_email_verified: boolean
    email: string
  }
}
