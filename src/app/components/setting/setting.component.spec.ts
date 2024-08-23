import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingComponent } from './setting.component';
import { LoaderService } from '../../services/loaderService/loader.service';
import { JwtService } from '../../services/jwtServices/jwt.service';
import { Meta, Title } from '@angular/platform-browser';

describe('SettingComponent', () => {
  let component: SettingComponent;
  let fixture: ComponentFixture<SettingComponent>;
  let httpClientTesting: HttpTestingController;
  let router: Router;
  let loaderServiceSpy: jasmine.SpyObj<LoaderService>;
  let jwtServiceSpy: jasmine.SpyObj<JwtService>;
  let metaServiceSpy: jasmine.SpyObj<Meta>;
  let titleServiceSpy: jasmine.SpyObj<Title>;

  beforeEach(async () => {
    // Création des mocks pour les services
    loaderServiceSpy = jasmine.createSpyObj('LoaderService', ['show', 'hide']);
    jwtServiceSpy = jasmine.createSpyObj('JwtService', ['decode']);
    metaServiceSpy = jasmine.createSpyObj('Meta', ['addTags']);
    titleServiceSpy = jasmine.createSpyObj('Title', ['setTitle']);

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        SettingComponent,
      ],
      providers: [
        { provide: LoaderService, useValue: loaderServiceSpy },
        { provide: JwtService, useValue: jwtServiceSpy },
        { provide: Meta, useValue: metaServiceSpy },
        { provide: Title, useValue: titleServiceSpy },
        { provide: ActivatedRoute, useValue: { snapshot: {} } } 
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SettingComponent);
    component = fixture.componentInstance;
    httpClientTesting = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);

    spyOn(router, 'navigateByUrl');
    fixture.detectChanges();
  });

  afterEach(() => {
    httpClientTesting.verify();
  });

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it('devrait initialiser les metadatas', () => {
    expect(titleServiceSpy.setTitle).toHaveBeenCalledWith('Paramètres de compte - Infinite Quiz');
    expect(metaServiceSpy.addTags).toHaveBeenCalledWith([
      { name: 'description', content: 'Gérez vos paramètres de compte et supprimez votre compte si nécessaire. Assurez-vous de sauvegarder vos données avant la suppression.' },
      { name: 'robots', content: 'noindex, nofollow' }
    ]);
  });

  it("devrait supprimer le compte et rediriger vers la page /signup", () => {
    const fakeJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlcm5hbWUiOiJqb2huQGRvZS5mciIsImlhdCI6MTUxNjIzOTAyMn0.H1XaOJUbTFapNjsS0vSPxREkM6KmnaRxoQSnipCq-BU';
    const decodedToken = { username: 'john@doe.fr' };

    spyOn(localStorage, 'getItem').and.returnValue(fakeJwt);
    spyOn(localStorage, 'removeItem');
    jwtServiceSpy.decode.and.returnValue(decodedToken);

    component.onDelete();

    const reqGetUser = httpClientTesting.expectOne(`http://127.0.0.1:8000/api/users?email=${decodedToken.username}`);
    expect(reqGetUser.request.method).toBe('GET');
    reqGetUser.flush({ 'hydra:member': [{ id: 123 }] });

    const reqPatchUser = httpClientTesting.expectOne(`http://127.0.0.1:8000/api/users/123`);
    expect(reqPatchUser.request.method).toBe('PATCH');
    reqPatchUser.flush({});

    expect(localStorage.removeItem).toHaveBeenCalledWith('jwt');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/signup');
    expect(loaderServiceSpy.hide).toHaveBeenCalled();
  });

  it("devrait afficher un message d'erreur si un problème survient lors de la suppression du compte", () => {
    const fakeJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlcm5hbWUiOiJqb2huQGRvZS5mciIsImlhdCI6MTUxNjIzOTAyMn0.H1XaOJUbTFapNjsS0vSPxREkM6KmnaRxoQSnipCq-BU';
    const decodedToken = { username: 'john@doe.fr' };

    spyOn(localStorage, 'getItem').and.returnValue(fakeJwt);
    jwtServiceSpy.decode.and.returnValue(decodedToken);

    component.onDelete();

    const reqGetUser = httpClientTesting.expectOne(`http://127.0.0.1:8000/api/users?email=${decodedToken.username}`);
    expect(reqGetUser.request.method).toBe('GET');
    reqGetUser.flush({}, { status: 500, statusText: 'Server Error' });

    expect(component.message).toBe("Une erreur s'est produite. Veuillez réessayer plus tard.");
    expect(component.style_class).toBe("p-3 text-warning-emphasis bg-warning border border-warning-subtle rounded-3");
    expect(loaderServiceSpy.hide).toHaveBeenCalled();
  });

  it("devrait afficher un message d'erreur si un problème arrive avec la requête patch", () => {
    const fakeJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlcm5hbWUiOiJqb2huQGRvZS5mciIsImlhdCI6MTUxNjIzOTAyMn0.H1XaOJUbTFapNjsS0vSPxREkM6KmnaRxoQSnipCq-BU';
    const decodedToken = { username: 'john@doe.fr' };

    spyOn(localStorage, 'getItem').and.returnValue(fakeJwt);
    jwtServiceSpy.decode.and.returnValue(decodedToken);

    component.onDelete();

    const reqGetUser = httpClientTesting.expectOne(`http://127.0.0.1:8000/api/users?email=${decodedToken.username}`);
    expect(reqGetUser.request.method).toBe('GET');
    reqGetUser.flush({ 'hydra:member': [{ id: 123 }] });

    const reqPatchUser = httpClientTesting.expectOne(`http://127.0.0.1:8000/api/users/123`);
    expect(reqPatchUser.request.method).toBe('PATCH');
    reqPatchUser.flush({}, { status: 500, statusText: 'Server Error' });

    expect(component.message).toBe("Une erreur s'est produite. Veuillez réessayer plus tard.");
    expect(component.style_class).toBe("p-3 text-warning-emphasis bg-warning border border-warning-subtle rounded-3");
    expect(loaderServiceSpy.hide).toHaveBeenCalled();
  });
});
