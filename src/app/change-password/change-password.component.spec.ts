
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ChangePasswordComponent } from './change-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CleanDataService } from '../services/cleanDataService/clean-data.service';
import { LoaderService } from '../services/loaderService/loader.service';
import * as CryptoJS from 'crypto-js';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;
  let cleanDataServiceSpy: jasmine.SpyObj<CleanDataService>;
  let loaderServiceSpy: jasmine.SpyObj<LoaderService>;

  beforeEach(async () => {
    cleanDataServiceSpy = jasmine.createSpyObj('CleanDataService', ['cleanObject']);
    loaderServiceSpy = jasmine.createSpyObj('LoaderService', ['show', 'hide']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule, ChangePasswordComponent],
      providers: [
        { provide: CleanDataService, useValue: cleanDataServiceSpy },
        { provide: LoaderService, useValue: loaderServiceSpy },
        { provide: ActivatedRoute, useValue: { snapshot: {} } } 
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it("devrait initialiser les informations utilisateur dans ngOnInit", () => {
    const userInfos = {
      id: '1',
    };
    component.jwt = 'valid.jwt.token';
    spyOn(sessionStorage, 'getItem').and.returnValue(CryptoJS.AES.encrypt(JSON.stringify(userInfos), CryptoJS.SHA256(component.jwt).toString()).toString());
    
    component.ngOnInit();
  
    expect(component.userId).toBe(userInfos.id);
    expect(loaderServiceSpy.hide).toHaveBeenCalled();
  });

  it("devrait faire une redirection vers le login s'il le jwt est abscent", () => {
    spyOn(component.router, 'navigateByUrl');
  
    component.jwt = '';
    component.ngOnInit();
  
    expect(loaderServiceSpy.hide).toHaveBeenCalled();
    expect(component.router.navigateByUrl).toHaveBeenCalledWith('/login');
  });

  it('devrait ne pas soumettre le formulaire si les mots de passe ne match pas', () => {
    const formvalue = {
      plainPassword: 'Password123!',
      cpw: 'Password124!', 
      honneypot: ''
    }

    cleanDataServiceSpy.cleanObject.and.returnValue(formvalue);

    component.passwordForm.setValue(formvalue);
    const httpPatchSpy = spyOn(component.http, 'patch');
    component.onSubmit();

    expect(loaderServiceSpy.hide).toHaveBeenCalled();
    expect(component.noMatch).toBe(true);
    expect(httpPatchSpy).toHaveBeenCalledTimes(0)
  });

  it("ne devrait pas soummettre le formulaire si honneypot n'est pas vide", () => {
    component.userId = '1';
    component.jwt = 'valid.jwt.token';

    const formvalue = {
      plainPassword: 'Password123!',
      cpw: 'Password123!', 
      honneypot: 'bot'
    }
    cleanDataServiceSpy.cleanObject.and.returnValue(formvalue);
    component.passwordForm.setValue(formvalue);
  
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
    component.passwordForm.setValue({
      plainPassword: 'Password123!',
      cpw: 'Password123!', 
      honneypot: ''
    });
  
    const response = { success: true };
    cleanDataServiceSpy.cleanObject.and.returnValue(component.passwordForm.value);
  
    const httpSpy = spyOn(component.http, 'patch').and.returnValue(of(response));
  
    component.onSubmit();
    
    expect(loaderServiceSpy.show).toHaveBeenCalled();
    expect(loaderServiceSpy.hide).toHaveBeenCalled();
    expect(component.msg).toBe('Modifications réalisées avec succès');
    expect(component.style_class).toContain('text-success-emphasis');
    expect(httpSpy).toHaveBeenCalledWith(
      `http://127.0.0.1:8000/api/users/${component.userId}`,
      JSON.stringify(component.passwordForm.value),
      { headers: { Authorization: 'Bearer ' + component.jwt, 'Content-Type': 'application/merge-patch+json' } }
    );
  });
  
  it('devrait afficher un message en cas de problème lors de la soumission', () => {
    component.userId = '1';
    component.jwt = 'valid.jwt.token';
    component.passwordForm.setValue({
      plainPassword: 'Password123!',
      cpw: 'Password123!', 
      honneypot: ''
    });
  
    cleanDataServiceSpy.cleanObject.and.returnValue(component.passwordForm.value);
  
    const httpSpy = spyOn(component.http, 'patch').and.returnValue(throwError(() => new Error('Error')));
  
    component.onSubmit();
  
    expect(loaderServiceSpy.show).toHaveBeenCalled();
    expect(loaderServiceSpy.hide).toHaveBeenCalled();
    expect(component.msg).toBe("Une erreur s'est produite. Veuillez réessayer plus tard.");
    expect(component.style_class).toContain('text-warning-emphasis');
  });
  
  
});

