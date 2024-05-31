import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-addquestion',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './addquestion.component.html',
  styleUrl: './addquestion.component.scss'
})
export class AddquestionComponent {
  addQuestion_title = "titre du quiz"
}
