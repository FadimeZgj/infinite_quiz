import { Component, inject } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-add-quiz',
  standalone: true,
  imports: [NavbarComponent,  FormsModule, RouterLink, ReactiveFormsModule],
  templateUrl: './add-quiz.component.html',
  styleUrl: './add-quiz.component.scss'
})
export class AddQuizComponent {
 addQuiz_title = "Créer un quiz"

  formBuilder: FormBuilder = inject(FormBuilder);
  http: HttpClient = inject(HttpClient);
  router: Router = inject(Router);

  dataSource: any;

  ngOnInit() {
    
  }

  submitted = false;
  formulaire: FormGroup = this.formBuilder.group({
    title: ['',[Validators.required, Validators.minLength(3)]],
    group: [null, [Validators.required]]
  });

  onAddQuiz() {
    const jwt = localStorage.getItem('jwt');
    console.log('JWT:', jwt);
    
    console.log(this.formulaire.value)
    this.submitted = true;
    if (this.formulaire.valid) {
      this.http
        .post('http://127.0.0.1:8000/api/quizzes', this.formulaire.value, { headers: { Authorization: 'Bearer ' + jwt, 'Content-Type': 'application/ld+json' } })
        .subscribe((newQuiz) => {
          console.log(newQuiz)
          this.router.navigateByUrl('/quizlists');
        });
    }
  }
}
