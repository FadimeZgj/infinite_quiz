import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { ActivatedRoute, Router } from '@angular/router';

describe('LoginComponent', () => {
  // instenciation du composant
  let component: LoginComponent;

  // instanciation de fixtures pour permttre d'interagir avec le composent
  let fixture: ComponentFixture<LoginComponent>;

  // instenciation de httpTestingController pour tester les requètes http
  let httpTestingController: HttpTestingController;

  // permettra de vérifier le routage
  let router: Router;

  // beforeEach s'execute avant chaque test afin de configurer le module de test du LoginCoponent et ses dépendances
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        LoginComponent
      ],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: {} } } // <- Simulez ActivatedRoute si nécessaire
      ]
    }).compileComponents();

    // création du composant
    fixture = TestBed.createComponent(LoginComponent);
    // accée au composant
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);

    // détection des changements apporter au composant
    fixture.detectChanges();
  });

  // permet de réinitialiser les tests et si à la suite des tests une requète ne serait pas complète alors cela indiquera que le test n'a pas fonctionné
  afterEach(() => {
    httpTestingController.verify();
  });

  // vérification que le composant ce créé bien
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('le formulaire doit être vide au départ', () => {
    const loginForm = component.loginForm;
    expect(loginForm).toBeTruthy();
    expect(loginForm.controls['username'].value).toEqual('');
    expect(loginForm.controls['password'].value).toEqual('');
    expect(loginForm.controls['honneypot'].value).toEqual('');
  });

  it('si le champs honneypot n\'est pas vide alors il ne dois pas avoir d\'appel vers L\'API', () => {
    const navigateSpy = spyOn(router, 'navigateByUrl');

    component.loginForm.controls['honneypot'].setValue('non vide');
    component.onSubmit();

    expect(navigateSpy).toHaveBeenCalledWith('/login');
  });

  it('si le formulaire est bien rempli alors on génère le jwt et l\'utilisateur est redirigé vers le dashboard', () => {
    const navigateSpy = spyOn(router, 'navigateByUrl');
    const mockResponse = { token: 'fake-jwt' };

    component.loginForm.controls['username'].setValue('testuser');
    component.loginForm.controls['password'].setValue('testpass');
    component.loginForm.controls['honneypot'].setValue('');

    component.onSubmit();

    const req = httpTestingController.expectOne('http://127.0.0.1:8000/api/login_check');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    expect(localStorage.getItem('jwt')).toBe(mockResponse.token);
    expect(navigateSpy).toHaveBeenCalledWith('/dashboard');
  });

  it('si les information fournit ne sont pas bonne alors un message d\'erreur doit être émis', () => {
    component.loginForm.controls['username'].setValue('testuser');
    component.loginForm.controls['password'].setValue('testpass');
    component.loginForm.controls['honneypot'].setValue('');

    component.onSubmit();

    const req = httpTestingController.expectOne('http://127.0.0.1:8000/api/login_check');
    expect(req.request.method).toBe('POST');
    req.flush({ message: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });

    expect(component.user_msg).toBe("l'email ou le mot de passe est incorrect");
  });
});

