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

  nb_questions?: any
  numbers: number[] = []
  

  ngOnInit(){

    this.nb_questions = sessionStorage.getItem('nb_questions');
    this.nb_questions ? parseInt(this.nb_questions) : []

    console.log(this.nb_questions)

    this.generateInputs(this.nb_questions)
    
  }

  generateInputs(count: number) {
    for (let i = 1; i <= count; i++) {
      this.numbers.push(i);
    }
  }

}
