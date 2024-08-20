import { TestBed } from '@angular/core/testing';
import { CanActivateChildFn, Router } from '@angular/router';

import { userChildGuard } from './user-child.guard';

describe('userChildGuard', () => {
  const executeGuard: CanActivateChildFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => userChildGuard(...guardParameters));

  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    router = TestBed.inject(Router); // Injection du service Router
    spyOn(router, 'createUrlTree').and.returnValue({} as any); // Espionne la méthode createUrlTree du router
  });

  it('devrait être créé', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('devrait retourner true si le JWT est présent', () => {
    spyOn(localStorage, 'getItem').and.returnValue('fake-jwt'); // Simule la présence du JWT dans le localStorage

    const result = executeGuard(null as any, null as any); // Appelle le guard

    expect(result).toBeTrue(); // Vérifie que le guard retourne true
  });

  it('devrait rediriger vers /login si le JWT est absent', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null); // Simule l'absence du JWT dans le localStorage

    const result = executeGuard(null as any, null as any); // Appelle le guard

    expect(router.createUrlTree).toHaveBeenCalledWith(['/login']); // Vérifie que createUrlTree a été appelée avec '/login'
    expect(result).toEqual(router.createUrlTree(['/login'])); // Vérifie que le guard retourne l'UrlTree de redirection
  });
});
