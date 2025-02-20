import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString } from "class-validator";

export class GetUsbDrives_ReqDto {
  @ApiProperty({ required: false, type: Boolean })
  @IsBoolean()
  @IsOptional()
  autoMount?: boolean;
}

export class GetUsbDrives_ResDto {
  @ApiProperty()
  driveInfo: UsbDriveInfo[]
}


export class GetPath_ReqDto {
  @ApiProperty()
  @IsString()
  path: string;
}

export class GetPath_ResDto {
  @ApiProperty()
  files: string[]
}