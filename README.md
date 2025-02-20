# docker-usbscan
NestJS Server running in the docker container scans USB Drive

## [Project Setup](./docs/README-ProjectSetup.md)
## [Workspace Setup](./docs/README-Workspace.md)

<br>

## TODOs:
- Docker container should run without `privilege=true`
- Support TYPE="iso9660", e.g. UbuntuInstaller. Curently, it needs to be unmounted from localhost before scan from docker.
- Route 'usb-drive' displays more information about the mountPoints; e.g. Type(e.g. iso9660, ext4, vfat), MountFailedErr, PARTUUID

<br>
