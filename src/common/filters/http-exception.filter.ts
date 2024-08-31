import { Catch, HttpException, HttpStatus } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { Log } from '@/schema/logs.schema'
import type { ExceptionFilter, ArgumentsHost } from '@nestjs/common'
import type { Response } from 'express'
import type { LogModel } from '@/schema/logs.schema'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(@InjectModel(Log.name) private customLog: LogModel) {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest()
    const status = exception.getStatus()
    const timestamp = Date.now()

    const logFormat = {
      request_id: new mongoose.Types.ObjectId(),
      level: status >= HttpStatus.INTERNAL_SERVER_ERROR ? 'error' : status >= HttpStatus.BAD_REQUEST && 'warn',
      error_name: exception.name,
      method: request.method,
      status_code: status,
      message: exception.message,
      original_url: request.originalUrl,
      hostname: request.hostname,
      headers: request.headers,
      timestamp
    }

    const timeDiff = Date.now() - 500

    const existingLog = await this.customLog.findOne({
      original_url: request.originalUrl,
      level: logFormat.level,
      method: request.method,
      status_code: status,
      message: exception.message,
      timestamp: { $gte: timeDiff }
    })

    if (existingLog === null) {
      const logEntry = new this.customLog(logFormat)
      await logEntry.save()
    }

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      timestamp
    })
  }
}
