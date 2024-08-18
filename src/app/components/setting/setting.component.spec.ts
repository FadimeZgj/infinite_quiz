import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingComponent } from './setting.component';


describe('SettingComponent', () => {
  let component: SettingComponent;
  let fixture: ComponentFixture<SettingComponent>;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        SettingComponent,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: {} } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SettingComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it("Le compte doit être supprimer et l'utilisateur est redirigé vers la page d'inscription ", () => {
    // Je suis obligé de mettre un jwt complet pour que le test fonctionne car il s'agit du format attendu (jwt généré sur https://jwt.io/)
    const fakeJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlcm5hbWUiOiJqb2huQGRvZS5mciIsImlhdCI6MTUxNjIzOTAyMn0.H1XaOJUbTFapNjsS0vSPxREkM6KmnaRxoQSnipCq-BU'; // Un JWT factice correctement formaté
    const decodedToken = { username: 'john@doe.fr' };

    spyOn(localStorage, 'getItem').and.returnValue(fakeJwt);
    spyOn(localStorage, 'removeItem');

    // Appel réel de la méthode onDelete
    component.onDelete();

    // Attendez la requête GET
    const reqGetUser = httpMock.expectOne(`http://127.0.0.1:8000/api/users?email=${decodedToken.username}`);
    expect(reqGetUser.request.method).toBe('GET');
    reqGetUser.flush({ 'hydra:member': [{ id: 123 }] });

    // Attendez la requête DELETE
    const reqDeleteUser = httpMock.expectOne(`http://127.0.0.1:8000/api/users/123`);
    expect(reqDeleteUser.request.method).toBe('DELETE');
    reqDeleteUser.flush({});

    // Vérifiez les appels
    expect(localStorage.removeItem).toHaveBeenCalledWith("jwt");
    expect(router.navigateByUrl).toHaveBeenCalledWith('/signup');
  });

  it("Un message d'erreur doit apparaitre si un problème survient", () => {
    const fakeJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlcm5hbWUiOiJqb2huQGRvZS5mciIsImlhdCI6MTUxNjIzOTAyMn0.H1XaOJUbTFapNjsS0vSPxREkM6KmnaRxoQSnipCq-BU'; // Un JWT factice correctement formaté
    const decodedToken = { username: 'john@doe.fr' };

    spyOn(localStorage, 'getItem').and.returnValue(fakeJwt);
    spyOn(localStorage, 'removeItem');

    // Simulez une erreur lors de la requête GET pour récupérer les informations de l'utilisateur
    component.onDelete();

    const reqGetUser = httpMock.expectOne(`http://127.0.0.1:8000/api/users?email=${decodedToken.username}`);
    expect(reqGetUser.request.method).toBe('GET');
    reqGetUser.flush({}, { status: 500, statusText: 'Server Error' });

    // Vérifiez les messages d'erreur dans le composant
    expect(component.message).toBe("Une erreur s'est produite. Veuillez réessayer plus tard.");
    expect(component.style_class).toBe("p-3 text-warning-emphasis bg-warning border border-warning-subtle rounded-3");
  });
});
