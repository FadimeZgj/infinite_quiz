import { Component, inject } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CleanDataService } from '../services/cleanDataService/clean-data.service';
import { LoaderService } from '../services/loaderService/loader.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [NavbarComponent,ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {

  constructor(private CleanDataService: CleanDataService,
    private loaderService: LoaderService
  ) {}

  formBuilder: FormBuilder = inject(FormBuilder);
  http: HttpClient = inject(HttpClient);
  router: Router = inject(Router);
  

  jwt:string | null  = localStorage.getItem('jwt');
  changePw_title="Modifier mon mot de passe"
  msg=""
  style_class=""
  userId?:string;
  user_name?:string;
  user_email?:string;
  noMatch : boolean = false

  passwordForm = new FormGroup ({
    // plainPassword:  new FormControl('', [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[\!"\#\$\%\&\'\(\)\*\+\,\-\.\/\:\;\<\=\>\?\@\[\\\]\^\_\`\{\|\}\~]).{12,}$/)]),
    plainPassword:  new FormControl('', [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[\!"\#\$\%\&\'\(\)\*\+\,\-\.\/\:\;\<\=\>\?\@\[\\\]\^\_\`\{\|\}\~])/)]),
    cpw: new FormControl('', [Validators.required]),
    honneypot: new FormControl(''),
  });

  ngOnInit(): void {
    this.loaderService.show();
    const encryptData = sessionStorage.getItem('userInfo');
    if (this.jwt?.split('.').length === 3 && encryptData) {
      this.loaderService.show();
      const secretKey = CryptoJS.SHA256(this.jwt).toString();
      
      const decryptData = CryptoJS.AES.decrypt(encryptData, secretKey);
      const userInfos = JSON.parse(decryptData.toString(CryptoJS.enc.Utf8));

      this.userId=userInfos.id;

      this.loaderService.hide();

    } else{
      this.loaderService.hide();
      this.router.navigateByUrl('/login');
    }
  }

  onSubmit() {
    this.loaderService.show();
    this.noMatch=false
    let formInputs=this.CleanDataService.cleanObject(this.passwordForm.value)

    if (formInputs['plainPassword']!=formInputs['cpw']) {
      this.loaderService.hide();
      this.noMatch = true;
    } 
    else if(!formInputs['honneypot'] && formInputs['honneypot'].length==0 && this.passwordForm.valid){
      delete formInputs['cpw'];
  
      this.http.patch(`http://127.0.0.1:8000/api/users/${this.userId}`,JSON.stringify(formInputs),{ headers: { Authorization: 'Bearer ' + this.jwt, 'Content-Type': 'application/merge-patch+json' } })
      .subscribe({
        
        next: (response: any) => {
        this.msg="Modifications réalisées avec succès"
        this.style_class="p-3 text-success-emphasis bg-success-subtle border border-success rounded-3",
        this.loaderService.hide()     
      },
      error: (err)=>{this.msg="Une erreur s'est produite. Veuillez réessayer plus tard.", 
        this.style_class="p-3 text-warning-emphasis bg-warning border border-warning-subtle rounded-3",
        this.loaderService.hide()}
      });

      }
    
    else{
      this.loaderService.hide();
      this.router.navigateByUrl('/login');
      
    }


  }

}
