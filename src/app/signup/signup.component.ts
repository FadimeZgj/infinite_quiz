import { HttpClient} from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

  http : HttpClient =inject(HttpClient);
  router : Router = inject(Router);
  error_msg:string="";

  signUpForm = new FormGroup({
    firstname: new FormControl('', [Validators.required, ]),
    email: new FormControl('',[Validators.required, Validators.email]),
    plainPassword:  new FormControl('', [Validators.required]),
    // plainPassword:  new FormControl('', [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*+_'-]).{12,}$/)]),
    cpw: new FormControl('', [Validators.required, ]),
    honneypot: new FormControl(''),
  });

  onSubmit() {
    if (this.error_msg) {
      this.error_msg=""
      console.log("check");
    }
    console.log('click');
    
    const formInputs=this.signUpForm.value
    
    if (formInputs['honneypot']) {
      this.router.navigateByUrl('/login');
    } else {
      if (formInputs['plainPassword']!=formInputs['cpw']) {
        this.error_msg="La confirmation ne correspond pas au mot de passe entré."
      } else if(this.signUpForm.invalid)
        {
          this.error_msg="La confirmation ne correspond pas au mot de passe entré."
        }
      else{
  
        delete formInputs['cpw']
        
        const user={username:formInputs['email'], password:formInputs['plainPassword'], honneypot:formInputs['honneypot']}
  
        this.http.post<any>('http://127.0.0.1:8000/api/users',JSON.stringify(this.signUpForm.value), {headers: {'Content-Type': 'application/ld+json' }}).subscribe({
          next: (resp) =>{
         
          console.log("inscrit");
          this.http.post<any>('http://127.0.0.1:8000/api/login_check',JSON.stringify(user), {headers: {'Content-Type': 'application/ld+json' }}).subscribe({
            next: (resp) =>{
            localStorage.setItem('jwt', resp.token);
           this.router.navigateByUrl('/dashboard');
            
          }, error: (err)=>{this.error_msg="Le formulaire n'est pas conforme. Veuillez réessayer."}})
                
        },
        error: (err)=>{this.error_msg="Le formulaire n'est pas conforme. Veuillez réessayer."}})
        
      }
  
  
  
      // invalid permet de vérifier s'il y a eu au moins une erreur dans le formGroup
      // console.log(this.signUpForm.invalid);
      //le ? c pour que Typsecript ne mette pas une erreur car au départ l'erreur est null et ['pattern'] fait référence au validator plus haut
      // console.log(this.signUpForm.controls.pw.errors?.['pattern']);
      
  
    }
    
    }
    
}