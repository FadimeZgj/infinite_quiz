import { HttpClient} from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CleanDataService } from '../../services/cleanDataService/clean-data.service';
import { LoaderService } from '../../services/loaderService/loader.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

  constructor(
    private meta: Meta,
    private title: Title,
    private CleanDataService: CleanDataService,
    private loaderService: LoaderService,
  ) {}

  private setMetaData() {
    this.title.setTitle('Inscription - Créez vos quiz facilement avec Infinite Quiz');
    this.meta.addTags([
      { name: 'description', content: 'Inscrivez-vous pour accéder à notre service. Remplissez le formulaire d’inscription avec vos informations personnelles pour créer un compte.' },
      { name: 'keywords', content: 'inscription, quiz, création de quiz, gestion de quiz' },
      { name: 'robots', content: 'index, follow' } // Permet l'indexation de cette page
    ]);
  }

  http : HttpClient =inject(HttpClient);
  router : Router = inject(Router);
  error_msg:string="";

  signUpForm = new FormGroup({
    firstname: new FormControl('', [Validators.required, ]),
    email: new FormControl('',[Validators.required, Validators.email]),
    plainPassword:  new FormControl('', [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[\!"\#\$\%\&\'\(\)\*\+\,\-\.\/\:\;\<\=\>\?\@\[\\\]\^\_\`\{\|\}\~])/)]),
    // plainPassword:  new FormControl('', [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[\!"\#\$\%\&\'\(\)\*\+\,\-\.\/\:\;\<\=\>\?\@\[\\\]\^\_\`\{\|\}\~]).{12,}$/)]),
    cpw: new FormControl('', [Validators.required, ]),
    honneypot: new FormControl(''),
  });

  ngOnInit(): void {
    this.setMetaData();
  }

  onSubmit() {

    this.loaderService.show();

    if (this.error_msg) {
      // Dans le cas où le formulaire a déjà été soumis je réinitialise le error_msg
      this.error_msg=""
    }

   
    const formInputs=this.CleanDataService.cleanObject(this.signUpForm.value)
        
    if (formInputs['honneypot'] && formInputs['honneypot'].length > 0) {
      this.loaderService.hide();
      localStorage.removeItem('jwt');
      this.router.navigateByUrl('/login');

    } else {

      if (formInputs['plainPassword']!=formInputs['cpw']) {
        this.loaderService.hide();
        this.error_msg="La confirmation ne correspond pas au mot de passe entré."
      } 
      
      else if(this.signUpForm.invalid)
        {
          this.loaderService.hide();        
          this.error_msg="Le formulaire n'est pas conforme."
        }

      else{
  
        delete formInputs['cpw']
        const user={username:formInputs['email'], password:formInputs['plainPassword'], honneypot:formInputs['honneypot']}
        this.http.post<any>('http://127.0.0.1:8000/api/users',JSON.stringify(formInputs), {headers: {'Content-Type': 'application/ld+json' }}).subscribe({
          next: (resp) =>{
          
            this.http.post<any>('http://127.0.0.1:8000/api/login_check',JSON.stringify(user), {headers: {'Content-Type': 'application/ld+json' }})
            .subscribe({
              next :  (resp) => {
                
                localStorage.setItem('jwt', resp.token);
                this.loaderService.hide();
                this.router.navigateByUrl('/dashboard');
        
            },
      
            error: (err)=>{this.error_msg="Une erreur s'est produite. Veuillez réessayer plus tard.",this.loaderService.hide()},
            }
      
          ) 
                
        },
        error: (err)=>{this.error_msg="Le formulaire n'est pas conforme. Veuillez réessayer.",this.loaderService.hide()}})
        
      }
  
  
  
      // invalid permet de vérifier s'il y a eu au moins une erreur dans le formGroup
      // console.log(this.signUpForm.invalid);
      //['pattern'] fait référence au validator plus haut
      // console.log(this.signUpForm.controls.pw.errors?.['pattern']);
      
  
    }
    
    }
    
}