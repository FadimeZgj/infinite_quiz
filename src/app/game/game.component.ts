import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {
  quiz_title="nom du quiz"
  question="Question"
  proposition_1="Insidias nocendum paria in prodiderat regiae Constantina inpositam ut indicanda insidias per palatium obscurissimis ei"
  proposition_2="Insidias nocendum paria in prodiderat regiae Constantina inpositam ut indicanda insidias per palatium obscurissimis ei"
  proposition_3="Insidias nocendum paria in prodiderat regiae Constantina inpositam ut indicanda insidias per palatium obscurissimis ei"
  proposition_4="Insidias nocendum paria in prodiderat regiae Constantina inpositam ut indicanda insidias per palatium obscurissimis ei"

}
