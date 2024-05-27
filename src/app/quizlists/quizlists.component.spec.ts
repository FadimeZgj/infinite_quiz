import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizlistsComponent } from './quizlists.component';

describe('QuizlistsComponent', () => {
  let component: QuizlistsComponent;
  let fixture: ComponentFixture<QuizlistsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizlistsComponent]
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
