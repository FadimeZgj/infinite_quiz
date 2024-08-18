import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.scss'
})
export class RankingComponent {
  rank_title="Classement"
  rank_number="1"
  pseudo="Pseudo"
  score="50%"
  background="background-color: #F4D06F; " //si se n'est pas le top 3 on met #DEDEE0

}
