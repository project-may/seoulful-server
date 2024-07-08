import { Module } from '@nestjs/common'
import { WildcardController } from '@/common/wildcard/wildcard.controller'

@Module({
  controllers: [WildcardController]
})
export class WildcardModule {}
