import { Component, inject } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { LoaderService } from '../../services/loaderService/loader.service';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { SessionDestroyService } from '../../services/sessionDestroyService/session-destroy.service';
import { Meta, Title } from '@angular/platform-browser';


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
    private sessionDestroyService: SessionDestroyService
  ) {}

  private setMetaData() {
    this.title.setTitle('Déconnexion - Infinite Quiz');
    this.meta.addTags([
      { name: 'description', content: 'Déconnectez-vous de votre compte. Assurez-vous de sauvegarder vos données avant de quitter.' },
      { name: 'robots', content: 'noindex, nofollow' } // Empêche l'indexation de cette page
    ]);
  }

  router: Router = inject(Router);

  logout_title="Mon profil"
  userId =""
  user_name ="";
  user_email = "";
  user_badge=""
  jwt = localStorage.getItem('jwt');

  ngOnInit(): void {
    this.setMetaData();

    this.loaderService.show();
    
    const encryptData = sessionStorage.getItem('userInfo');
    if (this.jwt?.split('.').length === 3 && encryptData) {
      const secretKey = CryptoJS.SHA256(this.jwt).toString();
      
      const decryptData = CryptoJS.AES.decrypt(encryptData, secretKey);
      const userInfos = JSON.parse(decryptData.toString(CryptoJS.enc.Utf8));
      
      this.userId=userInfos.id;
      this.user_email=userInfos.email;
      this.user_name=userInfos.firstname;
      this.user_badge=userInfos.badge

      this.loaderService.hide();

    } else{
      this.loaderService.hide();
      this.sessionDestroyService.sessionDestroy();
      this.router.navigateByUrl('/login');
    }
  }

  onSubmit() {
    this.sessionDestroyService.sessionDestroy();
    this.router.navigateByUrl('/login');
   }
    
  }


