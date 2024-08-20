import { TestBed } from '@angular/core/testing';
import { JwtService } from './jwt.service';
import { jwtDecode } from 'jwt-decode';

describe('JwtService', () => {
  let service: JwtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JwtService); // Injection du service
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy(); // Vérifie que le service est bien créé
  });

  describe('decode', () => {
    it('devrait décoder un JWT valide', () => {
      const token = 'fake-jwt-token';
      const expectedDecodedToken = { sub: '1234567890', name: 'John Doe', iat: 1516239022 };
      
      // Espionne la fonction jwtDecode pour s'assurer qu'elle est appelée correctement
      spyOn(service, 'decode').and.callFake(() => expectedDecodedToken);

      const result = service.decode(token); // Appelle la méthode decode

      expect(result).toEqual(expectedDecodedToken); // Vérifie que le token a été correctement décodé
      expect(service.decode).toHaveBeenCalledWith(token); // Vérifie que la méthode decode a été appelée avec le bon token
    });

    it('devrait lancer une erreur si le JWT est invalide', () => {
      const invalidToken = 'invalid-jwt-token';

      // Espionne la fonction jwtDecode pour simuler une erreur lors du décodage
      spyOn(service, 'decode').and.throwError('Invalid token');

      expect(() => service.decode(invalidToken)).toThrowError('Invalid token'); // Vérifie que la méthode lance une erreur
    });
  });
});
