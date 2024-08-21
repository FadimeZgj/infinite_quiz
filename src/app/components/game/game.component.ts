import { Component, inject } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Quiz } from '../../models/quiz.type';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  quiz_title = 'Nom du quiz';
  http: HttpClient = inject(HttpClient);
  route: ActivatedRoute = inject(ActivatedRoute);
  jwt: any = localStorage.getItem('jwt');
  quizId: string | null | undefined = null;
  teamId: string | null | undefined = null;
  playerId: string | null | undefined = null;
  uuid: string | null | undefined = null;
  gameData: any = {}
  allQuestions: any[]=[]
  answers: any[] = []
  nbQuestion: number = 0

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      this.quizId = params['quizId'];
      this.teamId = params['teamId'];
      this.playerId = params['playerId'];
      this.uuid = params['uuid'];
    });

    this.getQuizTitle()

    this.getQuestions()
  }

   // Récupère le titre du quiz depuis l'API
  getQuizTitle() {
    this.http
      .get(`http://127.0.0.1:8000/api/quizzes/${this.quizId}`, {
        headers: { Authorization: 'Bearer ' + this.jwt }, // Inclut le JWT dans l'en-tête de la requête
      })
      .subscribe((response: any) => {
        this.quiz_title = response.title; // Mise à jour du titre avec la réponse de l'API
      });
  }

  getGameData(){
    this.http
      .get(`http://127.0.0.1:8000/api/games/${this.quizId}/${this.teamId}/${this.playerId}/${this.uuid}`,{
        headers: { Authorization: 'Bearer ' + this.jwt },
      })
      .subscribe((response:any)=>{
        this.gameData = response
      })
  }
//   questionsWithAnswers: any[] = [];
// colors: string[] = ['#5FB1DF', '#DFB45F', '#E8865C', '#33CCB6']; // Tableau des couleurs

// async getQuestions() {
//   try {
//     const response: any = await this.http
//       .get(`http://127.0.0.1:8000/api/quizzes/${this.quizId}`, {
//         headers: { Authorization: 'Bearer ' + this.jwt },
//       })
//       .toPromise();
  
//     const questionUrls = response.question;

//     const fetchAnswers = async (questionData: any, answerUrls: any[]) => {
//       const responses = await Promise.all(
//         answerUrls.map((answerUrl: any) => 
//           this.http
//             .get(`http://127.0.0.1:8000${answerUrl}`, {
//               headers: { Authorization: 'Bearer ' + this.jwt },
//             })
//             .toPromise()
//         )
//       );

//       // Ajoute les réponses avec les couleurs
//       responses.forEach((response: any, index: number) => {
//         response.color = this.colors[index % this.colors.length]; // Attribuer une couleur en boucle
//       });

//       questionData.responsePairs = this.getAnswerPairs(responses);
//     };

//     const fetchQuestion = async (questionUrl: any) => {
//       const responsQuestion: any = await this.http
//         .get(`http://127.0.0.1:8000${questionUrl}`, {
//           headers: { Authorization: 'Bearer ' + this.jwt },
//         })
//         .toPromise();
  
//       const questionData = {
//         question: responsQuestion.question,
//         responsePairs: []
//       };
  
//       if (responsQuestion.response.length === 0) {
//         this.questionsWithAnswers.push(questionData);
//       } else {
//         await fetchAnswers(questionData, responsQuestion.response);
//         this.questionsWithAnswers.push(questionData);
//       }
//     };

//     await Promise.all(questionUrls.map(fetchQuestion));
//     console.log(this.questionsWithAnswers);

//   } catch (error) {
//     console.error('Erreur lors de la récupération des questions ou des réponses:', error);
//   }
// }

// getAnswerPairs(responses: any[]): any[][] {
//   const pairs = [];
//   for (let i = 0; i < responses.length; i += 2) {
//     pairs.push([responses[i], responses[i + 1]]);
//   }
//   return pairs;
// }

