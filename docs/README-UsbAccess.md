# USB Access Options

[Top](./README.md)

<br>

# Table of Contents
1. [Workspace Setup](#WorkspaceSetup)

<br>

# 1. Docker Setup <a name="WorkspaceSetup"></a>
>**Reference:** 

<br>

# 2. CGroup Setup
- References:
  - https://askubuntu.com/questions/1403705/dev-ttyusb0-not-present-in-ubuntu-22-04
  - https://stackoverflow.com/questions/24225647/docker-a-way-to-give-access-to-a-host-usb-or-serial-device

## 2.1. Get ttyUSB Group ID
1. Ensure Braille display is removed
    ```console
    $ sudo apt remove brltty
    ```
1. Get Group ID
    ```console
    $ ls -l /dev/ |grep ttyUSB
    ```
    - If nothing is shown, run `sudo apt remove brltty`



<br>