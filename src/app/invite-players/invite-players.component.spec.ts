import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitePlayersComponent } from './invite-players.component';
import { ActivatedRoute } from '@angular/router';

describe('InvitePlayersComponent', () => {
  let component: InvitePlayersComponent;
  let fixture: ComponentFixture<InvitePlayersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvitePlayersComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: {} } } // Simulez ActivatedRoute
      ],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InvitePlayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
