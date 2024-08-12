import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { CleanDataService } from '../services/cleanDataService/clean-data.service';
import { LoaderService } from '../services/loaderService/loader.service';
import { ActivatedRoute, Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpClientTesting: HttpTestingController;
  let cleanDataServiceSpy: jasmine.SpyObj<CleanDataService>;
  let loaderServiceSpy: jasmine.SpyObj<LoaderService>;
  let router: Router;

  beforeEach(async () => {
    // je créé des objet pour surveiller mes services
    const cleanDataServiceSpyObj = jasmine.createSpyObj('CleanDataService', ['cleanObject']);
    const loaderServiceSpyObj = jasmine.createSpyObj('LoaderService', ['show', 'hide']);


    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        LoginComponent,
      ],
      providers: [
        { provide: CleanDataService, useValue: cleanDataServiceSpyObj },
        { provide: LoaderService, useValue: loaderServiceSpyObj },
        { provide: ActivatedRoute, useValue: { snapshot: {} } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    httpClientTesting = TestBed.inject(HttpTestingController);
    cleanDataServiceSpy = TestBed.inject(CleanDataService) as jasmine.SpyObj<CleanDataService>;
    loaderServiceSpy = TestBed.inject(LoaderService) as jasmine.SpyObj<LoaderService>;
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

 
  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it("devrait appeler show sur loaderService lors de l'envoi du formulaire", () => {
    cleanDataServiceSpy.cleanObject.and.returnValue({ username: 'john@doe.fr', password: 'password', honneypot: '' });

    component.onSubmit();

    expect(loaderServiceSpy.show).toHaveBeenCalled();
  });

  it('ne devrait pas soumettre le formulaire si le champ "honneypot" est rempli', () => {
    cleanDataServiceSpy.cleanObject.and.returnValue({ username: 'john@doe.fr', password: 'password', honneypot: 'bot' });
  
    const navigateSpy = spyOn(component.router, 'navigateByUrl');

    component.onSubmit();

    expect(navigateSpy).toHaveBeenCalledWith('/login');

    httpClientTesting.expectNone('http://127.0.0.1:8000/api/login_check');
  });

  it('devrait envoyer une requête POST de connexion et gérer correctement la réponse', () => {
    const navigateSpy = spyOn(router, 'navigateByUrl');
    const cleanedData = { username: 'john@doe.fr', password: 'password', honneypot: '' };
    cleanDataServiceSpy.cleanObject.and.returnValue(cleanedData);

    component.loginForm.controls['username'].setValue('john@doe.fr');
    component.loginForm.controls['password'].setValue('password');

    component.onSubmit();

    expect(loaderServiceSpy.show).toHaveBeenCalled();

    const req = httpClientTesting.expectOne('http://127.0.0.1:8000/api/login_check');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(JSON.stringify(cleanedData));

    const mockResponse = { token: 'fake-jwt' };
    req.flush(mockResponse);

    expect(localStorage.getItem('jwt')).toBe('fake-jwt');

    const userInfoRequest = httpClientTesting.expectOne('http://127.0.0.1:8000/api/users?email=john@doe.fr');
    expect(userInfoRequest.request.method).toBe('GET');
    expect(userInfoRequest.request.headers.get('Authorization')).toBe('Bearer fake-jwt');

    const mockUserInfoResponse = { 'hydra:member': [{ id: 1, name: 'John', email: 'john@doe.fr' }] };
    userInfoRequest.flush(mockUserInfoResponse);

    const storedUserInfo = sessionStorage.getItem('userInfo');
    expect(storedUserInfo).toBeTruthy();

    expect(loaderServiceSpy.hide).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith('/dashboard');
  });


});
