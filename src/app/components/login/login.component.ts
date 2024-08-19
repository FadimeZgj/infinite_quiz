import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CleanDataService } from '../../services/cleanDataService/clean-data.service';
import * as CryptoJS from 'crypto-js';
import { LoaderService } from '../../services/loaderService/loader.service';
import { SessionDestroyService } from '../../services/sessionDestroyService/session-destroy.service';
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

          this.loaderService.hide();
          this.router.navigateByUrl('/dashboard');
            
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