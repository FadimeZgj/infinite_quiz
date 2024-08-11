import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { UserInformationsComponent } from './user-informations.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { JwtService } from '../services/jwtServices/jwt.service';

describe('UserInformationsComponent', () => {
  let component: UserInformationsComponent;
  let fixture: ComponentFixture<UserInformationsComponent>;
  let router: Router;
  let httpTestingController: HttpTestingController;
  let jwtService: JwtService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: {} } },
        JwtService
      ],
    }).compileComponents();
    
    fixture = TestBed.createComponent(UserInformationsComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');
    jwtService = TestBed.inject(JwtService);
    // spyOn(jwtService, 'decode').and.returnValue({ username: 'john@doe.fr' });

    // Configuration de localStorage pour chaque test
    // localStorage.setItem('jwt', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlcm5hbWUiOiJqb2huQGRvZS5mciIsImlhdCI6MTUxNjIzOTAyMn0.H1XaOJUbTFapNjsS0vSPxREkM6KmnaRxoQSnipCq-BU');
  });

  afterEach(() => {
    httpTestingController.verify(); // Vérifie que toutes les requêtes ont été traitées
    localStorage.removeItem('jwt'); // Réinitialise localStorage après chaque test
  });

  it('should create', () => {
    fixture.detectChanges(); // Assurez-vous que ngOnInit est appelé ici
    expect(component).toBeTruthy();
  });

  it('should navigate to login if JWT is missing or invalid', () => {
    localStorage.setItem('jwt', ''); // Simule un JWT invalide
    fixture.detectChanges(); // Appelle ngOnInit
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  });

  it('should submit the form successfully and display a success message', () => {
    const fakeJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlcm5hbWUiOiJqb2huQGRvZS5mciIsImlhdCI6MTUxNjIzOTAyMn0.H1XaOJUbTFapNjsS0vSPxREkM6KmnaRxoQSnipCq-BU'; // JWT factice
    localStorage.setItem('jwt', fakeJwt);
    component.userId = '123';
    component.user_name = 'John';
    component.user_email = 'john@doe.fr'
    
    component.userForm.setValue({ firstname: 'John', email: '', honneypot: '' });
    
    component.onSubmit();
  
    const req = httpTestingController.expectOne(`http://127.0.0.1:8000/api/users/123`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(JSON.stringify({
      firstname: 'John',
      email: 'john@doe.fr',
      honneypot: ''
    }));
    
    req.flush({}); // Simule une réponse de succès
  
    expect(component.msg).toBe('Modifications réalisées avec succés');
    expect(component.style_class).toBe('p-3 text-success-emphasis bg-success-subtle border border-success rounded-3');
  });
  
  it('should display an error message if the submission fails', () => {
    const fakeJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlcm5hbWUiOiJqb2huQGRvZS5mciIsImlhdCI6MTUxNjIzOTAyMn0.H1XaOJUbTFapNjsS0vSPxREkM6KmnaRxoQSnipCq-BU'; // JWT factice
    localStorage.setItem('jwt', fakeJwt);
    component.userId = '123';
    component.user_name = 'John';
    component.user_email = 'john@doe.fr'
    component.userForm.setValue({ firstname: 'John', email: '', honneypot: '' });
  
    component.onSubmit();
  
    const req = httpTestingController.expectOne(`http://127.0.0.1:8000/api/users/123`);
    expect(req.request.method).toBe('PATCH');
  
    req.flush({}, { status: 500, statusText: 'Internal Server Error' });
  
    expect(component.msg).toBe("Une erreur s'est produite. Veuillez réessayer plus tard.");
    expect(component.style_class).toBe("p-3 text-warning-emphasis bg-warning border border-warning-subtle rounded-3");
  });
  
  it('should navigate to login if the form is invalid', () => {
    const fakeJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlcm5hbWUiOiJqb2huQGRvZS5mciIsImlhdCI6MTUxNjIzOTAyMn0.H1XaOJUbTFapNjsS0vSPxREkM6KmnaRxoQSnipCq-BU'; // JWT factice
    localStorage.setItem('jwt', fakeJwt);
    component.userId = '123';
    component.user_name = 'John';
    component.user_email = 'john@doe.fr'
    component.userForm.setValue({ firstname: '', email: 'invalid-email', honneypot: '' });
  
    component.onSubmit();
  
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
    httpTestingController.expectNone(`http://127.0.0.1:8000/api/users/123`);
  });
  
  //  it('should make HTTP request and handle response when JWT is valid', () => {
  //   const fakeJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlcm5hbWUiOiJqb2huQGRvZS5mciIsImlhdCI6MTUxNjIzOTAyMn0.H1XaOJUbTFapNjsS0vSPxREkM6KmnaRxoQSnipCq-BU'; // JWT factice
  //   localStorage.setItem('jwt', fakeJwt);
    
  //   // spyOn(localStorage, 'getItem').and.returnValue(fakeJwt);
  //   const mockResponse = {
  //     'hydra:member': [
  //       {
  //         id: '123',
  //         firstname: 'John',
  //         email: 'john@doe.fr'
  //       }
  //     ]
  //   };

  //   // fixture.detectChanges(); // Appelle ngOnInit
  //   fixture.detectChanges();
  //   // Attendez la requête GET
  //   const req = httpTestingController.expectOne(`http://127.0.0.1:8000/api/users?email=john@doe.fr`);
  //   expect(req.request.method).toBe('GET');

  //   // Simuler la réponse
  //   req.flush(mockResponse);

  //   // Vérifiez qu'il n'y a pas de requêtes supplémentaires en attente
  //   // httpTestingController.verify();

  //   // Déclencher la détection des changements après la réponse
  //   fixture.detectChanges();

  //   // Vérifiez les valeurs traitées par le composant
  //   expect(component.userId).toEqual('123');
  //   expect(component.user_name).toEqual('John');
  //   expect(component.user_email).toEqual('john@doe.fr');
  // });

  // it('should make HTTP request and handle response when JWT is valid', () => {
  //   const fakeJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG5AZG9lLmZyIn0.H1XaOJUbTFapNjsS0vSPxREkM6KmnaRxoQSnipCq-BU';
  //   localStorage.setItem('jwt', fakeJwt);
  //   spyOn(jwtService, 'decode').and.returnValue({ username: 'john@doe.fr' });
  
  //   const mockResponse = {
  //     'hydra:member': [
  //       {
  //         id: '123',
  //         firstname: 'John',
  //         email: 'john@doe.fr'
  //       }
  //     ]
  //   };
  
  //   // Attendez la requête GET
  //   const req = httpTestingController.expectOne(`http://127.0.0.1:8000/api/users?email=john@doe.fr`);
  //   expect(req.request.method).toBe('GET');
  //   expect(req.request.headers.get('Authorization')).toBe('Bearer ' + fakeJwt);

  //   // Simuler la réponse
  //   req.flush(mockResponse);

  //   // Déclencher la détection des changements après la réponse
  //   fixture.detectChanges();

  //   // Vérifiez les valeurs traitées par le composant
  //   expect(component.userId).toEqual('123');
  //   expect(component.user_name).toEqual('John');
  //   expect(component.user_email).toEqual('john@doe.fr');
  // });

  // it('should load user information if JWT is valid', () => {
  //   const fakeJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlcm5hbWUiOiJqb2huQGRvZS5mciIsImlhdCI6MTUxNjIzOTAyMn0.H1XaOJUbTFapNjsS0vSPxREkM6KmnaRxoQSnipCq-BU'; // JWT factice
  //   localStorage.setItem('jwt', fakeJwt);
  //   const decodedToken = { username: 'john@doe.fr' };
  //   const mockResponse = {
  //     'hydra:member': [{ id: '123', firstname: 'john', email: 'john@doe.fr' }]
  //   };
    
  //   spyOn(localStorage, 'getItem').and.returnValue(fakeJwt);
  //   spyOn(component['jwtService'], 'decode').and.returnValue(decodedToken);
  //   spyOn(component['http'], 'get').and.returnValue(of(mockResponse));
  
  //   component.ngOnInit();
  
  //   expect(component.userId).toBe('123');
  //   expect(component.user_name).toBe('john');
  //   expect(component.user_email).toBe('john@doe.fr');
  // });


});
