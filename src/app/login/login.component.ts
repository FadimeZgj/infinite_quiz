import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {

  http : HttpClient =inject(HttpClient);
  router: Router = inject(Router);
  user_msg!: string;

  loginForm = new FormGroup({
    username: new FormControl(''),
    password:  new FormControl(''),
    honneypot: new FormControl(''),
  });

  onSubmit() {
    const form=this.loginForm.value
    if (!form['honneypot']) {
      
      this.http.post<any>('http://127.0.0.1:8000/api/login_check',JSON.stringify(form), {headers: {'Content-Type': 'application/ld+json' }})
      .subscribe({
        next :  (resp) => {
          console.log(resp);
        if (resp) {
          localStorage.setItem('jwt', resp.token);
          this.router.navigateByUrl('/dashboard');
        } 
          
      },

      error: (err)=>{this.user_msg="l'email ou le mot de passe est incorrect"},
      }

    ) 
    } else {
      this.router.navigateByUrl('/login');
    }
    console.log(this.loginForm.value);
  }
  
}