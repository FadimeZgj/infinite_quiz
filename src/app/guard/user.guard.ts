import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const userGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const jwt = localStorage.getItem('jwt')
  if (jwt && jwt.split('.').length === 3) {
    return true;
  }

  return router.createUrlTree(['/login']);
};