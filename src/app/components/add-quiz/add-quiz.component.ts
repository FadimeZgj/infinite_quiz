import { Component, inject } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { LoaderService } from '../../services/loaderService/loader.service';

@Component({
  selector: 'app-add-quiz', // Sélecteur utilisé pour insérer ce composant dans un template
  standalone: true, // Indique que le composant peut être utilisé de manière autonome
  imports: [NavbarComponent, FormsModule, RouterLink, ReactiveFormsModule], // Importation des modules nécessaires pour le composant
  templateUrl: './add-quiz.component.html', // Template HTML du composant
  styleUrl: './add-quiz.component.scss', // Styles spécifiques au composant
})
export class AddQuizComponent {
  // Titre affiché en haut de la page
  addQuiz_title = 'Créer un quiz';

  // Injection des services nécessaires pour le composant
  formBuilder: FormBuilder = inject(FormBuilder);
  http: HttpClient = inject(HttpClient);
  router: Router = inject(Router);
  jwt: any = localStorage.getItem('jwt'); // Récupération du token JWT stocké localement

  // Variable pour indiquer si le formulaire a été soumis
  submitted: boolean = false;

  // Variable pour stocker les messages d'erreur
  errorMessage: string = '';

  // Définition du formulaire avec les champs requis et leurs validateurs
  formulaire: FormGroup = this.formBuilder.group({
    title: ['', [Validators.required, Validators.minLength(3)]], // Champ titre avec validation
    group: [null, [Validators.required]], // Champ group obligatoire
    nb_questions: [1, [Validators.required]], // Champ nombre de questions obligatoire
  });

  // Méthode appelée lors de la soumission du formulaire
  onAddQuiz() {
    // Décoder le JWT pour obtenir le nom d'utilisateur
    const decodedToken: any = jwtDecode(this.jwt);
    const username = decodedToken?.username;

    // Requête HTTP pour obtenir l'ID de l'utilisateur à partir de son nom d'utilisateur
    this.http
      .get(`http://127.0.0.1:8000/api/users?username=${username}`, {
        headers: { Authorization: 'Bearer ' + this.jwt }, // Inclut le JWT dans l'en-tête de la requête
      })
      .pipe(
        catchError((error) => {
          // Gestion des erreurs lors de la requête pour obtenir l'utilisateur
          console.error(
            "Erreur lors de la récupération de l'utilisateur:",
            error
          );
          this.errorMessage =
            "Impossible de récupérer les informations de l'utilisateur. Veuillez réessayer plus tard.";
          return of(null); // Retourne un observable null pour ne pas interrompre le flux
        })
      )
      .subscribe((response: any) => {
        if (response) {
          // Récupération de l'ID utilisateur à partir de la réponse
          const userId = response['hydra:member'][0]?.id;
          const nb_questions = this.formulaire.value.nb_questions;

          // Mise à jour de sessionStorage avec le nombre de questions
          sessionStorage.removeItem('nb_questions');
          sessionStorage.setItem('nb_questions', nb_questions);

          this.submitted = true; // Indique que le formulaire a été soumis

          // Vérifie si le formulaire est valide et si l'ID utilisateur est obtenu
          if (this.formulaire.valid && userId) {
            // Prépare les données du quiz à envoyer
            const quizData = {
              ...this.formulaire.value,
              user: `http://127.0.0.1:8000/api/users/${userId}`, // Associe le quiz à l'utilisateur
            };

            // Envoi des données du quiz via une requête POST
            this.http
              .post('http://127.0.0.1:8000/api/quizzes', quizData, {
                headers: {
                  Authorization: 'Bearer ' + this.jwt, // Inclut le JWT dans l'en-tête de la requête
                  'Content-Type': 'application/ld+json', // Indique le format des données envoyées
                },
              })
              .pipe(
                catchError((error) => {
                  // Gestion des erreurs lors de la création du quiz
                  console.error('Erreur lors de la création du quiz:', error);
                  this.errorMessage =
                    'Une erreur est survenue lors de la création du quiz. Veuillez réessayer plus tard.';
                  return of(null); // Retourne un observable null pour ne pas interrompre le flux
                })
              )
              .subscribe((newQuiz: any) => {
                if (newQuiz) {
                  const quizId = newQuiz.id; // Récupère l'ID du nouveau quiz créé
                  // Redirige vers la page d'ajout de questions pour ce quiz
                  this.router.navigateByUrl(`/addquestion/${quizId}`);
                }
              });
          } else {
            this.errorMessage =
              "Le formulaire est invalide ou l'utilisateur n'a pas pu être identifié.";
          }
        }
      });
  }
}
