import { TestBed, ComponentFixture } from '@angular/core/testing';
import { UserInformationsComponent } from './user-informations.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CleanDataService } from '../../services/cleanDataService/clean-data.service';
import { LoaderService } from '../../services/loaderService/loader.service';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { JwtService } from '../../services/jwtServices/jwt.service';
import { Meta, Title } from '@angular/platform-browser';

describe('UserInformationsComponent', () => {
  let component: UserInformationsComponent;
  let fixture: ComponentFixture<UserInformationsComponent>;
  let cleanDataServiceSpy: jasmine.SpyObj<CleanDataService>;
  let loaderServiceSpy: jasmine.SpyObj<LoaderService>;
  let jwtServiceSpy: jasmine.SpyObj<JwtService>;
  let metaServiceSpy: jasmine.SpyObj<Meta>;
  let titleServiceSpy: jasmine.SpyObj<Title>;

  beforeEach(async () => {
    cleanDataServiceSpy = jasmine.createSpyObj('CleanDataService', ['cleanObject']);
    loaderServiceSpy = jasmine.createSpyObj('LoaderService', ['show', 'hide']);
    jwtServiceSpy = jasmine.createSpyObj('JwtService', ['decode']);
    metaServiceSpy = jasmine.createSpyObj('Meta', ['addTags']);
    titleServiceSpy = jasmine.createSpyObj('Title', ['setTitle']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule, UserInformationsComponent],
      providers: [
        { provide: CleanDataService, useValue: cleanDataServiceSpy },
        { provide: LoaderService, useValue: loaderServiceSpy },
        { provide: JwtService, useValue: jwtServiceSpy },
        { provide: Meta, useValue: metaServiceSpy },
        { provide: Title, useValue: titleServiceSpy },
        { provide: ActivatedRoute, useValue: { snapshot: {} } } 
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInformationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait initialiser les metadatas', () => {
    expect(titleServiceSpy.setTitle).toHaveBeenCalledWith('Modification des Informations - Infinite Quiz');
    expect(metaServiceSpy.addTags).toHaveBeenCalledWith([
      { name: 'description', content: 'Modifiez vos informations personnelles dans votre espace utilisateur. Assurez-vous que vos données sont à jour et exactes.' },
      { name: 'robots', content: 'noindex, nofollow' } 
    ]);
  });

  it('devrait initialiser les informations utilisateur dans ngOnInit et les afficher dans les champs du formulaire', () => {
    const decodedToken = {
      username: 'john@doe.fr'
    };
    const response = {
      'hydra:member': [
        {
          id: '1',
          firstname: 'John',
          email: 'john@doe.fr'
        }
      ]
    };
    component.jwt = 'valid.jwt.token';
    jwtServiceSpy.decode.and.returnValue(decodedToken);

    spyOn(component.http, 'get').and.returnValue(of(response));

    component.ngOnInit();

    expect(component.userId).toBe(response['hydra:member'][0].id);
    expect(component.user_email).toBe(response['hydra:member'][0].email);
    expect(component.user_name).toBe(response['hydra:member'][0].firstname);
    expect(component.userForm.value.firstname).toBe(response['hydra:member'][0].firstname);
    expect(component.userForm.value.email).toBe(response['hydra:member'][0].email);
    expect(loaderServiceSpy.hide).toHaveBeenCalled();
  });

  it("devrait faire une redirection vers le login s'il le jwt est abscent", () => {
    spyOn(component.router, 'navigateByUrl');
  
    component.jwt = '';
    component.ngOnInit();
  
    expect(loaderServiceSpy.hide).toHaveBeenCalled();
    expect(component.router.navigateByUrl).toHaveBeenCalledWith('/login');
  });

  it("ne devrait pas soummettre le formulaire si honneypot n'est pas vide", () => {
    component.userId = '1';
    component.jwt = 'valid.jwt.token';

    const formvalue = {
      firstname: 'John',
      email: 'john@doe.fr',
      honneypot: 'bot'
    }
    cleanDataServiceSpy.cleanObject.and.returnValue(formvalue);
    component.userForm.setValue(formvalue);
  
    spyOn(component.router, 'navigateByUrl');
    const httpPatchSpy = spyOn(component.http, 'patch');
    component.onSubmit();
    

    expect(loaderServiceSpy.show).toHaveBeenCalled();
    expect(loaderServiceSpy.hide).toHaveBeenCalled();
  
    // Vérifie que la requête n'est pas appelée en vérifiant que l'appel est à zéro
    expect(httpPatchSpy).toHaveBeenCalledTimes(0)
  
    expect(component.router.navigateByUrl).toHaveBeenCalledWith('/login');
  });
  
  

  it('devrait soumettre le formulaire si le formulaire est valide', () => {
    component.userId = '1';
    component.jwt = 'valid.jwt.token';
    component.userForm.setValue({
      firstname: 'John',
      email: 'john@doe.fr',
      honneypot: ''
    });
  
    const response = { success: true };
    cleanDataServiceSpy.cleanObject.and.returnValue(component.userForm.value);
  
    const httpSpy = spyOn(component.http, 'patch').and.returnValue(of(response));
  
    component.onSubmit();
    
    expect(loaderServiceSpy.show).toHaveBeenCalled();
    expect(loaderServiceSpy.hide).toHaveBeenCalled();
    expect(component.msg).toBe('Modifications réalisées avec succès');
    expect(component.style_class).toContain('text-success-emphasis');
    expect(httpSpy).toHaveBeenCalledWith(
      `http://127.0.0.1:8000/api/users/${component.userId}`,
      JSON.stringify(component.userForm.value),
      { headers: { Authorization: 'Bearer ' + component.jwt, 'Content-Type': 'application/merge-patch+json' } }
    );
  });
  
  it('devrait afficher un message en cas de problème lors de la soumission', () => {
    component.userId = '1';
    component.jwt = 'valid.jwt.token';
    component.userForm.setValue({
      firstname: 'John',
      email: 'john@doe.fr',
      honneypot: ''
    });
  
    cleanDataServiceSpy.cleanObject.and.returnValue(component.userForm.value);
  
    const httpSpy = spyOn(component.http, 'patch').and.returnValue(throwError(() => new Error('Error')));
  
    component.onSubmit();
  
    expect(loaderServiceSpy.show).toHaveBeenCalled();
    expect(loaderServiceSpy.hide).toHaveBeenCalled();
    expect(component.msg).toBe("Une erreur s'est produite. Veuillez réessayer plus tard.");
    expect(component.style_class).toContain('text-warning-emphasis');
  });
  
  
});

