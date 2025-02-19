import { Injectable } from '@nestjs/common';
import * as usb from 'usb';
import * as fs from 'fs';
//const fs = require('fs');
@Injectable()
export class UsbDriveService {
  constructor() {

    // Run background process with interval 5 sec
    /*setInterval(() => {
      this.scanUsbDrives();
    }, 1000);
    this.scanUsbDrives();*/

    this.scanUsbDevices();

    this.scanUsbDrives();
    
    

    console.log('UsbDriveService created');
  }

  scanUsbDevices(): string {
    let output = '';
    console.log('Scanning usb devices');
    usb.getDeviceList().forEach(device => {
      //console.log(`device: ${JSON.stringify(device)}`);
      output += `Device: VID=${device.deviceDescriptor.idVendor.toString(16)}, PID=${device.deviceDescriptor.idProduct.toString(16)}\n`;
    });
    console.log(output);
    return output;
  }

  scanUsbDrives(): string[] {
    let usbDrivePaths: string[] = [];

    try {
      const rootPath = process.env.USB_MOUNT_DIR || '/media';
      // Get media folders 
      const mediaFiles = fs.readdirSync(rootPath);
      // Filter mediaFolders with folder type
      const mediaFolders = mediaFiles.filter(folder => fs.lstatSync(`${rootPath}/${folder}`).isDirectory());

      console.log(`mediaFolders=${mediaFolders}`);

      // For each mediaFolders, readdir with the path
      mediaFolders.forEach(mediaFolder => {
        const files = fs.readdirSync(`${rootPath}/${mediaFolder}`);

        const folders = files.filter(folder => fs.lstatSync(`${rootPath}/${mediaFolder}`).isDirectory());
        console.log(`Reading ${rootPath}/${mediaFolder}: folders=${folders}`);
        folders.forEach(folder => {
          const path = `${rootPath}/${mediaFolder}/${folder}`;
          usbDrivePaths.push(path);
        });
      });
    } catch (e) {
      console.error(`scanUsbDrives(): Error:${e}`);
    }

    console.log(`scanUsbDrives(): files=${usbDrivePaths}`);
    return usbDrivePaths;
  }

  readDir(path: string): string[] {
    let files: string[] = [];
    console.log(`path=${path}`);
    try {
      const filesBuf = fs.readdirSync(path);
      filesBuf.forEach(file => {
        files.push(file);
      });

    } catch (e) {
      console.error(`readDir(): Error:${e}`);
    }

    console.log(`readDir(): files=${files}`);
    return files;
  }

}
