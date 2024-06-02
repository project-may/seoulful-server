import { Body, Controller, HttpCode, HttpStatus, Param, Post } from '@nestjs/common'
import { AuthService } from '@/auth/auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login/:provider')
  @HttpCode(HttpStatus.OK)
  async getToken(@Param('provider') provider: 'kakao' | 'google' | 'naver', @Body() requestBody: { code: string }) {
    if (provider === 'kakao') {
      const accessToken = await this.authService.getKakaoToken(requestBody)
      const userInfo = await this.authService.getKakaoUserInfo(accessToken)
      return userInfo
    }
  }
}
