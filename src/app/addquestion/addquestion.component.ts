import { Component, inject } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-addquestion',
  standalone: true,
  imports: [NavbarComponent, FormsModule, RouterLink, ReactiveFormsModule],
  templateUrl: './addquestion.component.html',
  styleUrl: './addquestion.component.scss'
})
export class AddquestionComponent {
  addQuestion_title = "titre du quiz"

  nb_questions?: any
  numbers: number[] = []
  formBuilder: FormBuilder = inject(FormBuilder);
  http: HttpClient = inject(HttpClient);
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);

  ngOnInit(){

    this.nb_questions = sessionStorage.getItem('nb_questions');
    this.nb_questions ? parseInt(this.nb_questions) : 0

    console.log(this.nb_questions)

    this.generateInputs(this.nb_questions)

    this.addResponse()
   
    
  }
            
  generateInputs(count: number) {
    for (let i = 1; i <= count; i++) {
      this.numbers.push(i);
    }
  }

  submitted = false;
  formulaire: FormGroup = this.formBuilder.group({
    question: ['',[Validators.required, Validators.minLength(3)]],
    responses: this.formBuilder.array([])
  });

  get responses() {
    return this.formulaire.controls["responses"] as FormArray;
  }

createResponseFormGroup() {
  return this.formBuilder.group({
    response: ['', Validators.required],
    correct: [false, Validators.required]
  });
}

addResponse() {
  for (let number = 0; number < this.numbers.length; number++) {
    this.responses.push(this.createResponseFormGroup());
  }
}

async onAddQuestion() {
  const jwt = localStorage.getItem('jwt');
  const quizId = this.route.snapshot.url[1]; // Récupérer l'ID du quiz depuis l'URL

  if (!quizId) {
    console.error('Quiz ID not found in the URL');
    return;
  }

  this.submitted = true;
  if (this.formulaire.valid) {
    const questionData = {
      question: this.formulaire.value.question,
      quiz: `/api/quizzes/${quizId}`,
      response: [] // Initialiser un tableau vide pour les réponses
    };

    try {
      // Étape 1: Créer la question
      const newQuestion: any = await firstValueFrom(
        this.http.post('http://127.0.0.1:8000/api/questions', questionData, { headers: { Authorization: 'Bearer ' + jwt, 'Content-Type': 'application/json' } })
      );

      console.log('Nouvelle question créée:', newQuestion);

      const questionId = newQuestion.id;
      const responses = this.formulaire.value.responses;

      // Préparer les promesses pour la création des réponses
      const responsePromises = responses.map((response: any) => {
        const responseData = {
          response: response.response,
          questions: [`/api/questions/${questionId}`], // Lier la réponse à la question nouvellement créée
          correct: response.correct
        };
        return firstValueFrom(
          this.http.post('http://127.0.0.1:8000/api/responses', responseData, { headers: { Authorization: 'Bearer ' + jwt, 'Content-Type': 'application/json' } })
        );
      });

      // Attendre que toutes les réponses soient créées
      const newResponses: any[] = await Promise.all(responsePromises);
      console.log('Nouvelles réponses créées:', newResponses);

      // Redirection après la création des questions et des réponses
      this.router.navigateByUrl(`/questionlist`);
    } catch (error: any) {
      console.error('Erreur lors de la création de la question ou des réponses:', error);
    }
  }
}
}
