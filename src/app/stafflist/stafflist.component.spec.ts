import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StafflistComponent } from './stafflist.component';
import { ActivatedRoute } from '@angular/router';

describe('StafflistComponent', () => {
  let component: StafflistComponent;
  let fixture: ComponentFixture<StafflistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StafflistComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: {} } } // Simulez ActivatedRoute
      ],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StafflistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
