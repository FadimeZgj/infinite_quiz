import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CleanDataService } from '../../services/cleanDataService/clean-data.service';
import { LoaderService } from '../../services/loaderService/loader.service';
import * as CryptoJS from 'crypto-js';
import { SessionDestroyService } from '../../services/sessionDestroyService/session-destroy.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-user-informations',
  standalone: true,
  imports: [NavbarComponent,ReactiveFormsModule],
  templateUrl: './user-informations.component.html',
  styleUrl: './user-informations.component.scss'
})
export class UserInformationsComponent implements OnInit {

  constructor(
    private meta: Meta,
    private title: Title,
    private CleanDataService: CleanDataService,
    private loaderService: LoaderService,
    private sessionDestroyService: SessionDestroyService
  ) {}
  
  formBuilder: FormBuilder = inject(FormBuilder);
  http: HttpClient = inject(HttpClient);
  router: Router = inject(Router);

  private setMetaData() {
    this.title.setTitle('Modification des Informations - Infinite Quiz');
    this.meta.addTags([
      { name: 'description', content: 'Modifiez vos informations personnelles dans votre espace utilisateur. Assurez-vous que vos données sont à jour et exactes.' },
      { name: 'robots', content: 'noindex, nofollow' } // Ne pas indexer cette page
    ]);
  }

  user_information="Mes informations";
  msg = "";
  style_class ="";
  userId =""
  user_name ="";
  user_email = "";
  jwt = localStorage.getItem('jwt');
  
  userForm  = this.formBuilder.group({
    firstname: [''],
    email: ['',[Validators.email]],
    honneypot: [''],
  });

  ngOnInit(): void {
    this.setMetaData();
    
    const encryptData = sessionStorage.getItem('userInfo');
    if (this.jwt?.split('.').length === 3 && encryptData) {
      this.loaderService.show();
      const secretKey = CryptoJS.SHA256(this.jwt).toString();
      
      const decryptData = CryptoJS.AES.decrypt(encryptData, secretKey);
      const userInfos = JSON.parse(decryptData.toString(CryptoJS.enc.Utf8));
      console.log(userInfos);

      this.userId=userInfos.id;
      this.user_email=userInfos.email;
      this.user_name=userInfos.firstname;

      // patchValue permet de définir des valeurs initiale pour ces champs du formulaire
      this.userForm.patchValue({
        firstname: this.user_name,
        email: this.user_email
    })
      this.loaderService.hide();

    } else{
      this.loaderService.hide();
      this.sessionDestroyService.sessionDestroy();
      this.router.navigateByUrl('/login');
    }
  }

  
  onSubmit() {
    this.loaderService.show();
    const formInputs = this.CleanDataService.cleanObject(this.userForm.value)

    if (this.userForm.invalid) {
      this.loaderService.hide()
    }
    else if (!formInputs['honneypot'] && formInputs['honneypot'].length==0) {

      formInputs['email']= formInputs['email']?formInputs['email'] : this.user_email
      formInputs['firstname']= formInputs['firstname']?formInputs['firstname'] : this.user_name

      this.http.patch(`http://127.0.0.1:8000/api/users/${this.userId}`,JSON.stringify(formInputs),{ headers: { Authorization: 'Bearer ' + this.jwt, 'Content-Type': 'application/merge-patch+json' } })
   .subscribe({
     
     next: (response: any) => {
      this.msg="Modifications réalisées avec succès"
      this.style_class="p-3 text-success-emphasis bg-success-subtle border border-success rounded-3",
      this.loaderService.hide()     
   },
   error: (err)=>{this.msg="Une erreur s'est produite. Veuillez réessayer plus tard.", 
                  this.style_class="p-3 text-warning-emphasis bg-warning border border-warning-subtle rounded-3",
                  this.loaderService.hide()
                }
   })
     
   } else {
    this.loaderService.hide();
    this.sessionDestroyService.sessionDestroy();
    this.router.navigateByUrl('/login');
   }
    
  }

}
