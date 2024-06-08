import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-informations',
  standalone: true,
  imports: [NavbarComponent,ReactiveFormsModule],
  templateUrl: './user-informations.component.html',
  styleUrl: './user-informations.component.scss'
})
export class UserInformationsComponent {
  user_information="Mes informations"
  user_name="Satoru"
  user_email="satoru@gojo.fr"

  noMatch : boolean = false

  userForm = new FormGroup({
    firstname: new FormControl('', [Validators.required, ]),
    email: new FormControl('',[Validators.required, Validators.email]),
    robbot: new FormControl(''),
  });

  onSubmit() {
    let formInputs=this.userForm.value
    
    if(this.userForm.invalid)
      {
        return false
      }
      else if (formInputs['robbot']?.length !=0) {
        window.location.reload();
        return false;
      }
    
    else{
      console.log(this.userForm.value);
    }

    return false


  }

}
