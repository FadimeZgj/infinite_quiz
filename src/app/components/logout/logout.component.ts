import { Component, inject } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { LoaderService } from '../../services/loaderService/loader.service';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { jwtDecode } from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { JwtService } from '../../services/jwtServices/jwt.service';


@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent {
  constructor(
    private meta: Meta,
    private title: Title,
    private loaderService: LoaderService,
    private jwtService: JwtService
  ) {}

  private setMetaData() {
    this.title.setTitle('Déconnexion - Infinite Quiz');
    this.meta.addTags([
      { name: 'description', content: 'Déconnectez-vous de votre compte. Assurez-vous de sauvegarder vos données avant de quitter.' },
      { name: 'robots', content: 'noindex, nofollow' } // Empêche l'indexation de cette page
    ]);
  }

  router: Router = inject(Router);
  http : HttpClient =inject(HttpClient);

  logout_title="Mon profil"
  jwt:any=localStorage.getItem('jwt')
  user_name ="";
  user_email="";
  user_badge="";
  user_avatar ="https://api.dicebear.com/9.x/fun-emoji/svg?size=120&scale=90&radius=15&backgroundColor=059ff2,71cf62,d84be5,fcbc34&mouth=cute,kissHeart,lilSmile,pissed,shout,smileLol,smileTeeth,tongueOut,wideSmile"

  ngOnInit(): void {
    this.setMetaData();

    this.loaderService.show();

    if(this.jwt?.split('.').length === 3 && this.jwt){
      
      const decodedToken = this.jwtService.decode(this.jwt);
    
      this.http.get<any>(`http://127.0.0.1:8000/api/users?email=${decodedToken?.username}`, { headers: { Authorization: 'Bearer ' + this.jwt} })
              .subscribe({
                
                next: (response: any) => {

                  this.user_name=response['hydra:member'][0]['firstname'];
                  this.user_email=response['hydra:member'][0]['email'];
                  this.user_badge=response['hydra:member'][0]['badge'];
                  this.loaderService.hide();
                
              },
              error: (err)=>{this.user_name=decodedToken?.username, this.loaderService.hide()}
              })
             

    } else{
      this.loaderService.hide();
      localStorage.removeItem('jwt');
      this.router.navigateByUrl('/login');
    }
  }

  onSubmit() {
    localStorage.removeItem('jwt');
    this.router.navigateByUrl('/login');
   }
    
  //  Dans le cas où l'api ne fourni pas d'image j'applique image par defaut
   onError(){
    this.user_avatar="/assets/images/logo.png"
   }
  }


