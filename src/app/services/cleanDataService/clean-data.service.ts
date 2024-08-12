import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CleanDataService {

  constructor() { }

  // Fonction pour nettoyer les balises HTML avec expressions régulières
  stripTags(element: string): string {
    return element.replace(/<[^>]*>/g, '');
  }

  cleanObject(obj: any): any {
    // je créé une copie de l'objet passé dont la type va dépendre de celui-ci.
    const cleanObj: any = Array.isArray(obj) ? [] : {};

    for (const key in obj) {

      const value = obj[key];

      if (typeof value === 'string') {
        cleanObj[key] = this.stripTags(value);
        
      } else if (typeof value === 'object') {
        // si l'élément est un objet je realise une récursive 
        cleanObj[key] = this.cleanObject(value);
      } else {
        cleanObj[key] = value;
      }
    
    }

    return cleanObj;
  }
}