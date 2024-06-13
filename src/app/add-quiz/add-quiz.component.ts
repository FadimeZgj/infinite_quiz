import { Component, inject } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { jwtDecode } from 'jwt-decode';


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
  //   const jwt:any = localStorage.getItem('jwt');
  //   console.log('JWT:', jwt);

  //    // Decode JWT to get user ID
  //    const decodedToken: any = jwtDecode(jwt);
  // const username = decodedToken?.username; // Assuming 'sub' contains user ID

  // this.http.get(`http://127.0.0.1:8000/api/users?username=${username}`, { headers: { Authorization: 'Bearer ' + jwt } })
  // .subscribe((response: any) => {
  //   const userId = response['hydra:member'][0]?.id;

  //   console.log(userId)
  // })
  }

  submitted = false;
  formulaire: FormGroup = this.formBuilder.group({
    title: ['',[Validators.required, Validators.minLength(3)]],
    group: [null, [Validators.required]],
  });

  onAddQuiz() {
    const jwt:any = localStorage.getItem('jwt');
    console.log('JWT:', jwt);

    // Decode JWT to get username
    const decodedToken: any = jwtDecode(jwt);
    const username = decodedToken?.username; // Adjust based on your JWT structure

    // Get user ID by username
    this.http.get(`http://127.0.0.1:8000/api/users?username=${username}`, { headers: { Authorization: 'Bearer ' + jwt } })
      .subscribe((response: any) => {
        const userId = response['hydra:member'][0]?.id;

        console.log(this.formulaire.value)
        this.submitted = true;
        if (this.formulaire.valid && userId) {
          const quizData = {
            ...this.formulaire.value,
            user: `http://127.0.0.1:8000/api/users/${userId}` // Adjust based on your API structure
          };

          console.log(quizData)

          this.http
            .post('http://127.0.0.1:8000/api/quizzes', quizData, { headers: { Authorization: 'Bearer ' + jwt, 'Content-Type': 'application/ld+json' } })
            .subscribe((newQuiz) => {
              console.log(newQuiz)
              this.router.navigateByUrl('/quizlists');
            });
        }
      });
  }
}
