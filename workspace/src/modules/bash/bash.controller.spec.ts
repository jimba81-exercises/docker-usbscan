import { Test, TestingModule } from '@nestjs/testing';
import { BashController } from './bash.controller';

describe('BashController', () => {
  let controller: BashController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BashController],
    }).compile();

    controller = module.get<BashController>(BashController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
