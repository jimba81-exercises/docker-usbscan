import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsbDriveModule } from './modules/usb-drive/usb-drive.module';

@Module({
  imports: [UsbDriveModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
