import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-quizlists',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './quizlists.component.html',
  styleUrl: './quizlists.component.scss'
})
export class QuizlistsComponent {
  quizlists_title='Listes des quizs'

}
