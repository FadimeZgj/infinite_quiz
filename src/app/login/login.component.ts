import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CleanDataService } from '../services/cleanDataService/clean-data.service';
import * as CryptoJS from 'crypto-js';
import { LoaderService } from '../services/loaderService/loader.service';
import { SessionDestroyService } from '../services/sessionDestroyService/session-destroy.service';
import { Meta, Title } from '@angular/platform-browser';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(
    private meta: Meta,
    private title: Title,
    private CleanDataService: CleanDataService,
    private loaderService: LoaderService,
    private sessionDestroyService: SessionDestroyService
  ) {}

  private setMetaData() {
    this.title.setTitle('Login - Créez vos quiz facilement avec Infinite Quiz');
    this.meta.addTags([
      { name: 'description', content: 'Connectez-vous pour accéder à vos quiz et commencer à créer de nouveaux défis. Découvrez comment créer des quiz amusants et engageants.' },
      { name: 'keywords', content: 'connexion, quiz, création de quiz, gestion de quiz' },
      { name: 'robots', content: 'index, follow' } // Permet l'indexation de la page de bienvenue
    ]);
  }

  http : HttpClient =inject(HttpClient);
  router: Router = inject(Router);
  user_msg : string = "";

  loginForm = new FormGroup({
    username: new FormControl(''),
    password:  new FormControl(''),
    honneypot: new FormControl(''),
  });

  ngOnInit(): void {
    this.setMetaData();
  }

  onSubmit() {
    this.loaderService.show();
    const form=this.CleanDataService.cleanObject(this.loginForm.value)

    if (!form['honneypot'] && form['honneypot'].length==0) {
      
      this.http.post<any>('http://127.0.0.1:8000/api/login_check',JSON.stringify(form), {headers: {'Content-Type': 'application/ld+json' }})
      .subscribe({
        next :  (resp) => {
          
        if (resp) {
          localStorage.setItem('jwt', resp.token);

          this.http.get<any>(`http://127.0.0.1:8000/api/users?email=${form['username']}`, { headers: { Authorization: 'Bearer ' + resp.token } })
          .subscribe({
            
            next: (response: any) => {
              
            // création de la clé de décriptage grace à l'algorithme de hashage SHA256 qui fourni un hashe de 32 octet( taille max autorisé pour une clé)
            // cela permet également de ce défaire des caractères spéciaux pouvant être présent dans le jwt 
            const secretKey = CryptoJS.SHA256(resp.token).toString();
            const encryptData = CryptoJS.AES.encrypt(JSON.stringify(response['hydra:member'][0]), secretKey).toString();
            sessionStorage.setItem('userInfo', encryptData);

            this.loaderService.hide();
            this.router.navigateByUrl('/dashboard');
          },
          error: (err)=>{this.user_msg="Une erreur s'est produite. Veuillez réessayer plus tard.", this.loaderService.hide()}
          })
          
        } 
  
      },

      error: (err)=>{this.user_msg="l'email ou le mot de passe est incorrect",this.loaderService.hide()},
      }

    ) 
    } else {
      this.sessionDestroyService.sessionDestroy();
      this.router.navigateByUrl('/login');
    }
    
  }
  
}