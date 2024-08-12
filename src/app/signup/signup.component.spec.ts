import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from './signup.component';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../services/loaderService/loader.service';
import { CleanDataService } from '../services/cleanDataService/clean-data.service';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let httpClientTesting: HttpTestingController;
  let router: Router;
  let loaderServiceSpy: jasmine.SpyObj<LoaderService>;
  let cleanDataServiceSpy: jasmine.SpyObj<CleanDataService>;

  beforeEach(async () => {

    // je créé des objet pour surveiller mes services
    cleanDataServiceSpy = jasmine.createSpyObj('CleanDataService', ['cleanObject']);
    loaderServiceSpy = jasmine.createSpyObj('LoaderService', ['show', 'hide']);

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        SignupComponent
      ],
      providers: [
        { provide: CleanDataService, useValue: cleanDataServiceSpy },
        { provide: LoaderService, useValue: loaderServiceSpy },
        { provide: ActivatedRoute, useValue: { snapshot: {} } } 
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    httpClientTesting = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    cleanDataServiceSpy = TestBed.inject(CleanDataService) as jasmine.SpyObj<CleanDataService>;
    loaderServiceSpy = TestBed.inject(LoaderService) as jasmine.SpyObj<LoaderService>;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpClientTesting.verify();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait ne pas soumettre le formulaire si les mots de passe ne match pas', () => {
    const formvalue = {
      firstname: 'John',
      email: 'john@doe.fr',
      plainPassword: 'Password123!',
      cpw: 'Password124!', 
      honneypot: ''
    }

    cleanDataServiceSpy.cleanObject.and.returnValue(formvalue);

    component.signUpForm.setValue(formvalue);

    component.onSubmit();

    expect(loaderServiceSpy.hide).toHaveBeenCalled();
    expect(component.error_msg).toBe("La confirmation ne correspond pas au mot de passe entré.");
    httpClientTesting.expectNone('http://127.0.0.1:8000/api/users');
  });

  it('devrait afficher une erreur si le formulaire est invalide', () => {
    const formvalue = {
      firstname: '',
      email: 'john@doe.fr',
      plainPassword: 'Password123!',
      cpw: 'Password123!', 
      honneypot: ''
    }
    // simulation de l'action de mon service CleanData pour que celui-ci soit bien pris en compte dans ce test
    cleanDataServiceSpy.cleanObject.and.returnValue(formvalue);

    component.signUpForm.setValue(formvalue);

    component.onSubmit();

    expect(loaderServiceSpy.hide).toHaveBeenCalled();
    expect(component.error_msg).toBe("Le formulaire n'est pas conforme.");
    httpClientTesting.expectNone('http://127.0.0.1:8000/api/users');
  });

  it("ne devrait pas soumettre le formulaire si le champ honneypot est rempli", () => {
    spyOn(router, 'navigateByUrl');

    const formvalue = {
      firstname: 'John',
      email: 'john@doe.fr',
      plainPassword: 'Password123!',
      cpw: 'Password123!', 
      honneypot: 'bot'
    }
    cleanDataServiceSpy.cleanObject.and.returnValue(formvalue);

    component.signUpForm.setValue(formvalue);

    component.onSubmit();

    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
    httpClientTesting.expectNone('http://127.0.0.1:8000/api/users');
  });

  it('devrait soumettre le formulaire avec des valeurs valides', () => {
    spyOn(router, 'navigateByUrl');

    const formvalue = {
      firstname: 'John',
      email: 'john@doe.fr',
      plainPassword: 'Password123!',
      cpw: 'Password123!', 
      honneypot: ''
    }
    cleanDataServiceSpy.cleanObject.and.returnValue(formvalue);

    component.signUpForm.setValue(formvalue);

    component.onSubmit();

    const signupReq = httpClientTesting.expectOne('http://127.0.0.1:8000/api/users');
    expect(signupReq.request.method).toBe('POST');
    signupReq.flush({});

    const loginReq = httpClientTesting.expectOne('http://127.0.0.1:8000/api/login_check');
    expect(loginReq.request.method).toBe('POST');
    loginReq.flush({ token: 'jwt' });
    expect(localStorage.getItem('jwt')).toBe('jwt');

    const userInfoRequest = httpClientTesting.expectOne('http://127.0.0.1:8000/api/users?email=john@doe.fr');
    expect(userInfoRequest.request.method).toBe('GET');
    
    const mockUserInfoResponse = { 'hydra:member': [{ id: 1, name: 'John', email: 'john@doe.fr' }] };
    userInfoRequest.flush(mockUserInfoResponse);

    const storedUserInfo = sessionStorage.getItem('userInfo');
    expect(storedUserInfo).toBeTruthy();

    expect(localStorage.getItem('jwt')).toBe('jwt');
    expect(loaderServiceSpy.hide).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/dashboard');
  });

  it("devrait afficher un message d'erreur si l'inscription échou", () => {
    const formvalue = {
      firstname: 'John',
      email: 'john@doe.fr',
      plainPassword: 'Password123!',
      cpw: 'Password123!', 
      honneypot: ''
    }
    cleanDataServiceSpy.cleanObject.and.returnValue(formvalue);

    component.signUpForm.setValue(formvalue);

    component.onSubmit();

    const signupReq = httpClientTesting.expectOne('http://127.0.0.1:8000/api/users');
    signupReq.flush({}, { status: 400, statusText: 'Bad Request' });

    expect(component.error_msg).toBe("Le formulaire n'est pas conforme. Veuillez réessayer.");
  });

  it("devrait afficher un message d'erreur si la connexion échou", () => {
    const formvalue = {
      firstname: 'John',
      email: 'john@doe.fr',
      plainPassword: 'Password123!',
      cpw: 'Password123!', 
      honneypot: ''
    }
    cleanDataServiceSpy.cleanObject.and.returnValue(formvalue);

    component.signUpForm.setValue(formvalue);

    component.onSubmit();

    const signupReq = httpClientTesting.expectOne('http://127.0.0.1:8000/api/users');
    signupReq.flush({});

    const loginReq = httpClientTesting.expectOne('http://127.0.0.1:8000/api/login_check');
    loginReq.flush({}, { status: 400, statusText: 'Bad Request' });

    expect(component.error_msg).toBe("Une erreur s'est produite. Veuillez réessayer plus tard.");
  });
});
