import { Component, inject } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-start-game',
  standalone: true,
  imports: [NavbarComponent, RouterLink],
  templateUrl: './start-game.component.html',
  styleUrl: './start-game.component.scss'
})
export class StartGameComponent {
  start_game_title="Nom du quiz"

  http: HttpClient = inject(HttpClient);
  route: ActivatedRoute = inject(ActivatedRoute);
  quizId = this.route.snapshot.paramMap.get('quizId');

  ngOnInit(){
    this.getQuizTitle()
  }

  getQuizTitle(){
    const jwt = localStorage.getItem('jwt');
    this.http
    .get(`http://127.0.0.1:8000/api/quizzes/${this.quizId}`, { headers: { Authorization: 'Bearer ' + jwt } })
    .subscribe((response:any) => {
      this.start_game_title = response.title;
    })
  }

  onBeginGame() {
   
  }
}
