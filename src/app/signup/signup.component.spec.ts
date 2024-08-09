import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from './signup.component';
import { ActivatedRoute, Router } from '@angular/router';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        SignupComponent
      ],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: {} } } // <- Simulez ActivatedRoute si nécessaire
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('le formulaire ne doit pas être soumis si les mot de passe ne match pas', () => {
    component.signUpForm.setValue({
      firstname: 'John',
      email: 'john.doe@example.com',
      plainPassword: 'password123',
      cpw: 'password456', 
      honneypot: ''
    });

    component.onSubmit();

    expect(component.error_msg).toBe("La confirmation ne correspond pas au mot de passe entré.");
    const req = httpMock.expectNone('http://127.0.0.1:8000/api/users');
  });

  it('si le formulaire est invalide alors il ne doit pas être soumis', () => {
    component.signUpForm.setValue({
      firstname: '', 
      email: 'john.doe@example.com',
      plainPassword: 'password123',
      cpw: 'password123',
      honneypot: ''
    });

    component.onSubmit();

    expect(component.error_msg).toBe("La confirmation ne correspond pas au mot de passe entré.");
    const req = httpMock.expectNone('http://127.0.0.1:8000/api/users');
  });

  it('si honneypot n\'est pas vide alors il y a une redirection vers le login', () => {
    spyOn(router, 'navigateByUrl');

    component.signUpForm.setValue({
      firstname: 'John',
      email: 'john.doe@example.com',
      plainPassword: 'password123',
      cpw: 'password123',
      honneypot: 'spam'  // Filled honeypot
    });

    component.onSubmit();

    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
    const req = httpMock.expectNone('http://127.0.0.1:8000/api/users');
  });

  it('si le formulaire est valide il doit être soumis', () => {
    spyOn(router, 'navigateByUrl');

    component.signUpForm.setValue({
      firstname: 'John',
      email: 'john.doe@example.com',
      plainPassword: 'password123',
      cpw: 'password123',
      honneypot: ''
    });

    component.onSubmit();

    const signupReq = httpMock.expectOne('http://127.0.0.1:8000/api/users');
    expect(signupReq.request.method).toBe('POST');
    signupReq.flush({});

    const loginReq = httpMock.expectOne('http://127.0.0.1:8000/api/login_check');
    expect(loginReq.request.method).toBe('POST');
    loginReq.flush({ token: 'jwt' });

    expect(localStorage.getItem('jwt')).toBe('jwt');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/dashboard');
  });

  it('si la requète d\'inscription n\'est pas bonne alors je dois avoir mon message d\'erreur', () => {
    component.signUpForm.setValue({
      firstname: 'John',
      email: 'john.doe@example.com',
      plainPassword: 'password123',
      cpw: 'password123',
      honneypot: ''
    });

    component.onSubmit();

    const signupReq = httpMock.expectOne('http://127.0.0.1:8000/api/users');
    signupReq.flush({}, { status: 400, statusText: 'Bad Request' });

    expect(component.error_msg).toBe("Le formulaire n'est pas conforme. Veuillez réessayer.");
  });

  it('si la requète de login n\'est pas bonne alors je dois avoir mon message d\'erreur', () => {
    component.signUpForm.setValue({
      firstname: 'John',
      email: 'john.doe@example.com',
      plainPassword: 'password123',
      cpw: 'password123',
      honneypot: ''
    });

    component.onSubmit();

    const signupReq = httpMock.expectOne('http://127.0.0.1:8000/api/users');
    signupReq.flush({});

    const loginReq = httpMock.expectOne('http://127.0.0.1:8000/api/login_check');
    loginReq.flush({}, { status: 400, statusText: 'Bad Request' });

    expect(component.error_msg).toBe("Le formulaire n'est pas conforme. Veuillez réessayer.");
  });
});
