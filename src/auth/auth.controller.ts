import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards
} from '@nestjs/common'
import { AuthService } from '@/auth/auth.service'
import { JwtAuthGuard } from '@/common/jwt/jwt-auth.guard'

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

  @Get('/user/:userId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  getUserDetail(@Param('userId') userId: string, @Query('provider') provider: 'kakao' | 'naver') {
    return this.authService.getUserDetail(userId, provider)
  }

  // TODO: Logout 각 api별로 구현해야함
}
