import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';

export const userChildGuard: CanActivateChildFn = (childRoute, state) => {
  const router = inject(Router);

  if (localStorage.getItem('jwt')) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
