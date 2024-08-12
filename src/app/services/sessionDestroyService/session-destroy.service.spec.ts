import { TestBed } from '@angular/core/testing';

import { SessionDestroyService } from './session-destroy.service';

describe('SessionDestroyService', () => {
  let service: SessionDestroyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionDestroyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
