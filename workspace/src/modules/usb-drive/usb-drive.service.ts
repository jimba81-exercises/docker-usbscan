import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { BashService } from 'src/modules/bash/bash.service';

@Injectable()
export class UsbDriveService {
  constructor(private readonly bashService: BashService) {
    console.log('UsbDriveService created');
  }

  /**
   * Autos mount usb drives
   */
  autoMount(): void {
    try {
      const mntRoot = process.env.TEMP_MOUNT_DIR_PATH || '/mnt';

      const unmountedDrivePaths = this.getUnmountedDrivePaths();
      unmountedDrivePaths.forEach(drivePath => {

        try {
          // Create mount path
          const mountPath = `${mntRoot}/${drivePath.replace('/dev/', '')}`;
          let command = `mkdir -p ${mountPath}`;
          this.bashService.executeCommandSync(command);

          command = `mount ${drivePath} ${mountPath}`;
          this.bashService.executeCommandSync(command);
          console.log(`autoMount(): Mounted ${drivePath} to ${mountPath}`);
        } catch (e) {
          console.error(`autoMount(): Error:${e}`);
        }
      });
    } catch (e) {
      console.error(`autoMount(): Error:${e}`);
    }
  }

  /**
   * Gets usb drive info
   * @returns usb drive info 
   */
  getUsbDriveInfo(): UsbDriveInfo[] {
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
          //console.warn(`getUsbDriveInfo(): curDriveInfo is null: line=${i}, total=${outputLines.length}`);
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
        "disk": "/dev/sda",
        "mountPoints": [
          {
            "drivePath": "/dev/sda1",
            "mountPath": "/media/user/myusbstick123"
          },
          {
            "drivePath": "/dev/sda2",
            "mountPath": ""     <<---- This is not mounted yet (probably mounted after container executed)
          }
        ]
      },
      {
        "disk": "/dev/sdb",
        "mountPoints": [
          {
            "drivePath": "/dev/sdb1",
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
        ret.disk = `/dev/${match[1]}`;
      } else if (type == 'part') {
        ret.mountPoints.push({ drivePath: `/dev/${match[1]}`, mountPath: match[3] });
      } else {
        console.warn(`parseLsblkOutput(): Unknown type=${type}`);
        return null;
      }
      return ret;
    }
    return null;
  }

  private getUnmountedDrivePaths(): string[] {
    const usbDriveInfo = this.getUsbDriveInfo();
    const unmountedDrivePaths: string[] = [];

    usbDriveInfo.forEach(driveInfo => {
      driveInfo.mountPoints.forEach(mountPoint => {
        if (mountPoint.mountPath == '') {
          unmountedDrivePaths.push(mountPoint.drivePath);
        }
      });
    });

    console.log(`getUnmountedDrivePaths(): unmountedDrivePaths=${unmountedDrivePaths}`);
    return unmountedDrivePaths;
  }
}
