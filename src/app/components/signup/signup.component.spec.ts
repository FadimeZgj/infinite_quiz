import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from './signup.component';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../../services/loaderService/loader.service';
import { CleanDataService } from '../../services/cleanDataService/clean-data.service';
import { Meta, Title } from '@angular/platform-browser';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let httpClientTesting: HttpTestingController;
  let router: Router;
  let loaderServiceSpy: jasmine.SpyObj<LoaderService>;
  let cleanDataServiceSpy: jasmine.SpyObj<CleanDataService>;
  let metaServiceSpy: jasmine.SpyObj<Meta>;
  let titleServiceSpy: jasmine.SpyObj<Title>;

  beforeEach(async () => {
    // Création d'espion pour surveiller les services
    cleanDataServiceSpy = jasmine.createSpyObj('CleanDataService', ['cleanObject']);
    loaderServiceSpy = jasmine.createSpyObj('LoaderService', ['show', 'hide']);
    metaServiceSpy = jasmine.createSpyObj('Meta', ['addTags']);
    titleServiceSpy = jasmine.createSpyObj('Title', ['setTitle']);

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        SignupComponent
      ],
      providers: [
        { provide: CleanDataService, useValue: cleanDataServiceSpy },
        { provide: LoaderService, useValue: loaderServiceSpy },
        { provide: Meta, useValue: metaServiceSpy },
        { provide: Title, useValue: titleServiceSpy },
        { provide: ActivatedRoute, useValue: { snapshot: {} } } 
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    httpClientTesting = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpClientTesting.verify();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait initialiser les metadatas', () => {
    expect(titleServiceSpy.setTitle).toHaveBeenCalledWith('Inscription - Créez vos quiz facilement avec Infinite Quiz');
    expect(metaServiceSpy.addTags).toHaveBeenCalledWith([
      { name: 'description', content: 'Inscrivez-vous pour accéder à notre service. Remplissez le formulaire d’inscription avec vos informations personnelles pour créer un compte.' },
      { name: 'keywords', content: 'inscription, quiz, création de quiz, gestion de quiz' },
      { name: 'robots', content: 'index, follow' } 
    ]);
  });

  it('devrait ne pas soumettre le formulaire si les mots de passe ne correspondent pas', () => {
    const formvalue = {
      firstname: 'John',
      email: 'john@doe.fr',
      plainPassword: 'Password123!',
      cpw: 'Password124!', 
      honneypot: ''
    };

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
    };

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
    };

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
    };

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

    expect(loaderServiceSpy.hide).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/dashboard');
  });

  it("devrait afficher un message d'erreur si l'inscription échoue", () => {
    const formvalue = {
      firstname: 'John',
      email: 'john@doe.fr',
      plainPassword: 'Password123!',
      cpw: 'Password123!', 
      honneypot: ''
    };

    cleanDataServiceSpy.cleanObject.and.returnValue(formvalue);

    component.signUpForm.setValue(formvalue);

    component.onSubmit();

    const signupReq = httpClientTesting.expectOne('http://127.0.0.1:8000/api/users');
    signupReq.flush({}, { status: 400, statusText: 'Bad Request' });

    expect(component.error_msg).toBe("Le formulaire n'est pas conforme. Veuillez réessayer.");
  });

  it("devrait afficher un message d'erreur si la connexion échoue", () => {
    const formvalue = {
      firstname: 'John',
      email: 'john@doe.fr',
      plainPassword: 'Password123!',
      cpw: 'Password123!', 
      honneypot: ''
    };

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
