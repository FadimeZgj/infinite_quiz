import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizlistsComponent } from './quizlists.component';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('QuizlistsComponent', () => {
  let component: QuizlistsComponent;
  let fixture: ComponentFixture<QuizlistsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizlistsComponent,
        HttpClientTestingModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: {} } } // Simulez ActivatedRoute
      ],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuizlistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
