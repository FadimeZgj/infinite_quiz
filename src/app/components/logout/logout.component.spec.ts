import { TestBed, ComponentFixture, tick, fakeAsync } from '@angular/core/testing';
import { LogoutComponent } from './logout.component';
import { LoaderService } from '../../services/loaderService/loader.service';
import { provideRouter, Router } from '@angular/router';
import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { JwtService } from '../../services/jwtServices/jwt.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('LogoutComponent', () => {
  let component: LogoutComponent;
  let fixture: ComponentFixture<LogoutComponent>;
  let loaderServiceSpy: jasmine.SpyObj<LoaderService>;
  let jwtServiceSpy: jasmine.SpyObj<JwtService>;
  let router: Router;

  beforeEach(async () => {
    loaderServiceSpy = jasmine.createSpyObj('LoaderService', ['show', 'hide']);
    jwtServiceSpy = jasmine.createSpyObj('JwtService', ['decode']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, LogoutComponent],
      providers: [
        { provide: LoaderService, useValue: loaderServiceSpy },
        { provide: JwtService, useValue: jwtServiceSpy },
        provideRouter([
          { path: 'login', component: LogoutComponent }
        ]),
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait initialiser les informations utilisateur dans ngOnInit', fakeAsync(() => {
    const userInfos = {
      id: '1',
      email: 'john@doe.fr',
      firstname: 'John',
      badge: 'the king'
    };
    
    const jwtToken = 'valid.jwt.token';
    component.jwt = jwtToken;
    jwtServiceSpy.decode.and.returnValue({ username: userInfos.email });

    spyOn(component.http, 'get').and.returnValue(of({
      'hydra:member': [userInfos]
    }));

    component.ngOnInit();
    tick(); //Simule le delais de traitement et ne peut être utilisé qu'avec fakAsync
    // ils assurent que les fonctions asynchrone tel ngOnInit ce termine complettement avant de passé à la suite du test

    expect(component.user_name).toBe(userInfos.firstname);
    expect(component.user_email).toBe(userInfos.email);
    expect(component.user_badge).toBe(userInfos.badge);
    expect(loaderServiceSpy.hide).toHaveBeenCalled();
  }));

  it('devrait rediriger vers /login si le JWT est invalide ou absent', fakeAsync(() => {
    component.jwt = '';

    spyOn(router, 'navigateByUrl');

    component.ngOnInit();
    tick();

    expect(loaderServiceSpy.hide).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  }));

  it('devrait rediriger vers /login lors de l\'appel de onSubmit', fakeAsync(() => {
    spyOn(router, 'navigateByUrl');

    component.onSubmit();
    tick();

    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  }));

  it('devrait afficher une image par défaut lors d\'une erreur de chargement d\'avatar', () => {
    component.onError();
    expect(component.user_avatar).toBe("/assets/images/logo.png");
  });
});
