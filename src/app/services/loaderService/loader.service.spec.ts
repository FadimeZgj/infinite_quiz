import { TestBed } from '@angular/core/testing';
import { LoaderService } from './loader.service';
import { BehaviorSubject } from 'rxjs';

describe('LoaderService', () => {
  let service: LoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoaderService); // Injection du service
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy(); // Vérifie que le service est bien créé
  });

  describe('loading$', () => {
    it('devrait initialement être false', (done) => {
      service.loading$.subscribe((isLoading) => {
        expect(isLoading).toBeFalse(); // Vérifie que la valeur initiale de loading$ est false
        done();
      });
    });
  });

  describe('show', () => {
    it('devrait émettre true quand show est appelé', (done) => {
      service.show(); // Appelle la méthode show

      service.loading$.subscribe((isLoading) => {
        expect(isLoading).toBeTrue(); // Vérifie que loading$ émet true après appel à show
        done();
      });
    });
  });

  describe('hide', () => {
    it('devrait émettre false quand hide est appelé', (done) => {
      service.show(); // Active le loader d'abord pour simuler un état "chargement"
      service.hide(); // Appelle la méthode hide

      service.loading$.subscribe((isLoading) => {
        expect(isLoading).toBeFalse(); // Vérifie que loading$ émet false après appel à hide
        done();
      });
    });
  });
});
