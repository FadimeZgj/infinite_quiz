import { Component, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import 'bootstrap';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'infinite_quiz';

  constructor(private router: Router, private render: Renderer2){};

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
