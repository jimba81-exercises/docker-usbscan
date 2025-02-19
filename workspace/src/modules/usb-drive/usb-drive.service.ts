import { Injectable } from '@nestjs/common';

@Injectable()
export class UsbDriveService {
  constructor() {

    // Run background process with interval 5 sec
    setInterval(() => {
      this.scanUsbDrives();
    }, 1000);
    this.scanUsbDrives();
    
    console.log('UsbDriveService created');
  }

  private scanUsbDrives(): void {
    console.log('Scanning usb drives');
  }
}
