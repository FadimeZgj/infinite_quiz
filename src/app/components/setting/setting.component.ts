import { Component, inject } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { Meta, Title } from '@angular/platform-browser';
import { LoaderService } from '../../services/loaderService/loader.service';
import { JwtService } from '../../services/jwtServices/jwt.service';

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
    private loaderService: LoaderService,
    private jwtService: JwtService
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
    this.loaderService.show()  
      const jwt:any = localStorage.getItem('jwt');

      if (jwt && jwt.split('.').length === 3) {

        const decodedToken: any = this.jwtService.decode(jwt);
        const username = decodedToken?.username;

        this.http.get(`http://127.0.0.1:8000/api/users?email=${username}`, { headers: { Authorization: 'Bearer ' + jwt } })
      .subscribe({
        
        next: (response: any) => {
        
          const userId = response['hydra:member'][0]?.id;

          const anonymous = {    
            "email": `user${userId}@anonyme.com`,
            "firstname": "anonyme",
            "lastname": "anonyme",
            "service": "anonyme",
            "job": "anonyme",      
          }

            this.http.patch(`http://127.0.0.1:8000/api/users/${userId}`,JSON.stringify(anonymous),{ headers: { Authorization: 'Bearer ' + jwt, 'Content-Type': 'application/merge-patch+json' } })
          .subscribe({
            
            next: (response: any) => {
              this.loaderService.hide()
              localStorage.removeItem('jwt');

              // La div de fond de la modal reste après la redirection
              // Pour éviter cela je la supprime
              const backdropElement = document.querySelector('.modal-backdrop');
              if (backdropElement) {
                backdropElement.remove();
              }

              this.router.navigateByUrl('/signup');
                  
          },
          error: (err)=>{this.message="Une erreur s'est produite. Veuillez réessayer plus tard.", 
                          this.style_class="p-3 text-warning-emphasis bg-warning border border-warning-subtle rounded-3",
                          this.loaderService.hide()
                        }
          })

      },
      error: (err)=>{this.message="Une erreur s'est produite. Veuillez réessayer plus tard.", 
        this.style_class="p-3 text-warning-emphasis bg-warning border border-warning-subtle rounded-3",
        this.loaderService.hide()}
      })
        
        
      }

    }
  
}
