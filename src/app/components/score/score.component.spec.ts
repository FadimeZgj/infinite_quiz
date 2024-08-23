import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreComponent } from './score.component';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Meta, Title } from '@angular/platform-browser';
import { of } from 'rxjs';
import { GameComponent } from '../game/game.component';

describe('ScoreComponent', () => {
  let component: ScoreComponent;
  let fixture: ComponentFixture<ScoreComponent>;
  
  let httpMock: HttpTestingController;
  let routeMock: any;
  let routerMock: any;
  let metaMock: Meta;
  let titleMock: Title;

  beforeEach(async () => {

// Mock des dépendances injectées
routeMock = {
  queryParams: of({ quizId: '1', teamId: '1', playerId: '1', uuid: '1234' })
};


metaMock = jasmine.createSpyObj('Meta', ['addTags']);
titleMock = jasmine.createSpyObj('Title', ['setTitle']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ScoreComponent, ],
      providers: [
       // { provide: ActivatedRoute, useValue: { snapshot: {} } }, // Simulez ActivatedRoute
        { provide: ActivatedRoute, useValue: routeMock },
       // { provide: Router, useValue: routerMock },
        { provide: Meta, useValue: metaMock },
        { provide: Title, useValue: titleMock }
      ],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait créer un composant', () => {
    expect(component).toBeTruthy();
  });
});
