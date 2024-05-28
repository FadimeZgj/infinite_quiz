import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionlistsComponent } from './questionlists.component';

describe('QuestionlistsComponent', () => {
  let component: QuestionlistsComponent;
  let fixture: ComponentFixture<QuestionlistsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionlistsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuestionlistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
