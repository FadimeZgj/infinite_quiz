import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-score',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './score.component.html',
  styleUrl: './score.component.scss'
})
export class ScoreComponent {
  score_title=""
  background="background-color : #FBF0D1;" // ou dans le cas du perdant #E9E9EC
  msg_for_player="le rang ou s'il est gagnant ou perdant"
  team_player="nom de l'équipe"
  score="50%"

}
