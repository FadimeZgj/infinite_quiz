import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterGameComponent } from './enter-game.component';
import { ActivatedRoute } from '@angular/router';

describe('EnterGameComponent', () => {
  let component: EnterGameComponent;
  let fixture: ComponentFixture<EnterGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnterGameComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: {} } } // Simulez ActivatedRoute
      ],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnterGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
