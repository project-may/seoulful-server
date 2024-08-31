import { Controller, All, Req, UseFilters, HttpStatus, HttpException } from '@nestjs/common'
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter'
import type { Request } from 'express'

@Controller('*')
@UseFilters(HttpExceptionFilter)
export class WildcardController {
  @All()
  wildcardHandler(@Req() request: Request) {
    throw new HttpException(
      `👋 Oops! This route does not exist.\n\nYou tried to ${request.method} ${request.path}, but I'm just a teapot 🫖.\n\nPlease stop trying to access unauthorized routes. Your activity has been logged.`,
      HttpStatus.I_AM_A_TEAPOT
    )
  }
}
