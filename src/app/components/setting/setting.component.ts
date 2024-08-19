import { Component, inject } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [NavbarComponent, RouterLink],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.scss'
})
export class SettingComponent {
  constructor(
    private meta: Meta,
    private title: Title,
  ) {}

  private setMetaData() {
    this.title.setTitle('Paramètres de compte - Infinite Quiz');
    this.meta.addTags([
      { name: 'description', content: 'Gérez vos paramètres de compte et supprimez votre compte si nécessaire. Assurez-vous de sauvegarder vos données avant la suppression.' },
      { name: 'robots', content: 'noindex, nofollow' } // Empêche l'indexation de cette page, car elle est privée
    ]);
  }

  http: HttpClient = inject(HttpClient);
  router: Router = inject(Router);
  setting_title="Paramètres"
  message = "Vous allez supprimer votre compte ?"
  style_class = "fs-1 text-center text-danger"

  ngOnInit(): void {
    this.setMetaData();
  }


  onDelete(){

      const jwt:any = localStorage.getItem('jwt');

      // je récupère l'utilisateur conecté via le token
      const decodedToken: any = jwtDecode(jwt);
      const username = decodedToken?.username;

      if (jwt && jwt.split('.').length === 3) {

        this.http.get(`http://127.0.0.1:8000/api/users?email=${username}`, { headers: { Authorization: 'Bearer ' + jwt } })
      .subscribe({
        
        next: (response: any) => {
        
        const userId = response['hydra:member'][0]?.id;

        this.http.delete(`http://127.0.0.1:8000/api/users/${userId}`, { headers: { Authorization: 'Bearer ' + jwt} })
        .subscribe((response: any) => {
        localStorage.removeItem('jwt');
        this.router.navigateByUrl('/signup');
        
        })
      },
      error: (err)=>{this.message="Une erreur s'est produite. Veuillez réessayer plus tard.", this.style_class="p-3 text-warning-emphasis bg-warning border border-warning-subtle rounded-3"}
      })
        
        
      }

    }
  
}
