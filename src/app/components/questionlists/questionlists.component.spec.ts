import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionlistsComponent } from './questionlists.component';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('QuestionlistsComponent', () => {
  let component: QuestionlistsComponent;
  let fixture: ComponentFixture<QuestionlistsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionlistsComponent,
        HttpClientTestingModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: {} } } // Simulez ActivatedRoute
      ],
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
