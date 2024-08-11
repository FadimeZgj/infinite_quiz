import { Component, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import 'bootstrap';
import { LoaderService } from './services/loaderService/loader.service';
import { LoaderComponent } from './loader/loader.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,LoaderComponent, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(private router: Router, private render: Renderer2,
    private loaderService: LoaderService
  ){};
  
  title = 'infinite_quiz';
  loading$ = this.loaderService.loading$;

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateBodyStyle(event.url);
      }
    });
  }

  updateBodyStyle(url: string): void {
    if (url === '/login' || url === '/signup') {
      this.render.setStyle(document.body, 'background-color', '#8906E6');
    } else {
      this.render.removeStyle(document.body, 'background-color');
    }
  }


  
}
