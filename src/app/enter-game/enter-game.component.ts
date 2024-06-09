import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-enter-game',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './enter-game.component.html',
  styleUrl: './enter-game.component.scss'
})
export class EnterGameComponent {
  enterGame_title="Que l'aventure commence !"
}
