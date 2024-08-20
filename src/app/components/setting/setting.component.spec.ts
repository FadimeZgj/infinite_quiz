import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingComponent } from './setting.component';
import { LoaderService } from '../../services/loaderService/loader.service';
import { JwtService } from '../../services/jwtServices/jwt.service';
import { Meta, Title } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';

describe('SettingComponent', () => {
  let component: SettingComponent;
  let fixture: ComponentFixture<SettingComponent>;
  let httpClientTesting: HttpTestingController;
  let router: Router;
  let loaderService: jasmine.SpyObj<LoaderService>;
  let jwtService: jasmine.SpyObj<JwtService>;
  let metaService: jasmine.SpyObj<Meta>;
  let titleService: jasmine.SpyObj<Title>;

  beforeEach(async () => {
    // Création des mocks pour les services
    const loaderServiceSpy = jasmine.createSpyObj('LoaderService', ['show', 'hide']);
    const jwtServiceSpy = jasmine.createSpyObj('JwtService', ['decode']);
    const metaServiceSpy = jasmine.createSpyObj('Meta', ['addTags']);
    const titleServiceSpy = jasmine.createSpyObj('Title', ['setTitle']);

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
    loaderService = TestBed.inject(LoaderService) as jasmine.SpyObj<LoaderService>;
    jwtService = TestBed.inject(JwtService) as jasmine.SpyObj<JwtService>;
    metaService = TestBed.inject(Meta) as jasmine.SpyObj<Meta>;
    titleService = TestBed.inject(Title) as jasmine.SpyObj<Title>;

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
    expect(titleService.setTitle).toHaveBeenCalledWith('Paramètres de compte - Infinite Quiz');
    expect(metaService.addTags).toHaveBeenCalledWith([
      { name: 'description', content: 'Gérez vos paramètres de compte et supprimez votre compte si nécessaire. Assurez-vous de sauvegarder vos données avant la suppression.' },
      { name: 'robots', content: 'noindex, nofollow' }
    ]);
  });

  it("devrait supprimer le compte et rediriger vers la page /signup", () => {
    const fakeJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlcm5hbWUiOiJqb2huQGRvZS5mciIsImlhdCI6MTUxNjIzOTAyMn0.H1XaOJUbTFapNjsS0vSPxREkM6KmnaRxoQSnipCq-BU';
    const decodedToken = { username: 'john@doe.fr' };

    spyOn(localStorage, 'getItem').and.returnValue(fakeJwt);
    spyOn(localStorage, 'removeItem');
    jwtService.decode.and.returnValue(decodedToken);

    component.onDelete();

    const reqGetUser = httpClientTesting.expectOne(`http://127.0.0.1:8000/api/users?email=${decodedToken.username}`);
    expect(reqGetUser.request.method).toBe('GET');
    reqGetUser.flush({ 'hydra:member': [{ id: 123 }] });

    const reqPatchUser = httpClientTesting.expectOne(`http://127.0.0.1:8000/api/users/123`);
    expect(reqPatchUser.request.method).toBe('PATCH');
    reqPatchUser.flush({});

    expect(localStorage.removeItem).toHaveBeenCalledWith('jwt');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/signup');
    expect(loaderService.hide).toHaveBeenCalled();
  });

  it("devrait afficher un message d'erreur si un problème survient lors de la suppression du compte", () => {
    const fakeJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlcm5hbWUiOiJqb2huQGRvZS5mciIsImlhdCI6MTUxNjIzOTAyMn0.H1XaOJUbTFapNjsS0vSPxREkM6KmnaRxoQSnipCq-BU';
    const decodedToken = { username: 'john@doe.fr' };

    spyOn(localStorage, 'getItem').and.returnValue(fakeJwt);
    jwtService.decode.and.returnValue(decodedToken);

    component.onDelete();

    const reqGetUser = httpClientTesting.expectOne(`http://127.0.0.1:8000/api/users?email=${decodedToken.username}`);
    expect(reqGetUser.request.method).toBe('GET');
    reqGetUser.flush({}, { status: 500, statusText: 'Server Error' });

    expect(component.message).toBe("Une erreur s'est produite. Veuillez réessayer plus tard.");
    expect(component.style_class).toBe("p-3 text-warning-emphasis bg-warning border border-warning-subtle rounded-3");
    expect(loaderService.hide).toHaveBeenCalled();
  });

  it("devrait afficher un message d'erreur si un problème arrive avec la requête patch", () => {
    const fakeJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlcm5hbWUiOiJqb2huQGRvZS5mciIsImlhdCI6MTUxNjIzOTAyMn0.H1XaOJUbTFapNjsS0vSPxREkM6KmnaRxoQSnipCq-BU';
    const decodedToken = { username: 'john@doe.fr' };

    spyOn(localStorage, 'getItem').and.returnValue(fakeJwt);
    jwtService.decode.and.returnValue(decodedToken);

    component.onDelete();

    const reqGetUser = httpClientTesting.expectOne(`http://127.0.0.1:8000/api/users?email=${decodedToken.username}`);
    expect(reqGetUser.request.method).toBe('GET');
    reqGetUser.flush({ 'hydra:member': [{ id: 123 }] });

    const reqPatchUser = httpClientTesting.expectOne(`http://127.0.0.1:8000/api/users/123`);
    expect(reqPatchUser.request.method).toBe('PATCH');
    reqPatchUser.flush({}, { status: 500, statusText: 'Server Error' });

    expect(component.message).toBe("Une erreur s'est produite. Veuillez réessayer plus tard.");
    expect(component.style_class).toBe("p-3 text-warning-emphasis bg-warning border border-warning-subtle rounded-3");
    expect(loaderService.hide).toHaveBeenCalled();
  });
});
