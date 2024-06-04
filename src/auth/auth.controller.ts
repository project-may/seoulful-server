import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Param, Post } from '@nestjs/common'
import { AuthService } from '@/auth/auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login/:provider')
  @HttpCode(HttpStatus.OK)
  async getToken(@Param('provider') provider: 'kakao' | 'naver', @Body() requestBody: { code: string; state: string }) {
    if (provider === 'kakao') {
      const { access_token, refresh_token } = await this.authService.getKakaoToken(requestBody)
      const kakaoUserInfo = await this.authService.getKakaoUserInfo(access_token)
      const result = await this.authService.checkAndSaveUser(kakaoUserInfo, access_token, refresh_token)
      return result
    }
    if (provider === 'naver') {
      const { access_token, refresh_token } = await this.authService.getNaverToken(requestBody)
      const naverUserInfo = await this.authService.getNaverUserInfo(access_token)
      const result = await this.authService.checkAndSaveUser(naverUserInfo, access_token, refresh_token)
      return result
    }
    throw new BadRequestException('Invalid provider')
  }

  // TODO: Logout 각 api별로 구현해야함
}
