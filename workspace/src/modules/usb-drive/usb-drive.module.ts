import { Module } from '@nestjs/common';
import { UsbDriveService } from './usb-drive.service';
import { UsbDriveController } from './usb-drive.controller';
import { BashService } from '../bash/bash.service';
import { BashModule } from '../bash/bash.module';

@Module({
  providers: [UsbDriveService],
  controllers: [UsbDriveController],
  imports: [
    BashModule
  ]
})
export class UsbDriveModule {}
