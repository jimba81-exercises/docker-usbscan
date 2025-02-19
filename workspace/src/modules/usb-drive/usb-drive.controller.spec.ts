import { Test, TestingModule } from '@nestjs/testing';
import { UsbDriveController } from './usb-drive.controller';

describe('UsbDriveController', () => {
  let controller: UsbDriveController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsbDriveController],
    }).compile();

    controller = module.get<UsbDriveController>(UsbDriveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
