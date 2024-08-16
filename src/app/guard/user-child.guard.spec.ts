import { TestBed } from '@angular/core/testing';
import { CanActivateChildFn } from '@angular/router';

import { userChildGuard } from './user-child.guard';

describe('userChildGuard', () => {
  const executeGuard: CanActivateChildFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => userChildGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
