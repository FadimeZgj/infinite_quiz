import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  
  noMatch : boolean = false

  signUpForm = new FormGroup({
    firstname: new FormControl('', [Validators.required, ]),
    email: new FormControl('',[Validators.required, Validators.email]),
    pw:  new FormControl('', [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{12,}$/)]),
    cpw: new FormControl('', [Validators.required, ]),
    robbot: new FormControl(''),
  });

  onSubmit() {
    let formInputs=this.signUpForm.value
    if (formInputs['pw']!=formInputs['cpw']) {
      return this.noMatch = true;
    } else if(this.signUpForm.invalid)
      {
        return false
      }
      else if (formInputs['robbot']?.length !=0) {
        window.location.reload();
        return false;
      }
    
    else{
      console.log(this.signUpForm.value);
    }

    return false



    // invalid permet de vérifier s'il y a eu au moins une erreur dans le formGroup
    // console.log(this.signUpForm.invalid);
    //le ? c pour que Typsecript ne mette pas une erreur car au départ l'erreur est null et ['pattern'] fait référence au validator plus haut
    // console.log(this.signUpForm.controls.pw.errors?.['pattern']);
    
    // console.log(this.signUpForm.value);
    // console.log(this.signUpForm);

  }

}
