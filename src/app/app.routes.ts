import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { QuizlistsComponent } from './quizlists/quizlists.component';
import { QuestionlistsComponent } from './questionlists/questionlists.component';
import { AddQuizComponent } from './add-quiz/add-quiz.component';
import { AddquestionComponent } from './addquestion/addquestion.component';
import { StartGameComponent } from './start-game/start-game.component';
import { InvitePlayersComponent } from './invite-players/invite-players.component';
import { WaitingRoomComponent } from './waiting-room/waiting-room.component';
import { EnterGameComponent } from './enter-game/enter-game.component';
import { GameComponent } from './game/game.component';
import { ScoreComponent } from './score/score.component';
import { RankingComponent } from './ranking/ranking.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { SettingComponent } from './setting/setting.component';
import { UserInformationsComponent } from './user-informations/user-informations.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { CreateOrganizationComponent } from './create-organization/create-organization.component';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'signup', component: SignupComponent},
    {path: 'dashboard', component: DashboardComponent},
    {path: 'quizlists', component: QuizlistsComponent},
    {path: 'questionlist', component: QuestionlistsComponent},
    {path: 'addquiz', component: AddQuizComponent},
    {path: 'addquestion', component: AddquestionComponent},
    {path: 'startgame', component: StartGameComponent},
    {path: 'inviteplayers', component: InvitePlayersComponent},
    {path: 'waitingroom', component: WaitingRoomComponent},
    {path: 'entergame', component: EnterGameComponent},
    {path: 'game', component: GameComponent},
    {path: 'score', component: ScoreComponent},
    {path: 'rank', component: RankingComponent},
    {path: 'statistics', component: StatisticsComponent},
    {path: 'setting', component: SettingComponent},
    {path: 'userinfos', component: UserInformationsComponent},
    {path: 'changepassword', component: ChangePasswordComponent},
    {path: 'createorganization', component: CreateOrganizationComponent},
    {path: 'nav', component: NavbarComponent},


];
