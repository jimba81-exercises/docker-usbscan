import { Controller, Get, HttpStatus, Param, Query, Req } from '@nestjs/common';
import { UsbDriveService } from './usb-drive.service';
import { ApiOkResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetPath_ReqDto, GetPath_ResDto, GetUsbDrives_ReqDto, GetUsbDrives_ResDto } from './usb-drive.dto';

@Controller('usb-drive')
export class UsbDriveController {
  constructor(private readonly usbDriveService: UsbDriveService) {
    console.log('UsbDriveController created');
  }

  // Add a new route
  @Get()
  @ApiOperation({ summary: 'Get all drives' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Get all drives', type: GetUsbDrives_ResDto })
  findAllDrives(@Query() query:  GetUsbDrives_ReqDto) {
    let autoMount = true;

    if (query.autoMount !== undefined) {
      autoMount = query.autoMount;
    }

    if (autoMount) {
      this.usbDriveService.autoMount();
    }

    const driveInfo = this.usbDriveService.getUsbDriveInfo();
    const response: GetUsbDrives_ResDto = {
      driveInfo: driveInfo
    }
    return response;
  }

  // Get route with providing usb drive_id
  @Get('path')
  @ApiOperation({ summary: 'Get files in path' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Get files in path', type: GetPath_ResDto })
  readDir(@Query() query:  GetPath_ReqDto) {
    const files = this.usbDriveService.readDir(query.path);
    return {
      files
    }
  }

} 
