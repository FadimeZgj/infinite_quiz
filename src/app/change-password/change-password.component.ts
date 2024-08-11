import { Component, inject } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtService } from '../services/jwtServices/jwt.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [NavbarComponent,ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {
  formBuilder: FormBuilder = inject(FormBuilder);
  http: HttpClient = inject(HttpClient);
  router: Router = inject(Router);
  constructor(private jwtService: JwtService) {}

  jwt:string | null  = localStorage.getItem('jwt');
  changePw_title="Modifier mon mot de passe"
  msg=""
  style_class=""
  userId?:string;
  user_name?:string;
  user_email?:string;
  noMatch : boolean = false

  passwordForm = new FormGroup ({
    // plainPassword:new FormControl('', [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{12,}$/)]),
    // plainPassword:new FormControl('', [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[ !"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~])/)]),
    cpw: new FormControl('', [Validators.required]),
    plainPassword:new FormControl('', [Validators.required]),
    honneypot: new FormControl(''),
  });

  ngOnInit(): void {

    if (this.jwt && this.jwt?.split('.').length === 3) {
    const decodedToken: any = this.jwtService.decode(this.jwt);
    console.log(decodedToken);
    
    const username = decodedToken?.username;

    this.http.get(`http://127.0.0.1:8000/api/users?email=${username}`, { headers: { Authorization: 'Bearer ' + this.jwt } })
    .subscribe({
      
      next: (response: any) => {
      console.log(response);
      
      this.userId = response['hydra:member'][0]?.id;
     
    },
    error: (err)=>{this.msg="Une erreur s'est produite. Veuillez réessayer plus tard.", this.style_class="p-3 text-warning-emphasis bg-warning border border-warning-subtle rounded-3"}
    })

    } else{
      this.router.navigateByUrl('/login');
    }
  }

  onSubmit() {
    this.noMatch=false
    let formInputs=this.passwordForm.value
    console.log(this.passwordForm.value);
    console.log('form', this.passwordForm);
    if (formInputs['plainPassword']!=formInputs['cpw']) {
      this.noMatch = true;

    } 
    else if(this.passwordForm.valid){
      delete formInputs['cpw'];
  
      this.http.patch(`http://127.0.0.1:8000/api/users/${this.userId}`,JSON.stringify(formInputs),{ headers: { Authorization: 'Bearer ' + this.jwt, 'Content-Type': 'application/merge-patch+json' } })
      .subscribe({
        
        next: (response: any) => {
        console.log(response);
        this.msg="Modifications réalisées avec succés"
        this.style_class="p-3 text-success-emphasis bg-success-subtle border border-success rounded-3"     
      },
      error: (err)=>{this.msg="Une erreur s'est produite. Veuillez réessayer plus tard.", this.style_class="p-3 text-warning-emphasis bg-warning border border-warning-subtle rounded-3"}
      });

      }
    
    else{
      this.router.navigateByUrl('/login');
      
    }


  }

}
