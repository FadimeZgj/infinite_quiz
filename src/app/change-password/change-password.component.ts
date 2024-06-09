import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [NavbarComponent,ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {
  changePw_title="Modifier mon mot de passe"

  noMatch : boolean = false

  passwordForm = new FormGroup({
    old_pw: new FormControl('', [Validators.required, ]),
    pw:  new FormControl('', [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{12,}$/)]),
    cpw: new FormControl('', [Validators.required, ]),
    robbot: new FormControl(''),
  });

  onSubmit() {
    let formInputs=this.passwordForm.value
    if (formInputs['pw']!=formInputs['cpw']) {
      return this.noMatch = true;
    } else if(this.passwordForm.invalid)
      {
        return false
      }
      else if (formInputs['robbot']?.length !=0) {
        window.location.reload();
        return false;
      }
    
    else{
      console.log(this.passwordForm.value);
    }

    return false


  }

}
