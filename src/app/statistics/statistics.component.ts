import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss'
})
export class StatisticsComponent {
  statistics_title="Statistiques"

  quiz_title="titre quiz"
  date_game="date de la partie"
  profil="../../assets/images/logo-navbar.png"
  pseudo="Pseudo"
  score="50%"


}
