import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { CleanDataService } from '../../services/cleanDataService/clean-data.service';
import { LoaderService } from '../../services/loaderService/loader.service';
import { ActivatedRoute, Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpClientTesting: HttpTestingController;
  let cleanDataServiceSpy: jasmine.SpyObj<CleanDataService>;
  let loaderServiceSpy: jasmine.SpyObj<LoaderService>;
  let router: Router;

  beforeEach(async () => {
    // Création d'espion pour les services utilisés dans le composant
    cleanDataServiceSpy = jasmine.createSpyObj('CleanDataService', ['cleanObject']);
    loaderServiceSpy = jasmine.createSpyObj('LoaderService', ['show', 'hide']);

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,  // Module pour tester les requêtes HTTP
        ReactiveFormsModule,  // Module pour les formulaires réactifs
        LoginComponent,  // Le composant à tester
      ],
      providers: [
        { provide: CleanDataService, useValue: cleanDataServiceSpy },  // Injection de CleanDataService
        { provide: LoaderService, useValue: loaderServiceSpy },  // Injection de LoaderService
        { provide: ActivatedRoute, useValue: { snapshot: {} } },  
      ],
    }).compileComponents();

    // Initialisation du composant et des services
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    httpClientTesting = TestBed.inject(HttpTestingController);
    cleanDataServiceSpy = TestBed.inject(CleanDataService) as jasmine.SpyObj<CleanDataService>;
    loaderServiceSpy = TestBed.inject(LoaderService) as jasmine.SpyObj<LoaderService>;
    router = TestBed.inject(Router);

    fixture.detectChanges();  // Déclenche la détection des changements pour initialiser le composant
  });

  // Test de création du composant
  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();  // Vérifie que le composant est bien créé
  });

  // Test pour vérifier que la méthode "show" du LoaderService est appelée lors de la soumission du formulaire
  it("devrait appeler show sur loaderService lors de l'envoi du formulaire", () => {
    // Simule le retour de la méthode cleanObject
    cleanDataServiceSpy.cleanObject.and.returnValue({ username: 'john@doe.fr', password: 'password', honneypot: '' });

    component.onSubmit();  // Appelle la méthode onSubmit du composant

    expect(loaderServiceSpy.show).toHaveBeenCalled();  // Vérifie que la méthode show a été appelée
  });

  // Test pour s'assurer que le formulaire n'est pas soumis si le champ "honneypot" est rempli
  it('ne devrait pas soumettre le formulaire si le champ "honneypot" est rempli', () => {
    // Simule un formulaire rempli où "honneypot" est non vide
    cleanDataServiceSpy.cleanObject.and.returnValue({ username: 'john@doe.fr', password: 'password', honneypot: 'bot' });

    const navigateSpy = spyOn(component.router, 'navigateByUrl');  // Espionne la méthode navigateByUrl

    component.onSubmit();  // Appelle la méthode onSubmit du composant

    expect(navigateSpy).toHaveBeenCalledWith('/login');  // Vérifie que la redirection vers '/login' a eu lieu

    httpClientTesting.expectNone('http://127.0.0.1:8000/api/login_check');  // Vérifie qu'aucune requête HTTP n'a été faite
  });

  // Test pour vérifier l'envoi correct d'une requête POST de connexion et la gestion de la réponse
  it('devrait envoyer une requête POST de connexion et gérer correctement la réponse', () => {
    const navigateSpy = spyOn(router, 'navigateByUrl');  // Espionne la méthode navigateByUrl
    const cleanedData = { username: 'john@doe.fr', password: 'password', honneypot: '' };
    cleanDataServiceSpy.cleanObject.and.returnValue(cleanedData);  // Simule le retour de cleanObject

    // Remplit le formulaire
    component.loginForm.controls['username'].setValue('john@doe.fr');
    component.loginForm.controls['password'].setValue('password');

    component.onSubmit();  // Appelle la méthode onSubmit du composant

    expect(loaderServiceSpy.show).toHaveBeenCalled();  // Vérifie que la méthode show a été appelée

    const req = httpClientTesting.expectOne('http://127.0.0.1:8000/api/login_check');  // Capture la requête POST
    expect(req.request.method).toBe('POST');  // Vérifie que la méthode de la requête est POST
    expect(req.request.body).toEqual(JSON.stringify(cleanedData));  // Vérifie que le corps de la requête est correct

    const response = { token: 'fake-jwt' };
    req.flush(response);  // Simule la réponse du serveur

    expect(localStorage.getItem('jwt')).toBe('fake-jwt');  // Vérifie que le token est bien stocké dans localStorage

    expect(loaderServiceSpy.hide).toHaveBeenCalled();  // Vérifie que la méthode hide a été appelée
    expect(navigateSpy).toHaveBeenCalledWith('/dashboard');  // Vérifie que la redirection vers '/dashboard' a eu lieu
  });
});
