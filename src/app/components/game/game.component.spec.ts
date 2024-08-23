import { TestBed, ComponentFixture, waitForAsync, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GameComponent } from './game.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { of } from 'rxjs';


describe('GameComponent', () => {

  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;
  let routeMock: any;
  let metaMock: Meta;
  let titleMock: Title;
  let httpClientTesting: HttpTestingController;

  beforeEach(async () => {

// Mock des dépendances injectées
routeMock = {
  queryParams: of({ quizId: '1', teamId: '1', playerId: '1', uuid: '1234' })
};


metaMock = jasmine.createSpyObj('Meta', ['addTags']);
titleMock = jasmine.createSpyObj('Title', ['setTitle']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, GameComponent ],
      providers: [
       // { provide: ActivatedRoute, useValue: { snapshot: {} } }, // Simulez ActivatedRoute
        { provide: ActivatedRoute, useValue: routeMock },
       // { provide: Router, useValue: routerMock },
        { provide: Meta, useValue: metaMock },
        { provide: Title, useValue: titleMock }
      ],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('devrait initialiser correctement les propriétés lors du ngOnInit', () => {
    component.ngOnInit();
    expect(component.quizId).toBe('1');
    expect(component.teamId).toBe('1');
    expect(component.playerId).toBe('1');
    expect(component.uuid).toBe('1234');
  }); 

  it('devrait appeler setMetaData lors du ngOnInit', () => {
    const setMetaDataSpy = spyOn(component as any, 'setMetaData').and.callThrough();
    component.ngOnInit();
    expect(setMetaDataSpy).toHaveBeenCalled();
    expect(titleMock.setTitle).toHaveBeenCalledWith('Game - Infinite Quiz');
    expect(metaMock.addTags).toHaveBeenCalled();
  });
});

  // it('devrait initialiser correctement les propriétés lors du ngOnInit', () => {
  //   component.ngOnInit();
  //   expect(component.quizId).toBe('1');
  //   expect(component.teamId).toBe('1');
  //   expect(component.playerId).toBe('1');
  //   expect(component.uuid).toBe('1234');
  // });

  // it('devrait appeler setMetaData lors du ngOnInit', () => {
  //   const setMetaDataSpy = spyOn(component as any, 'setMetaData').and.callThrough();
  //   component.ngOnInit();
  //   expect(setMetaDataSpy).toHaveBeenCalled();
  //   expect(titleMock.setTitle).toHaveBeenCalledWith('Game - Infinite Quiz');
  //   expect(metaMock.addTags).toHaveBeenCalled();
  // });

  // it('devrait récupérer le titre du quiz via getQuizTitle', () => {
  //   const mockQuizTitle = { title: 'Test Quiz' };
    
  //   component.getQuizTitle();

  //   const req = httpMock.expectOne(`http://127.0.0.1:8000/api/quizzes/1`);
  //   expect(req.request.method).toBe('GET');
  //   req.flush(mockQuizTitle);

  //   expect(component.quiz_title).toBe('Test Quiz');
  // });

  // it('devrait récupérer les questions via getQuestions', async () => {
  //   const mockQuizResponse = {
  //     question: ['/api/questions/1']
  //   };
    
  //   const mockQuestionResponse = {
  //     question: 'What is the capital of France?',
  //     response: ['/api/answers/1', '/api/answers/2']
  //   };
    
  //   const mockAnswerResponse1 = { text: 'Paris', correct: true };
  //   const mockAnswerResponse2 = { text: 'Berlin', correct: false };

  //   // Appeler la méthode getQuestions
  //   component.getQuestions();

  //   // Simuler les requêtes HTTP
  //   const quizRequest = httpMock.expectOne(`http://127.0.0.1:8000/api/quizzes/1`);
  //   quizRequest.flush(mockQuizResponse);

  //   const questionRequest = httpMock.expectOne(`http://127.0.0.1:8000/api/questions/1`);
  //   questionRequest.flush(mockQuestionResponse);

  //   const answerRequest1 = httpMock.expectOne(`http://127.0.0.1:8000/api/answers/1`);
  //   answerRequest1.flush(mockAnswerResponse1);

  //   const answerRequest2 = httpMock.expectOne(`http://127.0.0.1:8000/api/answers/2`);
  //   answerRequest2.flush(mockAnswerResponse2);

  //   // Vérifier que les questions et réponses ont été correctement récupérées
  //   expect(component.questionsWithAnswers.length).toBe(1);
  //   expect(component.questionsWithAnswers[0].question).toBe('What is the capital of France?');
  //   expect(component.questionsWithAnswers[0].responsePairs.length).toBe(1);
  //   expect(component.questionsWithAnswers[0].responsePairs[0][0].text).toBe('Paris');
  //   expect(component.questionsWithAnswers[0].responsePairs[0][1].text).toBe('Berlin');
  // });

  // it('devrait mettre à jour le score et naviguer après avoir terminé le quiz', () => {
  //   component.addPlayerScore = 50;
  //   component.nbQuestion = 5;
  //   component.gameData = {};

  //   component.finishQuiz();

  //   const expectedScore = (50 / 5) * 100;
  //   expect(component.addPlayerScore).toBe(expectedScore);
  //   expect(component.gameData.playerScore).toBe(expectedScore);

  //   const req = httpMock.expectOne(`http://127.0.0.1:8000/api/games/1/1/1/1234`);
  //   expect(req.request.method).toBe('PUT');
  //   req.flush({}); // Réponse vide simulée

  //   expect(routerMock.navigateByUrl).toHaveBeenCalledWith(`/score?score=${expectedScore}`);
  // });

