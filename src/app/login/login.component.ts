import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {

  loginForm = new FormGroup({
    email: new FormControl(''),
    pw:  new FormControl(''),
    robbot: new FormControl(''),
  });

  onSubmit() {
    console.log(this.loginForm.value);
  }
  
}

