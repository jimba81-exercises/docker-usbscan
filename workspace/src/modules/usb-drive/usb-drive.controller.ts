import { Controller, Get } from '@nestjs/common';

@Controller('usb-drive')
export class UsbDriveController {
  constructor() {
    console.log('UsbDriveController created');
  }

  // Add a new route
  @Get()
  findAll(): string {
    return 'This action returns all usb drives';
  }
} 
