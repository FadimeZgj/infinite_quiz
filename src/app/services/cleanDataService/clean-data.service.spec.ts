import { TestBed } from '@angular/core/testing';
import { CleanDataService } from './clean-data.service';

describe('CleanDataService', () => {
  let service: CleanDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CleanDataService); // Injection du service
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy(); // Vérifie que le service est bien créé
  });

  // describe permet de regrouper plusieurs tests (it blocks) sous une même catégorie ou fonctionnalité. 
  describe('stripTags', () => { 
    it('devrait enlever toutes les balises HTML d\'une chaîne de caractères', () => {
      const input = '<script>alert("Je suis vilain")</script>';
      const expectedOutput = 'alert("Je suis vilain")';

      const result = service.stripTags(input); // Appelle la méthode stripTags

      expect(result).toBe(expectedOutput); // Vérifie que les balises HTML ont été supprimées
    });

    it('devrait retourner la même chaîne si aucune balise HTML n\'est présente', () => {
      const input = 'Je suis clean';
      const result = service.stripTags(input); // Appelle la méthode stripTags

      expect(result).toBe(input); // Vérifie que la chaîne est inchangée
    });

    it('devrait retourner une chaîne vide si la chaîne d\'entrée est vide', () => {
      const input = '';
      const result = service.stripTags(input); // Appelle la méthode stripTags

      expect(result).toBe(''); // Vérifie que le résultat est une chaîne vide
    });
  });

  describe('cleanObject', () => {
    it('devrait nettoyer un objet simple en supprimant les balises HTML des valeurs', () => {
      const input = {
        name: '<strong>John Doe</strong>',
        bio: '<p>Developer at <em>Company</em></p>'
      };
      const expectedOutput = {
        name: 'John Doe',
        bio: 'Developer at Company'
      };

      const result = service.cleanObject(input); // Appelle la méthode cleanObject

      expect(result).toEqual(expectedOutput); // Vérifie que les balises HTML ont été supprimées
    });

    it('devrait nettoyer un objet imbriqué en supprimant les balises HTML des valeurs', () => {
      const input = {
        user: {
          name: '<strong>Jane Doe</strong>',
          profile: {
            bio: '<p>Engineer at <em>Tech Corp</em></p>'
          }
        }
      };
      const expectedOutput = {
        user: {
          name: 'Jane Doe',
          profile: {
            bio: 'Engineer at Tech Corp'
          }
        }
      };

      const result = service.cleanObject(input); // Appelle la méthode cleanObject

      expect(result).toEqual(expectedOutput); // Vérifie que les balises HTML ont été supprimées dans l'objet imbriqué
    });

    it('devrait retourner un tableau nettoyé si l\'entrée est un tableau', () => {
      const input = [
        '<p>Item 1</p>',
        '<div>Item 2</div>'
      ];
      const expectedOutput = [
        'Item 1',
        'Item 2'
      ];

      const result = service.cleanObject(input); // Appelle la méthode cleanObject

      expect(result).toEqual(expectedOutput); // Vérifie que les balises HTML ont été supprimées des éléments du tableau
    });

    it('devrait ne pas altérer les valeurs qui ne sont ni des chaînes ni des objets', () => {
      const input = {
        id: 1,
        active: true,
        description: '<p>Description</p>'
      };
      const expectedOutput = {
        id: 1,
        active: true,
        description: 'Description'
      };

      const result = service.cleanObject(input); // Appelle la méthode cleanObject

      expect(result).toEqual(expectedOutput); // Vérifie que seules les chaînes ont été nettoyées
    });
  });
});
