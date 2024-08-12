import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionDestroyService {

  constructor() { }

  sessionDestroy(){
    localStorage.removeItem('jwt');
    sessionStorage.removeItem('userInfo');
  }
}
