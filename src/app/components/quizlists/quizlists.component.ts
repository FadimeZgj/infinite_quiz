import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { HttpClient } from '@angular/common/http';
import { Quiz } from '../../models/quiz.type';
import { RouterLink } from '@angular/router';
import { LoaderService } from '../../services/loaderService/loader.service';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-quizlists',
  standalone: true,
  imports: [NavbarComponent, RouterLink, FormsModule],
  templateUrl: './quizlists.component.html',
  styleUrl: './quizlists.component.scss',
})
export class QuizlistsComponent {
  constructor(
    private meta: Meta,
    private title: Title,
  ) {}
  quizlists_title = 'Listes des quizs'; // Titre affiché en haut de la page
  listQuiz: Quiz[] = []; // Liste des quizs récupérés depuis l'API
  filteredQuizzes: Quiz[] = []; // Liste des quizs filtrés en fonction du terme de recherche
  searchTerm: string = ''; // Variable pour stocker le terme de recherche

  // Injection des services nécessaires pour le composant
  http: HttpClient = inject(HttpClient);
  cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  private setMetaData() {
    this.title.setTitle('Liste des quizs - Infinite Quiz');
    this.meta.addTags([
      { name: 'description', content: 'Liste des quizs' },
      { name: 'robots', content: 'noindex, nofollow' } // Empêche l'indexation de cette page
    ]);
  }

  // Méthode appelée au chargement du composant
  async ngOnInit() {

    this.setMetaData()
    
    const jwt = localStorage.getItem('jwt'); // Récupération du token JWT stocké localement

    if (jwt != null) {
      try {
        // Requête HTTP pour récupérer la liste des quizs
        const listQuiz = await firstValueFrom(
          this.http.get<Quiz[]>('http://127.0.0.1:8000/api/quizzes', {
            headers: { Authorization: 'Bearer ' + jwt }, // Inclut le JWT dans l'en-tête de la requête
          })
        );

        // Vérifie le format de la réponse et met à jour la liste des quizs
        if (Array.isArray(listQuiz)) {
          this.listQuiz = listQuiz;
        } else if (listQuiz['hydra:member']) {
          this.listQuiz = listQuiz['hydra:member'];
        } else {
          console.error('Unexpected response format', listQuiz); // Gère les réponses inattendues
        }

        this.filteredQuizzes = [...this.listQuiz]; // Initialise filteredQuizzes avec toutes les données
      } catch (error) {
        console.error('Erreur lors de la récupération des quizs:', error); // Gère les erreurs lors de la requête
      } finally {
      }
    } else {
      console.error('JWT non disponible'); // Gère le cas où le JWT est absent
    }
  }

  // Méthode pour filtrer les quiz en fonction du terme de recherche
  searchQuizzes() {
    const searchTermLower = this.searchTerm.toLowerCase(); // Convertit le terme de recherche en minuscule
    this.filteredQuizzes = this.listQuiz.filter(
      (quiz) =>
        quiz.title.toLowerCase().includes(searchTermLower) || // Vérifie si le titre du quiz contient le terme de recherche
        quiz.id.toString().includes(searchTermLower) // Vérifie si l'ID du quiz contient le terme de recherche
    );
    this.cdr.detectChanges(); // Assure que les changements sont détectés
  }

  // Méthode utilisée par Angular pour optimiser le rendu des listes
  trackById(index: number, item: Quiz): string {
    return item.id; // Retourne l'ID du quiz pour le suivi des éléments dans la liste
  }
}
