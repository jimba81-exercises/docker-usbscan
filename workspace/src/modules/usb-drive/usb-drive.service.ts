import { Injectable } from '@nestjs/common';
import * as usb from 'usb';
import * as fs from 'fs';
import { BashService } from 'src/modules/bash/bash.service';
//const fs = require('fs');
@Injectable()
export class UsbDriveService {
  constructor(private readonly bashService: BashService) {

    // Run background process with interval 5 sec
    /*setInterval(() => {
      this.scanUsbDrives();
    }, 1000);
    this.scanUsbDrives();*/

    this.scanUsbDevices();
    this.scanUsbDrives();
    
    this.getUsbDriveInfo();

    this.getUsbMountRootDrivePath();
    

    console.log('UsbDriveService created');
  }

  scanUsbDevices(): string {
    let output = '';
    console.log('Scanning usb devices');
    usb.getDeviceList().forEach(device => {
      console.log(`device: ${JSON.stringify(device)}`);
      output += `Device: VID=${device.deviceDescriptor.idVendor.toString(16)}, PID=${device.deviceDescriptor.idProduct.toString(16)}\n`;
    });
    console.log(output);
    return output;
  }

  /**
   * Gets usb mount root drive path
   * @returns usb mount root drive path
   * @example '/dev/sda1'
   */
  private getUsbMountRootDrivePath(): string {
    let mountRootDrivePath = '';

    try {
      const rootPath = process.env.USB_MOUNT_ROOT_PATH || '/media';
      const command = `df -h ${rootPath} | tail -n 1 | awk '{print $1}'`;
      const outputLines = this.bashService.executeCommandSync(command).split('\n');
      
      if (outputLines.length < 1) {
        throw new Error(`Paths not found: command=${command}, output=${outputLines}`);
      }
      
      mountRootDrivePath = outputLines[0];

      if (!mountRootDrivePath.startsWith('/dev/')) {
        throw new Error(`Bad path found: command=${command}, output=${outputLines}`);
      }

      mountRootDrivePath = mountRootDrivePath.replace('/dev/', '');

    } catch (e) {
      console.error(`getUsbMountRootDrivePath(): Error:${e}`);
    }

    console.log(`getUsbMountRootDrivePath(): mountRootDrivePath=${mountRootDrivePath}`);

    return mountRootDrivePath;
  }

  /**
   * Gets usb drive info
   * 
   * @returns usb drive info 
   * @example [
      {
        "disk": "sda",
        "mountPoints": [
          {
            "drivePath": "sda1",
            "mountPath": "/media/user/myusbstick123"
          },
          {
            "drivePath": "sda2",
            "mountPath": ""     <<---- This is not mounted yet (probably mounted after container executed)
          }
        ]
      },
      {
        "disk": "sdb",
        "mountPoints": [
          {
            "drivePath": "sdb1",
            "mountPath": "/media/user/myusbstick456"
          }
        ]
      }
    ]
   */

  private parseLsblkOutput(line: string): UsbDriveInfo | null {
    const regex = /NAME="([^"]+)" TYPE="([^"]+)" MOUNTPOINT="([^"]*)"/;
    const match = line.match(regex);
    

    let ret: UsbDriveInfo = { disk: '', mountPoints: [] };
      null;

    if (match) {
      const type = match[2];
      if (type == 'disk') {
        ret.disk = match[1];
      } else if (type == 'part') {
        ret.mountPoints.push({ drivePath: match[1], mountPath: match[3] });
      } else {
        console.warn(`parseLsblkOutput(): Unknown type=${type}`);
        return null;
      }
      return ret;
    }
    return null;
  }

  private getUsbDriveInfo(): UsbDriveInfo[] {
    let usbDriveInfos: UsbDriveInfo[] = [];

    try {
      // Get block devices for All TYPE='part'
      const commands = "lsblk -o NAME,TYPE,MOUNTPOINT -P | egrep 'TYPE=\"disk\"|TYPE=\"part\"'";
      const outputLines = this.bashService.executeCommandSync(commands).split('\n');

      let driveInfoBuf: UsbDriveInfo = { disk: '', mountPoints: [] };

      for (let i = 0; i < outputLines.length; i++) {
        let line = outputLines[i];

        const curDriveInfo = this.parseLsblkOutput(line);
        if (curDriveInfo == null) {
          console.warn(`getUsbDriveInfo(): curDriveInfo is null: line=${line}`);
          break;
        }

        if (curDriveInfo.disk != '') {
          // Disk type
          if (driveInfoBuf.disk != '') {
            // Add last driveInfoBuf to usbDriveInfos
            usbDriveInfos.push(driveInfoBuf);
          }

          // Prepare for new driveInfo
          driveInfoBuf = { disk: curDriveInfo.disk, mountPoints: [] };
        }
        else {
          // Part type
          driveInfoBuf.mountPoints.push(curDriveInfo.mountPoints[0]);
        }
      }
      // Add last one
      usbDriveInfos.push(driveInfoBuf);

      // From usbDriveInfos, remove root drive path
      const mountRootDrivePath = this.getUsbMountRootDrivePath();
      usbDriveInfos = usbDriveInfos.filter(driveInfo => {

        const rootDriveMountPoints = driveInfo.mountPoints.find(mountPoint => {
          //console.log(`mountPoint.drivePath=${mountPoint.drivePath}, mountRootDrivePath=${mountRootDrivePath}`);
          if (mountPoint.drivePath == mountRootDrivePath) {
            return true;
          }
        }); 
        
        // console.log(`rootDriveMountPoints=${JSON.stringify(rootDriveMountPoints, null, 2)}`);

        // Exclude root drive mount points
        return (rootDriveMountPoints == undefined);
      });

    } catch (e) {
      console.error(`getUsbDrivePaths(): Error:${e}`);
    }

    console.log(`getUsbDrivePaths(): pathInfo=${JSON.stringify(usbDriveInfos, null, 2)}`);

    return usbDriveInfos;
  }

  /**
   * Scans usb drives
   * NOTE: The usb drives 
   * 
   * @returns usb drives
   * @example ['/media/user/myusbstick123', '/media/user/myusbstick456']
   */
  scanUsbDrives(): string[] {
    let usbDrivePaths: string[] = [];

    try {
      const rootPath = process.env.USB_MOUNT_ROOT_PATH || '/media';
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

  /**
   * Reads directory
   * 
   * @param path 
   * @returns directories or files 
   */
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
