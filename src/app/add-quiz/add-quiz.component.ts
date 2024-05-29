import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-add-quiz',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './add-quiz.component.html',
  styleUrl: './add-quiz.component.scss'
})
export class AddQuizComponent {
 addQuiz_title = "Créer un quiz"
}
