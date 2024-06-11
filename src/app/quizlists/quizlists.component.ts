import { Component, inject } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { HttpClient } from '@angular/common/http';
import { Quiz } from '../models/quiz.type';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-quizlists',
  standalone: true,
  imports: [NavbarComponent, RouterLink],
  templateUrl: './quizlists.component.html',
  styleUrl: './quizlists.component.scss'
})
export class QuizlistsComponent {
  quizlists_title = 'Listes des quizs';
  listQuiz: Quiz[] = [];
  http: HttpClient = inject(HttpClient);

  ngOnInit() {
    const jwt = localStorage.getItem('jwt');
    console.log('JWT:', jwt);

    if (jwt != null) {
      this.http
        .get<any>('http://127.0.0.1:8000/api/quizzes', { headers: { Authorization: 'Bearer ' + jwt } })
        .subscribe(
          (response) => {
            console.log('API Response:', response);
            if (Array.isArray(response)) {
              this.listQuiz = response;
            } else if (response['hydra:member']) {
              this.listQuiz = response['hydra:member'];
            } else {
              console.error('Unexpected response format', response);
            }
          },
          (error) => {
            console.error(error);
          }
        );
    }
  }

  trackById(index: number, item: Quiz): string {
    return item.id;
  }
}
