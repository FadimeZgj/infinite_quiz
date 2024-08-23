import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { QuizlistsComponent } from './quizlists.component';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Meta, Title } from '@angular/platform-browser';

describe('QuizlistsComponent', () => {
  let component: QuizlistsComponent;
  let fixture: ComponentFixture<QuizlistsComponent>;
  let httpClientTesting: HttpTestingController;
  let router: Router;
  let metaServiceSpy: jasmine.SpyObj<Meta>;
  let titleServiceSpy: jasmine.SpyObj<Title>;

  beforeEach(async () => {
    // Création d'espion pour surveiller les services
    metaServiceSpy = jasmine.createSpyObj('Meta', ['addTags']);
    titleServiceSpy = jasmine.createSpyObj('Title', ['setTitle']);

    await TestBed.configureTestingModule({
      imports: [QuizlistsComponent,
        HttpClientTestingModule
      ],
      providers: [
        { provide: Meta, useValue: metaServiceSpy },
        { provide: Title, useValue: titleServiceSpy },
        { provide: ActivatedRoute, useValue: { snapshot: {} } } // Simulez ActivatedRoute
      ],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuizlistsComponent);
    component = fixture.componentInstance;
    httpClientTesting = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });
  
  afterEach(() => {
    httpClientTesting.verify();
  });

  it('devrait créer un composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait initialiser les metadatas', () => {
    expect(titleServiceSpy.setTitle).toHaveBeenCalledWith('Liste des quizs - Infinite Quiz');
    expect(metaServiceSpy.addTags).toHaveBeenCalledWith([
      { name: 'description', content: 'Liste des quizs' },
      { name: 'robots', content: 'noindex, nofollow' }
    ]);
  });

  it('devrait gérer l\'absence de JWT dans localStorage', async () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(console, 'error');

    await component.ngOnInit();

    expect(console.error).toHaveBeenCalledWith('JWT non disponible');
  });

  it('devrait envoyer une requête HTTP si le JWT existe', () => {
    // Simuler la présence d'un JWT
    spyOn(localStorage, 'getItem').and.returnValue('valid.jwt.token');
    
    // Appel de ngOnInit pour déclencher la logique de récupération des quiz
    component.ngOnInit();
    
    // Vérifier qu'une requête HTTP a bien été envoyée
    const req = httpClientTesting.expectOne('http://127.0.0.1:8000/api/quizzes');
    expect(req.request.method).toBe('GET');
  });



  it('devrait récupérer la liste des quiz depuis l\'API', fakeAsync(() => {
    const response = {
      'hydra:member': [
        { id: '1', title: 'Quiz 1' },
        { id: '2', title: 'Quiz 2' }
      ]
    };

    spyOn(localStorage, 'getItem').and.returnValue('valid.jwt.token');
    
    component.ngOnInit(); // Appel de ngOnInit pour déclencher la requête HTTP
    
    const req = httpClientTesting.expectOne('http://127.0.0.1:8000/api/quizzes');
    expect(req.request.method).toBe('GET');
    
    req.flush(response); // Injecte la réponse simulée

    tick(); // Avance le temps pour laisser les opérations asynchrones se terminer
    
    fixture.detectChanges(); // Déclenche la détection des changements pour mettre à jour la vue

    // Vérifie les valeurs
    expect(component.listQuiz.length).toBe(2); // La liste des quiz devrait contenir 2 éléments
    expect(component.listQuiz[0].title).toBe('Quiz 1');
    expect(component.listQuiz[1].title).toBe('Quiz 2');
  }));

  it('ne devrait pas récupérer la liste des quiz depuis l\'API', fakeAsync(() => {
    const response = {
      'hydra:member': [
      ]
    };

    spyOn(localStorage, 'getItem').and.returnValue('valid.jwt.token');
    
    component.ngOnInit(); // Appel de ngOnInit pour déclencher la requête HTTP
    
    const req = httpClientTesting.expectOne('http://127.0.0.1:8000/api/quizzes');
    expect(req.request.method).toBe('GET');
    
    req.flush(response); // Injecte la réponse simulée

    tick(); // Avance le temps pour laisser les opérations asynchrones se terminer
    
    fixture.detectChanges(); // Déclenche la détection des changements pour mettre à jour la vue

    // Vérifie les valeurs
    console.log('ListQuiz:', component.listQuiz);
    expect(component.listQuiz.length).toBe(0); // La liste des quiz devrait contenir 2 éléments
  }));

  it('devrait filtrer les quiz en fonction du terme de recherche', () => {
    // Configure les données initiales
    component.listQuiz = [
      {
        id: '1', title: 'Quiz 1',
        group: false,
        question: []
      },
      {
        id: '2', title: 'Quiz 2',
        group: false,
        question: []
      },
      {
        id: '3', title: 'Another Quiz',
        group: false,
        question: []
      }
    ];
    
    // Configure le terme de recherche
    component.searchTerm = 'quiz';
    
    // Appelle la méthode de filtrage
    component.searchQuizzes();
    
    // Déclenche la détection des changements
    fixture.detectChanges();

    // Vérifie les résultats du filtrage
    expect(component.filteredQuizzes.length).toBe(3); // Tous les quiz devraient être inclus car 'quiz' est contenu dans tous les titres ou IDs
    expect(component.filteredQuizzes).toEqual([
      { id: '1', title: 'Quiz 1', group:false, question:[] },
      { id: '2', title: 'Quiz 2', group:false, question:[] },
      { id: '3', title: 'Another Quiz', group:false, question:[] }
    ]);
  });

  it('devrait ne pas inclure les quiz si le terme de recherche ne correspond à aucun titre ou ID', () => {
    // Configure les données initiales
    component.listQuiz = [
      {
        id: '1', title: 'Quiz 1',
        group: false,
        question: []
      },
      {
        id: '2', title: 'Quiz 2',
        group: false,
        question: []
      },
      {
        id: '3', title: 'Another Quiz',
        group: false,
        question: []
      }
    ];
    
    // Configure le terme de recherche
    component.searchTerm = 'nonexistent';
    
    // Appelle la méthode de filtrage
    component.searchQuizzes();
    
    // Déclenche la détection des changements
    fixture.detectChanges();

    // Vérifie les résultats du filtrage
    expect(component.filteredQuizzes.length).toBe(0); // Aucun quiz ne devrait correspondre
    expect(component.filteredQuizzes).toEqual([]); // La liste des quiz filtrés devrait être vide
  });

});
