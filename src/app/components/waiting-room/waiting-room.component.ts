import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-waiting-room',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './waiting-room.component.html',
  styleUrl: './waiting-room.component.scss'
})
export class WaitingRoomComponent {
  waiting_room_title="Salle d'attente"
  number_of_players="5"

}
