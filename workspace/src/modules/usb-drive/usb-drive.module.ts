import { Module } from '@nestjs/common';
import { UsbDriveService } from './usb-drive.service';
import { UsbDriveController } from './usb-drive.controller';

@Module({
  providers: [UsbDriveService],
  controllers: [UsbDriveController]
})
export class UsbDriveModule {}
