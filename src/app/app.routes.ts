import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { QuizlistsComponent } from './quizlists/quizlists.component';
import { QuestionlistsComponent } from './questionlists/questionlists.component';
import { AddQuizComponent } from './add-quiz/add-quiz.component';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'signup', component: SignupComponent},
    {path: 'dashboard', component: DashboardComponent},
    {path: 'quizlists', component: QuizlistsComponent},
    {path: 'questionlist', component: QuestionlistsComponent},
    {path: 'addquiz', component: AddQuizComponent},
    {path: 'nav', component: NavbarComponent},


];
