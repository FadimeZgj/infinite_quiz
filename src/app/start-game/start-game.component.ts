import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-start-game',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './start-game.component.html',
  styleUrl: './start-game.component.scss'
})
export class StartGameComponent {
  start_game_title="Nom du quiz"


}
