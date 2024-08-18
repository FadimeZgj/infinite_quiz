import { TestBed, ComponentFixture, tick, fakeAsync } from '@angular/core/testing';
import { LogoutComponent } from './logout.component';
import { LoaderService } from '../../services/loaderService/loader.service';
import { SessionDestroyService } from '../../services/sessionDestroyService/session-destroy.service';
import { provideRouter, Router } from '@angular/router';
import { Location } from '@angular/common';
import * as CryptoJS from 'crypto-js';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('LogoutComponent', () => {
  let component: LogoutComponent;
  let fixture: ComponentFixture<LogoutComponent>;
  let loaderServiceSpy: jasmine.SpyObj<LoaderService>;
  let sessionDestroyServiceSpy: jasmine.SpyObj<SessionDestroyService>;
  // router permet de réalisé la navigation
  let router: Router;
  // location permet d'obtenir le chemin actuel dans le navigateur
  let location: Location;

  beforeEach(async () => {
    loaderServiceSpy = jasmine.createSpyObj('LoaderService', ['show', 'hide']);
    sessionDestroyServiceSpy = jasmine.createSpyObj('SessionDestroyService', ['sessionDestroy']);

    await TestBed.configureTestingModule({
      imports: [LogoutComponent],
      providers: [
        { provide: LoaderService, useValue: loaderServiceSpy },
        { provide: SessionDestroyService, useValue: sessionDestroyServiceSpy },
        provideRouter([
          { path: 'login', component: LogoutComponent } // Route simulée pour les tests
        ]),
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignore les erreurs de composants annexes
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait initialiser les informations utilisateur dans ngOnInit', () => {
    const userInfos = {
      id: '1',
      email: 'john@doe.fr',
      firstname: 'John',
      badge: 'the king'
    };
 
    component.jwt = 'fake.jwt.token';
    const secretKey = CryptoJS.SHA256(component.jwt).toString();
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(userInfos), secretKey).toString();
    spyOn(sessionStorage, 'getItem').and.returnValue(encryptedData);

    component.ngOnInit(); 

    expect(component.userId).toBe(userInfos.id);
    expect(component.user_email).toBe(userInfos.email);
    expect(component.user_name).toBe(userInfos.firstname);
    expect(component.user_badge).toBe(userInfos.badge);
    expect(loaderServiceSpy.hide).toHaveBeenCalled();
  });

  it("devrait rediriger vers /login si le JWT est invalide ou absent", fakeAsync(() => {
    spyOn(sessionStorage, 'getItem').and.returnValue(null); // Absence de données utilisateur
    component.jwt = ''; 

    component.ngOnInit(); 
    tick(); //Simule le delais de traitement et ne peut être utilisé qu'avec fakAsync
    // ils assurent que les fonctions asynchrone tel ngOnInit ce termine complettement avant de passé à la suite du test

    expect(loaderServiceSpy.hide).toHaveBeenCalled();
    expect(sessionDestroyServiceSpy.sessionDestroy).toHaveBeenCalled();

    // Vérifie que la redirection vers /login a eu lieu
    // Le .then permet d'attendre que la redirection se fasse avant de vérifié l'url
    router.navigateByUrl('/login').then(() => {
      expect(location.path()).toBe('/login');
    });
  }));

  it('devrait rediriger vers /login lors de l\'appel de onSubmit', fakeAsync(() => {
    component.onSubmit(); 
    tick();//Simule le delais de traitement et ne peut être utilisé qu'avec fakAsync
    // ils assurent que les fonctions asynchrone tel ngOnInit ce termine complettement avant de passé à la suite du test
    
    expect(sessionDestroyServiceSpy.sessionDestroy).toHaveBeenCalled();
    
    // Vérifie la redirection après l'appel de onSubmit()
     // Le .then permet d'attendre que la redirection se fasse avant de vérifié l'url
    router.navigateByUrl('/login').then(() => {
      expect(location.path()).toBe('/login');
    });
  }));
});
