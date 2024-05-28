import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-questionlists',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './questionlists.component.html',
  styleUrl: './questionlists.component.scss'
})
export class QuestionlistsComponent {
  questionlists_title="Titre du quiz"

}
