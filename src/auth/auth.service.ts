import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios, { isAxiosError } from 'axios'
import type { KakaoTokenResponse, KakaoUserInfoResponse } from '@/auth/types/auth-kakao.types'

@Injectable()
export class AuthService {
  constructor(private configService: ConfigService) {}

  async getKakaoToken(requestBody: { code: string }) {
    const kakaoTokenUrl = 'https://kauth.kakao.com/oauth/token'
    const clientId = this.configService.get<string>('KAKAO_API_KEY')
    const authCode = requestBody.code
    const payload = {
      grant_type: 'authorization_code',
      client_id: clientId,
      // TODO: redirect_uri논의 필요 및 환경변수 화
      redirect_uri: 'http://localhost:5173/users/signin/kakao',
      code: authCode
    }
    try {
      const { data } = await axios.post<KakaoTokenResponse>(kakaoTokenUrl, payload, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' }
      })
      console.log('when Success Token', data)
      return data.access_token
    } catch (err) {
      if (isAxiosError(err)) {
        console.log('when Error Token', err.response.data)
      }
    }
  }

  async getKakaoUserInfo(token: string) {
    const kakaoUserInfoUrl = 'https://kapi.kakao.com/v2/user/me'
    const accessToken = `Bearer ${token}`
    const headers = {
      Authorization: accessToken,
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
    const propertyKeys = ['kakao_account.email', 'kakao_account.profile', 'kakao_account.name']
    const queryString = `property_keys=${JSON.stringify(propertyKeys)}`
    try {
      const { data } = await axios.get<KakaoUserInfoResponse>(`${kakaoUserInfoUrl}?${queryString}`, { headers })
      console.log('when Success UserInfo', data)

      return data
    } catch (err) {
      if (isAxiosError(err)) {
        console.log('when Error UserInfo', err.response.data)
      }
    }
  }
}
