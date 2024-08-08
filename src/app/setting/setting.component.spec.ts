import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingComponent } from './setting.component';
import { ActivatedRoute } from '@angular/router';

describe('SettingComponent', () => {
  let component: SettingComponent;
  let fixture: ComponentFixture<SettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: {} } } // Simulez ActivatedRoute
      ],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
