import { Controller, All, Req, Res } from '@nestjs/common'
import { Request, Response } from 'express'

@Controller('*')
export class WildcardController {
  @All()
  wildcardHandler(@Req() request: Request, @Res() response: Response) {
    response
      .status(418)
      .send(
        `👋 Oops! This route does not exist.\n\nYou tried to ${request.method} ${request.path}, but I'm just a teapot 🫖.\n\nPlease stop trying to access unauthorized routes. Your activity has been logged.`
      )
  }
}
