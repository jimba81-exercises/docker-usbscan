import { Test, TestingModule } from '@nestjs/testing';
import { UsbDriveService } from './usb-drive.service';

describe('UsbDriveService', () => {
  let service: UsbDriveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsbDriveService],
    }).compile();

    service = module.get<UsbDriveService>(UsbDriveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
