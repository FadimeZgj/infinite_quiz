import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtService } from '../services/jwtServices/jwt.service';

@Component({
  selector: 'app-user-informations',
  standalone: true,
  imports: [NavbarComponent,ReactiveFormsModule],
  templateUrl: './user-informations.component.html',
  styleUrl: './user-informations.component.scss'
})
export class UserInformationsComponent implements OnInit {

  formBuilder: FormBuilder = inject(FormBuilder);
  http: HttpClient = inject(HttpClient);
  router: Router = inject(Router);
  constructor(private jwtService: JwtService) {}
  user_information="Mes informations"
  msg=""
  style_class=""
  userId?:string;
  user_name?:string;
  user_email?:string;
  jwt:string | null  = localStorage.getItem('jwt');


  ngOnInit(): void {

    if (this.jwt?.split('.').length === 3) {
    const decodedToken: any = this.jwtService.decode(this.jwt);
    console.log(decodedToken);
    
    const username = decodedToken?.username;

    this.http.get(`http://127.0.0.1:8000/api/users?email=${username}`, { headers: { Authorization: 'Bearer ' + this.jwt } })
    .subscribe({
      
      next: (response: any) => {
      console.log(response);
      
      this.userId = response['hydra:member'][0]?.id;
      this.user_name=response['hydra:member'][0]?.firstname
      this.user_email=response['hydra:member'][0]?.email;

      console.log(this.userId);

    },
    error: (err)=>{this.msg="Une erreur s'est produite. Veuillez réessayer plus tard.", this.style_class="p-3 text-warning-emphasis bg-warning border border-warning-subtle rounded-3"}
    })

    } else{
      this.router.navigateByUrl('/login');
    }
  }

  
  userForm  = this.formBuilder.group({
    firstname: [''],
    email: ['',[Validators.email]],
    honneypot: [''],
  });

  onSubmit() {
    let formInputs=this.userForm.value
    console.log(this.userForm.value);

    if (this.userForm.valid) {
      formInputs['email']= formInputs['email']?formInputs['email'] : this.user_email
      formInputs['firstname']= formInputs['firstname']?formInputs['firstname'] : this.user_name
      this.http.patch(`http://127.0.0.1:8000/api/users/${this.userId}`,JSON.stringify(formInputs),{ headers: { Authorization: 'Bearer ' + this.jwt, 'Content-Type': 'application/merge-patch+json' } })
   .subscribe({
     
     next: (response: any) => {
     console.log(response);
     this.msg="Modifications réalisées avec succés"
     this.style_class="p-3 text-success-emphasis bg-success-subtle border border-success rounded-3"     
   },
   error: (err)=>{this.msg="Une erreur s'est produite. Veuillez réessayer plus tard.", this.style_class="p-3 text-warning-emphasis bg-warning border border-warning-subtle rounded-3"}
   })
     
   } else {
    this.router.navigateByUrl('/login');
   }
    
  }

}
