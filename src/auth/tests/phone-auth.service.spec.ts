import { Test, TestingModule } from '@nestjs/testing';
import { PhoneAuthService } from '../services/phone-auth.service';

describe('PhoneAuthService', () => {
  let service: PhoneAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PhoneAuthService],
    }).compile();

    service = module.get<PhoneAuthService>(PhoneAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
