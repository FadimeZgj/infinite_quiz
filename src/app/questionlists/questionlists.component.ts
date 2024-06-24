import { Component, inject } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Quiz } from '../models/quiz.type';

@Component({
  selector: 'app-questionlists',
  standalone: true,
  imports: [NavbarComponent, RouterLink],
  templateUrl: './questionlists.component.html',
  styleUrl: './questionlists.component.scss'
})
export class QuestionlistsComponent {
  questionlists_title="Titre du quiz"

  http: HttpClient = inject(HttpClient);
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  questionList: Quiz[] = []
  questionTitles: any[] = []
  quizId = this.route.snapshot.paramMap.get('id');
  

  ngOnInit(){

    this.getQuestionList()

    const jwt = localStorage.getItem('jwt');


    if (!jwt) {
      console.error("Accès non autorisé");
      this.router.navigateByUrl(`/login`);
    }

    if (!this.quizId) {
      console.error("Le quiz n'existe pas");
      this.router.navigateByUrl(`/addquiz`);
    }

    this.getQuizTitle()

  }

  getQuizTitle(){
    const jwt = localStorage.getItem('jwt');
    this.http
    .get(`http://127.0.0.1:8000/api/quizzes/${this.quizId}`, { headers: { Authorization: 'Bearer ' + jwt } })
    .subscribe((response:any) => {
      this.questionlists_title = response.title;
    })
  }

  getQuestionList(){
    const jwt = localStorage.getItem('jwt');
    this.http
    .get(`http://127.0.0.1:8000/api/quizzes/${this.quizId}`, { headers: { Authorization: 'Bearer ' + jwt } })
    .subscribe((response:any) => {
      this.questionList = response.question;
      this.getQuestions(); // Récupérer les détails des questions
    })
    
  }

  getQuestions() {
    const jwt = localStorage.getItem('jwt');
    const requests = this.questionList.map(url =>
      this.http.get(`http://127.0.0.1:8000${url}`, { headers: { Authorization: 'Bearer ' + jwt } })
    );

    // Exécuter toutes les requêtes en parallèle et traiter les réponses
    Promise.all(requests.map(request => request.toPromise()))
      .then(responses => {
        this.questionTitles = responses.map((response: any) => response.question);
      })
      .catch(error => {
        console.error('Error fetching question details:', error);
      });
  }

  onDeleteQuiz(){
    const jwt = localStorage.getItem('jwt');
    if (this.quizId) {
      this.http
      .delete(`http://127.0.0.1:8000/api/quizzes/${this.quizId}`, { headers: { Authorization: 'Bearer ' + jwt } } )
      .subscribe(() => {
        console.log('Quiz deleted successfully');
        this.router.navigate(['/quizlists']);
      }, error => {
        console.error('Error deleting quiz:', error);
      });
    }
  }

}
