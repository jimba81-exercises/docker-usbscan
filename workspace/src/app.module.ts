import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsbDriveModule } from './modules/usb-drive/usb-drive.module';
import { BashModule } from './modules/bash/bash.module';

@Module({
  imports: [UsbDriveModule, BashModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
