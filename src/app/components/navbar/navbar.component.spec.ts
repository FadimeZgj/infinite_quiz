import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent, RouterLink, RouterLinkActive],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: {} } } // <- Simulez ActivatedRoute si nécessaire
      ],
    }).compileComponents();
    
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test pour vérifier que le composant est créé
  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  // Test pour vérifier que l'attribut @Input title est correctement appliqué
  it('devrait afficher le titre passé en entrée', () => {
    const testTitle = 'Test Navbar';
    component.title = testTitle;  // Attribuer un titre de test à l'input
    fixture.detectChanges();  // Déclencher la détection des changements

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain(testTitle);  // Vérifier si le titre est bien affiché
  });

});
