import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInformationsComponent } from './user-informations.component';
import { ActivatedRoute } from '@angular/router';

describe('UserInformationsComponent', () => {
  let component: UserInformationsComponent;
  let fixture: ComponentFixture<UserInformationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserInformationsComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: {} } } // Simulez ActivatedRoute
      ],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserInformationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
