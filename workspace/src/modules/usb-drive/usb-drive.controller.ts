import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { UsbDriveService } from './usb-drive.service';

@Controller('usb-drive')
export class UsbDriveController {
  constructor(private readonly usbDriveService: UsbDriveService) {
    console.log('UsbDriveController created');
  }

  // Add a new route
  @Get()
  findAllDrives(): string[] {
    return this.usbDriveService.scanUsbDrives();
  }

  // Get route with providing usb drive_id
  @Get('path')
  readDir(@Query('path') path: string): string[] {
    console.log(`readDir: path=${path}`);
    return this.usbDriveService.readDir(path);
  }

} 
