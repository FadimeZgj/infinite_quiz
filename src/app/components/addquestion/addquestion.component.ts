import { Component, inject } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-addquestion',
  standalone: true,
  imports: [NavbarComponent, FormsModule, RouterLink, ReactiveFormsModule],
  templateUrl: './addquestion.component.html',
  styleUrl: './addquestion.component.scss',
})
export class AddquestionComponent {
  constructor(
    private meta: Meta,
    private title: Title,
  ) {}
  addQuestion_title = 'titre du quiz'; // Titre affiché sur le formulaire d'ajout de question

  nb_questions?: any; // Nombre de questions à ajouter, potentiellement défini via sessionStorage
  numbers: number[] = []; // Tableau pour stocker les nombres utilisés pour les indices des questions
  formBuilder: FormBuilder = inject(FormBuilder); // Injection du service FormBuilder pour la gestion des formulaires
  http: HttpClient = inject(HttpClient); // Injection du service HttpClient pour les requêtes HTTP
  router: Router = inject(Router); // Injection du service Router pour la navigation
  route: ActivatedRoute = inject(ActivatedRoute); // Injection du service ActivatedRoute pour accéder aux paramètres de la route
  quizId: string | null | undefined = null; // ID du quiz, récupéré depuis les paramètres de la route
  jwt: any = localStorage.getItem('jwt'); // Récupération du token JWT stocké localement

  private setMetaData() {
    this.title.setTitle('Créer des question - Infinite Quiz');
    this.meta.addTags([
      { name: 'description', content: 'Créer les questions du quiz' },
      { name: 'robots', content: 'noindex, nofollow' } // Empêche l'indexation de cette page
    ]);
  }

  // Méthode appelée au chargement du composant
  ngOnInit() {
    this.setMetaData()
    // Récupération de l'ID du quiz depuis les paramètres de la route
    this.quizId = this.route.snapshot.firstChild?.paramMap.get('id');

    // Vérifie si le JWT est présent pour l'accès autorisé
    if (!this.jwt) {
      console.error('Accès non autorisé');
      this.router.navigateByUrl(`/login`); // Redirection vers la page de connexion si le JWT est absent
    }

    // Vérifie si l'ID du quiz est présent
    if (!this.quizId) {
      console.error("Le quiz n'existe pas");
      this.router.navigateByUrl(`/addquiz`); // Redirection vers la page d'ajout de quiz si l'ID est absent
    }

    // Récupération du titre du quiz
    this.getQuizTitle();

    // Récupération du nombre de questions à afficher depuis sessionStorage
    if (sessionStorage.getItem('nb_questions')) {
      this.nb_questions = sessionStorage.getItem('nb_questions');
      this.nb_questions ? parseInt(this.nb_questions) : 0;
    } else {
      this.nb_questions = 1; // Valeur par défaut si aucune valeur n'est trouvée
    }

    // Génération des champs de saisie pour le nombre de questions
    this.generateInputs(this.nb_questions);

    // Ajout des groupes de questions au formulaire
    this.addQuestions();
  }

  // Génère un tableau de nombres de 1 à 'count' pour les indices des questions
  generateInputs(count: number) {
    for (let i = 1; i <= count; i++) {
      this.numbers.push(i);
    }
  }

  submitted = false; // Indique si le formulaire a été soumis
  formulaire: FormGroup = this.formBuilder.group({
    questions: this.formBuilder.array([]), // Initialisation du formulaire avec un tableau de questions
  });

  // Accesseur pour obtenir la liste des questions
  get questions(): FormArray {
    return this.formulaire.get('questions') as FormArray;
  }

  // Crée un groupe de formulaire pour une question
  createQuestionFormGroup(): FormGroup {
    return this.formBuilder.group({
      question: ['', [Validators.required, Validators.minLength(3)]], // Champ pour la question, requis
      responses: this.formBuilder.array(this.createDefaultResponses()), // Initialisation des réponses par défaut
    });
  }

  // Crée un groupe de formulaire pour une réponse
  createResponseFormGroup(): FormGroup {
    return this.formBuilder.group({
      response: ['', [Validators.required, Validators.minLength(3)]], // Champ pour la réponse, requis
      correct: [false], // Indicateur si la réponse est correcte
    });
  }

  // Crée un tableau de réponses par défaut (4 réponses)
  createDefaultResponses(): FormGroup[] {
    const responses: FormGroup[] = [];
    for (let i = 0; i < 4; i++) {
      responses.push(this.createResponseFormGroup());
    }
    return responses;
  }

  // Ajoute les groupes de questions au formulaire selon le nombre défini
  addQuestions() {
    for (let i = 0; i < this.nb_questions; i++) {
      this.questions.push(this.createQuestionFormGroup());
    }
  }

  // Accesseur pour obtenir les réponses d'une question spécifique
  getResponses(questionIndex: number): FormArray {
    return this.questions.at(questionIndex).get('responses') as FormArray;
  }

  // Récupère le titre du quiz depuis l'API
  getQuizTitle() {
    this.http
      .get(`http://127.0.0.1:8000/api/quizzes/${this.quizId}`, {
        headers: { Authorization: 'Bearer ' + this.jwt }, // Inclut le JWT dans l'en-tête de la requête
      })
      .subscribe((response: any) => {
        this.addQuestion_title = response.title; // Mise à jour du titre avec la réponse de l'API
      });
  }

  // Méthode pour ajouter les questions et leurs réponses à l'API
  async onAddQuestion() {
    if (!this.quizId) {
      console.error('Quiz ID not found in the URL');
      return;
    }

    this.submitted = true; // Marque le formulaire comme soumis
    if (this.formulaire.valid) {
      try {
        // Parcourt chaque groupe de question dans le formulaire
        for (let questionGroup of this.questions.controls) {
          const questionData = {
            question: questionGroup.value.question,
            quiz: `/api/quizzes/${this.quizId}`,
            response: [], // Initialisation d'un tableau vide pour les réponses
          };

          // Créer la question
          const newQuestion: any = await firstValueFrom(
            this.http.post(
              'http://127.0.0.1:8000/api/questions',
              questionData,
              {
                headers: {
                  Authorization: 'Bearer ' + this.jwt,
                  'Content-Type': 'application/json',
                },
              }
            )
          );

          const questionId = newQuestion.id; // Récupération de l'ID de la question nouvellement créée
          const responses = questionGroup.get('responses')?.value || []; // Récupération des réponses associées à la question

          // Préparer les promesses pour la création des réponses
          const responsePromises = responses.map((response: any) => {
            const responseData = {
              response: response.response,
              questions: [`/api/questions/${questionId}`], // Lier la réponse à la question nouvellement créée
              correct: response.correct,
            };
            return firstValueFrom(
              this.http.post(
                'http://127.0.0.1:8000/api/responses',
                responseData,
                {
                  headers: {
                    Authorization: 'Bearer ' + this.jwt,
                    'Content-Type': 'application/json',
                  },
                }
              )
            );
          });

          // Attendre que toutes les réponses soient créées
          const newResponses: any[] = await Promise.all(responsePromises);
        }

        // Redirection après la création des questions et des réponses
        this.router.navigateByUrl(`/questionlist/${this.quizId}`);
      } catch (error: any) {
        console.error(
          'Erreur lors de la création de la question ou des réponses:',
          error
        );
      }
    }
  }
}
