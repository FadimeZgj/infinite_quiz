import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent {
  logout_title="Mon profil"
  user_name="Kento"
  user_email="kento@nanami.fr"
  user_badge="Goat"

}
