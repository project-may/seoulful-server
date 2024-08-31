import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common'
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import { ConfigService } from '@nestjs/config'
import { plainToInstance } from 'class-transformer'
import axios, { isAxiosError } from 'axios'
import { User, UserModel } from '@/schema/user.schema'
import { UserDTO, UserResponseDTO } from '@/auth/user.dto'
import type { KakaoTokenResponse, KakaoUserInfoResponse } from '@/auth/types/auth-kakao.types'
import type { NaverTokenResponse, NaverUserInfoResponse } from '@/auth/types/auth-naver.types'
import type { IAuthJwtPayload, IAuthKakaoRequestBody, IAuthNaverRequestBody, IUserData } from '@/auth/types/user.types'

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    @InjectModel(User.name) private readonly userModel: UserModel,
    private readonly jwtService: JwtService
  ) {}

  validateToken(accessToken: string) {
    if (!accessToken) throw new BadRequestException('토큰 값이 없습니다.')
    try {
      this.jwtService.verify<IAuthJwtPayload>(accessToken)
      return
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new UnauthorizedException('토큰이 만료되었습니다.')
      }
      if (err instanceof JsonWebTokenError) {
        throw new UnauthorizedException('유효하지 않은 토큰입니다.')
      }
      throw new InternalServerErrorException(err)
    }
  }

  async reissueToken(refreshToken: string) {
    if (!refreshToken) throw new BadRequestException('토큰 값이 없습니다.')
    try {
      const decoded = await this.jwtService.verifyAsync<IAuthJwtPayload>(refreshToken)
      const { userId, objId } = decoded
      const user = await this.userModel.findOne<IUserData>({ user_id: userId, _id: objId } satisfies Partial<IUserData>)

      if (!user) {
        throw new NotFoundException('존재하지 않는 유저입니다.')
      }

      const { userAccessToken } = await this.generateJwtToken(user)

      const updatedUser = await this.userModel.findOneAndUpdate<IUserData>(
        { user_id: userId, _id: objId } satisfies Partial<IUserData>,
        { user_access_token: userAccessToken } satisfies Partial<IUserData>,
        { new: true }
      )

      const userDto = plainToInstance(UserDTO, updatedUser, { excludeExtraneousValues: true })
      const response = new UserResponseDTO(userDto)

      return response
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new UnauthorizedException('토큰이 만료되었습니다.')
      }
      if (err instanceof JsonWebTokenError) {
        throw new UnauthorizedException('유효하지 않은 토큰입니다.')
      }
      throw new InternalServerErrorException(err)
    }
  }

  async generateJwtToken(user: IUserData) {
    const payload: IAuthJwtPayload = { userId: user.user_id, objId: user._id }

    const userAccessToken = this.jwtService.sign(payload, { expiresIn: '15m' })
    const userRefreshToken = this.jwtService.sign(payload, { expiresIn: '7d' })

    return { userAccessToken, userRefreshToken }
  }

  async saveUser(
    user: KakaoUserInfoResponse | NaverUserInfoResponse,
    accessToken: string,
    refreshToken: string
  ): Promise<IUserData> {
    if ('kakao_account' in user) {
      const userDataFromKakao = {
        user_id: String(user.id),
        login_method: 'kakao',
        nickname: user.kakao_account.profile.nickname,
        email: user.kakao_account.email,
        profile_img: user.kakao_account.profile.profile_image_url,
        access_token: accessToken,
        refresh_token: refreshToken
      }
      const newUser = new this.userModel(userDataFromKakao)
      await newUser.save()
      const savedKakaoUser = await this.userModel.findOne<IUserData>({
        user_id: String(user.id),
        login_method: 'kakao'
      } satisfies Partial<IUserData>)
      const { userAccessToken, userRefreshToken } = await this.generateJwtToken(savedKakaoUser)
      const kakaoUserWithToken = await this.userModel.findOneAndUpdate<IUserData>(
        { user_id: String(user.id), login_method: 'kakao' } satisfies Partial<IUserData>,
        { user_access_token: userAccessToken, user_refresh_token: userRefreshToken } satisfies Partial<IUserData>,
        { new: true }
      )

      return kakaoUserWithToken
    } else {
      const userDataFromNaver = {
        user_id: user.response.id,
        login_method: 'naver',
        nickname: user.response.nickname,
        email: user.response.email,
        profile_img: user.response.profile_image,
        access_token: accessToken,
        refresh_token: refreshToken
      }
      const newUser = new this.userModel(userDataFromNaver)
      await newUser.save()
      const savedNaverUser = await this.userModel.findOne<IUserData>({
        user_id: user.response.id,
        login_method: 'naver'
      } satisfies Partial<IUserData>)
      const { userAccessToken, userRefreshToken } = await this.generateJwtToken(savedNaverUser)

      const naverUserWithToken = await this.userModel.findOneAndUpdate<IUserData>(
        { user_id: String(user.response.id), login_method: 'naver' } satisfies Partial<IUserData>,
        { user_access_token: userAccessToken, user_refresh_token: userRefreshToken } satisfies Partial<IUserData>,
        { new: true }
      )
      return naverUserWithToken
    }
  }

  // TODO: 액세스토큰, 리프레쉬토큰을 각 api response를 받을때 같이 생성 후 db에 저장
  // TODO: UUID를 활용할지 아니면 _id를 활용할지 판단 필요
  async checkAndSaveUser(
    user: KakaoUserInfoResponse | NaverUserInfoResponse,
    accessToken: string,
    refreshToken: string
  ) {
    if ('kakao_account' in user) {
      const userData = await this.userModel.findOne({
        nickname: user.kakao_account.profile.nickname
      } satisfies Partial<IUserData>)

      if (!userData) {
        const resultData = await this.saveUser(user, accessToken, refreshToken)
        const userDto = plainToInstance(UserDTO, resultData, { excludeExtraneousValues: true })
        const result = new UserResponseDTO(userDto)
        return result
      } else {
        const { userAccessToken, userRefreshToken } = await this.generateJwtToken(userData.toObject() as IUserData)
        const kakaoUser = await this.userModel
          .findOneAndUpdate<IUserData>(
            { nickname: user.kakao_account.profile.nickname, login_method: 'kakao' } satisfies Partial<IUserData>,
            { user_access_token: userAccessToken, user_refresh_token: userRefreshToken } satisfies Partial<IUserData>,
            { new: true }
          )
          .lean()
        const userDto = plainToInstance(UserDTO, kakaoUser, { excludeExtraneousValues: true })
        const result = new UserResponseDTO(userDto)
        return result
      }
    } else {
      const userData = await this.userModel.findOne({
        nickname: user.response.nickname
      } satisfies Partial<IUserData>)

      if (!userData) {
        const resultData: IUserData = await this.saveUser(user, accessToken, refreshToken)
        const userDto = plainToInstance(UserDTO, resultData, { excludeExtraneousValues: true })
        const result = new UserResponseDTO(userDto)
        return result
      } else {
        const { userAccessToken, userRefreshToken } = await this.generateJwtToken(userData.toObject() as IUserData)
        const naverUser = await this.userModel
          .findOneAndUpdate(
            { nickname: user.response.nickname, login_method: 'naver' } satisfies Partial<IUserData>,
            { user_access_token: userAccessToken, user_refresh_token: userRefreshToken } satisfies Partial<IUserData>,
            { new: true }
          )
          .lean()
        const userDto = plainToInstance(UserDTO, naverUser, { excludeExtraneousValues: true })
        const result = new UserResponseDTO(userDto)
        return result
      }
    }
  }

  async getKakaoToken(requestBody: IAuthKakaoRequestBody) {
    if (!requestBody.code) {
      throw new BadRequestException('code 값이 없습니다.')
    }
    const kakaoTokenUrl = 'https://kauth.kakao.com/oauth/token'
    const clientId = this.configService.get<string>('KAKAO_API_KEY')
    const authCode = requestBody.code
    const redirectUrl = requestBody.redirectUrl

    const payload = {
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: this.configService.get<string>('KAKAO_SECRET_KEY'),
      redirect_uri: redirectUrl,
      code: authCode
    }
    try {
      const { data } = await axios.post<KakaoTokenResponse>(kakaoTokenUrl, payload, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' }
      })
      return data
    } catch (err) {
      if (isAxiosError(err)) {
        if (err.response.status === 400) {
          throw new BadRequestException(err.response.data.error_description)
        }
        // TODO: 카카오 서버 에러 메시지 처리 추가 필요
        throw new InternalServerErrorException(err.response.data)
      }
    }
  }

  async getKakaoUserInfo(token: string) {
    if (!token) throw new BadRequestException('token 값이 없습니다.')
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
      return data
    } catch (err) {
      if (isAxiosError(err)) {
        if (err.response.status === 401) {
          throw new UnauthorizedException(err.response.data)
        }
        throw new InternalServerErrorException(err.response.data)
      }
    }
  }

  async getNaverToken(requestBody: IAuthNaverRequestBody) {
    if (!requestBody.code || !requestBody.state) throw new BadRequestException('code 또는 state 값이 없습니다.')

    const naverTokenUrl = 'https://nid.naver.com/oauth2.0/token'

    const clientId = this.configService.get<string>('NAVER_CLIENT_ID')
    const secretKey = this.configService.get<string>('NAVER_SECRET_KEY')
    const authCode = requestBody.code
    const state = requestBody.state

    const params = {
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: secretKey,
      code: authCode,
      state: encodeURI(state)
    }

    try {
      const { data } = await axios.get<NaverTokenResponse>(`${naverTokenUrl}`, { params })
      return data
    } catch (err) {
      if (isAxiosError(err)) {
        throw new InternalServerErrorException(err.response.data)
      }
    }
  }

  async getNaverUserInfo(accessToken: string) {
    if (!accessToken) throw new BadRequestException('accessToken 값이 없습니다.')

    const naverUserInfoUrl = 'https://openapi.naver.com/v1/nid/me'
    const headers = {
      Authorization: `Bearer ${accessToken}`
    }

    try {
      const { data } = await axios.get<NaverUserInfoResponse>(naverUserInfoUrl, { headers })
      return data
    } catch (err) {
      if (isAxiosError(err)) {
        if (err.response.status === 401) {
          throw new UnauthorizedException(err.response.data)
        }
        throw new InternalServerErrorException(err.response.data)
      }
    }
  }

  async getUserDetail(userId: string, provider: 'kakao' | 'naver') {
    if (!provider || (provider !== 'kakao' && provider !== 'naver')) {
      throw new BadRequestException('유효하지 않은 로그인 수단입니다.')
    }

    if (!userId || !userId.trim()) {
      throw new BadRequestException('userId 값이 없습니다.')
    }

    try {
      const userData = await this.userModel.findOne({ user_id: userId, login_method: provider }).lean().exec()

      if (!userData) {
        throw new NotFoundException('유저 정보를 찾을 수 없습니다.')
      }

      const userDto = plainToInstance(UserDTO, userData, { excludeExtraneousValues: true })
      const result = new UserResponseDTO(userDto)

      return result
    } catch (err) {
      if (err instanceof NotFoundException || err instanceof BadRequestException) {
        throw err
      }
      throw new InternalServerErrorException(err)
    }
  }
}
