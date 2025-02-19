interface UsbDriveMountPoint {
  drivePath: string;  // e.g. sda1
  mountPath: string;  // /media/user/myusbstick123
}

interface UsbDriveInfo {
  disk: string;  // e.g. sda
  mountPoints: UsbDriveMountPoint[]
}