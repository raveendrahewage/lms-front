import { TestBed } from '@angular/core/testing';

import { FunctionAppService } from './function-app.service';

describe('FunctionAppService', () => {
  let service: FunctionAppService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FunctionAppService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
