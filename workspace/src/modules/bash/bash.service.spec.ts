import { Test, TestingModule } from '@nestjs/testing';
import { BashService } from './bash.service';

describe('BashService', () => {
  let service: BashService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BashService],
    }).compile();

    service = module.get<BashService>(BashService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
