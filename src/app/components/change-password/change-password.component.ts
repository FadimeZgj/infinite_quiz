import { Component, inject } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { CleanDataService } from '../../services/cleanDataService/clean-data.service';
import { LoaderService } from '../../services/loaderService/loader.service';
import { Meta, Title } from '@angular/platform-browser';
import { JwtService } from '../../services/jwtServices/jwt.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [NavbarComponent,ReactiveFormsModule,RouterLink],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {

  constructor(
    private meta: Meta,
    private title: Title,
    private CleanDataService: CleanDataService,
    private loaderService: LoaderService,
    private jwtService: JwtService
  ) {}

  private setMetaData() {
    this.title.setTitle('Modifier mon mot de passe - Infinite Quiz');
    this.meta.addTags([
      { name: 'description', content: 'Modifiez votre mot de passe pour votre compte sur notre application. Assurez-vous de choisir un mot de passe fort et sécurisé.' },
      { name: 'robots', content: 'noindex, nofollow' } // Empêche l'indexation de cette page, car elle est privée
    ]);
  }

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
    plainPassword:  new FormControl('', [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[\!"\#\$\%\&\'\(\)\*\+\,\-\.\/\:\;\<\=\>\?\@\[\\\]\^\_\`\{\|\}\~]).{12,}$/)]),
    // plainPassword:  new FormControl('', [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[\!"\#\$\%\&\'\(\)\*\+\,\-\.\/\:\;\<\=\>\?\@\[\\\]\^\_\`\{\|\}\~])/)]),
    cpw: new FormControl('', [Validators.required]),
    honneypot: new FormControl(''),
  });

  ngOnInit(): void {
    this.setMetaData();

    this.loaderService.show();

    if (this.jwt?.split('.').length === 3 && this.jwt) {

      this.loaderService.show();

      const decodedToken = this.jwtService.decode(this.jwt);

      this.http.get<any>(`http://127.0.0.1:8000/api/users?email=${decodedToken?.username}`, { headers: { Authorization: 'Bearer ' + this.jwt } })
      .subscribe({
        
        next: (response: any) => {
      
        this.userId=response['hydra:member'][0]?.id;
        this.loaderService.hide();

      },
      error: (err)=>{this.msg="Une erreur s'est produite. Veuillez réessayer plus tard.", 
        this.style_class="p-3 text-warning-emphasis bg-warning border border-warning-subtle rounded-3",
        this.loaderService.hide();
      }
      })


    } else{
      this.loaderService.hide();
      localStorage.removeItem('jwt');
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
      localStorage.removeItem('jwt');
      this.router.navigateByUrl('/login');
      
    }


  }

}
