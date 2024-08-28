import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';

export const userChildGuard: CanActivateChildFn = (childRoute, state) => {
  const router = inject(Router);
  const jwt = localStorage.getItem('jwt')
  if (jwt && jwt.split('.').length === 3) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
