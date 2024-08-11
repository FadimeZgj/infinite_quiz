import { TestBed } from '@angular/core/testing';

import { CleanDataService } from './clean-data.service';

describe('CleanDataService', () => {
  let service: CleanDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CleanDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
