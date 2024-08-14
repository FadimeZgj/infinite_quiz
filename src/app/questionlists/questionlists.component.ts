import { Component, inject } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Quiz } from '../models/quiz.type';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-questionlists',
  standalone: true,
  imports: [NavbarComponent, RouterLink],
  templateUrl: './questionlists.component.html',
  styleUrl: './questionlists.component.scss',
})
export class QuestionlistsComponent {
  questionlists_title = 'Titre du quiz'; // Titre de la liste des questions

  // Injection des services nécessaires pour le composant
  http: HttpClient = inject(HttpClient);
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);

  // Variables pour stocker les données du composant
  questionList: Quiz[] = []; // Liste des questions du quiz
  questionTitles: any[] = []; // Titres des questions
  quizId: string | undefined | null =
    this.route.snapshot.firstChild?.paramMap.get('id'); // ID du quiz obtenu depuis les paramètres de la route
  jwt: any = localStorage.getItem('jwt'); // Récupération du token JWT stocké localement
  selectedQuestionDetails: any; // Variable pour stocker les détails de la question sélectionnée
  selectedQuestionResponses: any[] = []; // Variable pour stocker les réponses de la question sélectionnée

  // Méthode appelée au chargement du composant
  ngOnInit() {
    // Vérification de la présence du JWT et de l'ID du quiz
    if (!this.jwt) {
      console.error('Accès non autorisé'); // Affichage d'une erreur si le JWT est absent
      this.router.navigateByUrl(`/login`); // Redirection vers la page de connexion
      return; // Arrêt de l'exécution de la méthode si JWT est absent
    }

    if (!this.quizId) {
      console.error("Le quiz n'existe pas"); // Affichage d'une erreur si l'ID du quiz est absent
      this.router.navigateByUrl(`/addquiz`); // Redirection vers la page d'ajout de quiz
      return; // Arrêt de l'exécution de la méthode si l'ID du quiz est absent
    }

    // Appel des méthodes pour récupérer les détails du quiz et des questions
    this.getQuizTitle();
    this.getQuestionList();
  }

  // Méthode pour récupérer le titre du quiz
  getQuizTitle() {
    this.http
      .get(`http://127.0.0.1:8000/api/quizzes/${this.quizId}`, {
        headers: { Authorization: 'Bearer ' + this.jwt }, // Inclut le JWT dans l'en-tête de la requête
      })
      .subscribe((response: any) => {
        this.questionlists_title = response.title; // Mise à jour du titre du quiz avec la réponse de l'API
      });
  }

  // Méthode pour récupérer la liste des questions du quiz
  getQuestionList() {
    sessionStorage.removeItem('nb_questions'); // Nettoyage de l'élément nb_questions du sessionStorage

    this.http
      .get(`http://127.0.0.1:8000/api/quizzes/${this.quizId}`, {
        headers: { Authorization: 'Bearer ' + this.jwt }, // Inclut le JWT dans l'en-tête de la requête
      })
      .subscribe((response: any) => {
        this.questionList = response.question; // Mise à jour de la liste des questions avec la réponse de l'API
        this.getQuestions(); // Appel de la méthode pour récupérer les détails des questions
      });
  }

  // Méthode pour récupérer les détails des questions
  getQuestions() {
    // Création d'un tableau de requêtes HTTP pour récupérer les détails de chaque question
    const requests = this.questionList.map((url) =>
      this.http.get(`http://127.0.0.1:8000${url}`, {
        headers: { Authorization: 'Bearer ' + this.jwt }, // Inclut le JWT dans l'en-tête de la requête
      })
    );

    // Exécution de toutes les requêtes en parallèle et traitement des réponses
    Promise.all(requests.map((request) => request.toPromise()))
      .then((responses) => {
        this.questionTitles = responses.map((response: any) => ({
          id: response.id, // Stocke l'ID de la question
          title: response.question, // Stocke le titre de la question
        }));
      })
      .catch((error) => {
        console.error('Error fetching question details:', error); // Gestion des erreurs lors de la récupération des détails des questions
      });
  }

  // Méthode pour afficher les détails de la question dans le modal
  onViewQuestionDetails(questionId: string) {
    this.http
      .get(`http://127.0.0.1:8000/api/questions/${questionId}`, {
        headers: { Authorization: 'Bearer ' + this.jwt }, // Inclut le JWT dans l'en-tête de la requête
      })
      .subscribe({
        next: async (response: any) => {
          this.selectedQuestionDetails = response; // Stocke les détails de la question
          this.selectedQuestionResponses = []; // Réinitialise les réponses

          try {
            // Requêtes pour récupérer les détails des réponses
            const responseRequests = response.response.map(
              (responseUrl: string) =>
                firstValueFrom(
                  this.http.get(`http://127.0.0.1:8000${responseUrl}`, {
                    headers: { Authorization: 'Bearer ' + this.jwt },
                  })
                )
            );

            // Exécution des requêtes en parallèle
            this.selectedQuestionResponses = await Promise.all(
              responseRequests
            ); // Stocke les réponses
          } catch (error) {
            console.error('Error fetching responses:', error); // Gestion des erreurs lors de la récupération des réponses
          }
        },
        error: (error) => {
          console.error('Error fetching question details:', error); // Gestion des erreurs lors de la récupération des détails de la question
        },
      });
  }

  // Méthode pour supprimer une question spécifique
  async onDeleteQuestion(questionId: string) {
    try {
      console.log(questionId);
      await firstValueFrom(
        this.http.delete(`http://127.0.0.1:8000/api/questions/${questionId}`, {
          headers: { Authorization: 'Bearer ' + this.jwt }, // Inclut le JWT dans l'en-tête de la requête
        })
      );
      console.log('Question deleted successfully'); // Confirmation de la suppression de la question
      this.getQuestionList(); // Met à jour la liste des questions après suppression
    } catch (error) {
      console.error('Error deleting question:', error); // Gestion des erreurs lors de la suppression de la question
    }
  }

  // Méthode pour supprimer le quiz
  async onDeleteQuiz() {
    if (this.quizId) {
      try {
        await firstValueFrom(
          this.http.delete(`http://127.0.0.1:8000/api/quizzes/${this.quizId}`, {
            headers: { Authorization: 'Bearer ' + this.jwt }, // Inclut le JWT dans l'en-tête de la requête
          })
        );
        console.log('Quiz deleted successfully'); // Confirmation de la suppression du quiz
        this.router.navigate(['/quizlists']); // Redirection vers la liste des quizs
      } catch (error) {
        console.error('Error deleting quiz:', error); // Gestion des erreurs lors de la suppression du quiz
      }
    }
  }
}
