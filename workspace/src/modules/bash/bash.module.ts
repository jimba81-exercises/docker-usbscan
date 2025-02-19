import { Module } from '@nestjs/common';
import { BashService } from './bash.service';
import { BashController } from './bash.controller';

@Module({
  providers: [BashService],
  controllers: [BashController],
  exports: [BashService]
})
export class BashModule {}