questionsWithAnswers: any[] = [];
currentQuestionIndex: number = 0;  // Indice de la question actuelle
colors: string[] = ['#5FB1DF', '#DFB45F', '#E8865C', '#33CCB6']; // Tableau des couleurs
addPlayerScore: number = 0

async getQuestions() {
  try {
    const response: any = await this.http
      .get(`http://127.0.0.1:8000/api/quizzes/${this.quizId}`, {
        headers: { Authorization: 'Bearer ' + this.jwt },
      })
      .toPromise();

    this.nbQuestion = response.question.length  
  
    const questionUrls = response.question;

    const fetchAnswers = async (questionData: any, answerUrls: any[]) => {
      const responses = await Promise.all(
        answerUrls.map((answerUrl: any) => 
          this.http
            .get(`http://127.0.0.1:8000${answerUrl}`, {
              headers: { Authorization: 'Bearer ' + this.jwt },
            })
            .toPromise()
        )
      );

      responses.forEach((response: any, index: number) => {
        response.color = this.colors[index % this.colors.length]; // Attribuer une couleur en boucle
      });

      questionData.responsePairs = this.getAnswerPairs(responses);
    };

    const fetchQuestion = async (questionUrl: any) => {
      const responsQuestion: any = await this.http
        .get(`http://127.0.0.1:8000${questionUrl}`, {
          headers: { Authorization: 'Bearer ' + this.jwt },
        })
        .toPromise();
  
      const questionData = {
        question: responsQuestion.question,
        responsePairs: []
      };
  
      if (responsQuestion.response.length === 0) {
        this.questionsWithAnswers.push(questionData);
      } else {
        await fetchAnswers(questionData, responsQuestion.response);
        this.questionsWithAnswers.push(questionData);
      }
    };

    await Promise.all(questionUrls.map(fetchQuestion));
    console.log(this.questionsWithAnswers);

  } catch (error) {
    console.error('Erreur lors de la récupération des questions ou des réponses:', error);
  }
}

getAnswerPairs(responses: any[]): any[][] {
  const pairs = [];
  for (let i = 0; i < responses.length; i += 2) {
    pairs.push([responses[i], responses[i + 1]]);
  }
  return pairs;
}

// Vérifie si la réponse est correcte, met à jour le score, et passe à la question suivante
handleAnswerSelection(isCorrect: boolean) {
  if (isCorrect) {
    this.addPlayerScore++;  // Ajouter un point si la réponse est correcte
  }

  // Mettre à jour le score dans l'entité game
  if (this.gameData) {
    console.log(this.nbQuestion)
    console.log(this.addPlayerScore)

     // Vérifier si c'est la dernière question
    if (this.currentQuestionIndex < this.questionsWithAnswers.length - 1) {
    // Passer à la question suivante si ce n'est pas la dernière
    this.goToNextQuestion();
    } else {
      // Si c'est la dernière question, terminer le quiz
      this.finishQuiz();
    }
  }
  
  
}

// Passer à la question suivante après avoir sélectionné une réponse
goToNextQuestion() {
  if (this.currentQuestionIndex < this.questionsWithAnswers.length - 1) {
    this.currentQuestionIndex++;
  } else {
    console.log("Quiz terminé !");
    // Ici, tu peux ajouter une logique pour terminer le quiz ou afficher les résultats
  }
}

finishQuiz() {
  console.log("Quiz terminé !");
  this.addPlayerScore = (this.addPlayerScore/this.nbQuestion)*100
  console.log("Score:", this.addPlayerScore)
  this.gameData.playerScore = this.addPlayerScore; 
  console.log(this.gameData)
  this.http
      .put(`http://127.0.0.1:8000/api/games/${this.quizId}/${this.teamId}/${this.playerId}/${this.uuid}`, this.gameData, {
        headers: { Authorization: 'Bearer ' + this.jwt },
      })
      .subscribe(
        (response:any)=>{
          console.log('Score mis à jour avec succès:', response);
          
        }
      )
}

  
}