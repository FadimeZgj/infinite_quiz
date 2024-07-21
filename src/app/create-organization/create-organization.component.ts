import { Component, inject } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-create-organization',
  standalone: true,
  imports: [NavbarComponent,ReactiveFormsModule],
  templateUrl: './create-organization.component.html',
  styleUrl: './create-organization.component.scss'
})
export class CreateOrganizationComponent {

  formBuilder: FormBuilder = inject(FormBuilder);
  http: HttpClient = inject(HttpClient);
  router: Router = inject(Router);

  organization_title="Créer votre espace structure"

  organizationForm : FormGroup = this.formBuilder.group({
    name : ['', [Validators.required, ]],
    country : ['', [Validators.required, ]],
  });

  onSubmit() {
    const jwt:any = localStorage.getItem('jwt');
    console.log('JWT:', jwt);

    // je récupère l'utilisateur conecté via le token
    const decodedToken: any = jwtDecode(jwt);
    const username = decodedToken?.username;

    if (this.organizationForm.valid && jwt) {

       this.http.get(`http://127.0.0.1:8000/api/users?email=${username}`, { headers: { Authorization: 'Bearer ' + jwt } })
    .subscribe({
      
      next: (response: any) => {
      console.log(response);
      
      const userId = response['hydra:member'][0]?.id;
      console.log(userId);

      const organizationValue = {
        ...this.organizationForm.value,
        user: [`http://127.0.0.1:8000/api/users/${userId}`]
      };

      // console.log(organizationValue);
      
    
      this.http.post(`http://127.0.0.1:8000/api/organizations`,JSON.stringify(organizationValue),{ headers: { Authorization: 'Bearer ' + jwt, 'Content-Type': 'application/ld+json' } })
      .subscribe((response: any) => {
      console.log(response);
      // this.router.navigateByUrl('/stafflist');

      
      })
    },
    error: (err)=>{}
    })
      



      
    }

  }
}

    