import { Component, inject } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [NavbarComponent, RouterLink],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.scss'
})
export class SettingComponent {
  http: HttpClient = inject(HttpClient);
  router: Router = inject(Router);
  setting_title="Paramètres"
  message = "Vous allez supprimer votre compte ?"
  style_class = "fs-1 text-center text-danger"

  onDelete(){

      const jwt:any = localStorage.getItem('jwt');

      // je récupère l'utilisateur conecté via le token
      const decodedToken: any = jwtDecode(jwt);
      const username = decodedToken?.username;

      if (jwt) {

        this.http.get(`http://127.0.0.1:8000/api/users?email=${username}`, { headers: { Authorization: 'Bearer ' + jwt } })
      .subscribe({
        
        next: (response: any) => {
        
        const userId = response['hydra:member'][0]?.id;

        this.http.delete(`http://127.0.0.1:8000/api/users/${userId}`, { headers: { Authorization: 'Bearer ' + jwt} })
        .subscribe((response: any) => {
        localStorage.removeItem("jwt");
        this.router.navigateByUrl('/signup');
        
        })
      },
      error: (err)=>{this.message="Une erreur s'est produite. Veuillez réessayer plus tard.", this.style_class="p-3 text-warning-emphasis bg-warning border border-warning-subtle rounded-3"}
      })
        
        
      }

    }
  
}
