import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-organization',
  standalone: true,
  imports: [NavbarComponent,ReactiveFormsModule],
  templateUrl: './create-organization.component.html',
  styleUrl: './create-organization.component.scss'
})
export class CreateOrganizationComponent {
  organization_title="Créer votre espace structure"

  organisationForm = new FormGroup({
    name_organization: new FormControl('', [Validators.required, ]),
    country_organization: new FormControl('', [Validators.required, ]),
    robbot: new FormControl(''),
  });

  onSubmit() {
    let formInputs=this.organisationForm.value
    
    if(this.organisationForm.invalid)
      {
        return false
      }
      else if (formInputs['robbot']?.length !=0) {
        window.location.reload();
        return false;
      }
    
    else{
      console.log(this.organisationForm.value);
    }

    return false


  }

}
