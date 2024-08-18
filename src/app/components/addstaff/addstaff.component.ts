import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-addstaff',
  standalone: true,
  imports: [NavbarComponent,ReactiveFormsModule],
  templateUrl: './addstaff.component.html',
  styleUrl: './addstaff.component.scss'
})
export class AddstaffComponent {
  add_staff_title="Collaborateur"

  staff_firstname="Satoru"
  staff_lastname="Gojo"
  staff_email="satoru@gojo.fr"
  staff_departement="nom du service"
  staff_position="nom du poste occupé"

  staffForm = new FormGroup({
    firstname: new FormControl('', [Validators.required, ]),
    lastname: new FormControl('', [Validators.required, ]),
    departement: new FormControl('', [Validators.required, ]),
    position: new FormControl('', [Validators.required, ]),
    email: new FormControl('',[Validators.required, Validators.email]),
    robbot: new FormControl(''),
  });

  onSubmit() {
    let formInputs=this.staffForm.value
    if(this.staffForm.invalid)
      {
        return false
      }
      else if (formInputs['robbot']?.length !=0) {
        window.location.reload();
        return false;
      }
    
    else{
      console.log(this.staffForm.value);
    }

    return false


  }
}
