import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-invite-players',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './invite-players.component.html',
  styleUrl: './invite-players.component.scss'
})
export class InvitePlayersComponent {
  invite_players_title="Nom du quiz"
}
