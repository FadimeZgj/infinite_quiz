import { Routes } from '@angular/router';
import { userGuard } from './guard/user.guard';
import { userChildGuard } from './guard/user-child.guard';


export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./signup/signup.component').then((m) => m.SignupComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
      canActivate: [userGuard],
      canActivateChild: [userChildGuard],
    children: [
      {
        path: ':id',
        loadComponent: () =>
          import('./dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
    ],
  },
  {
    path: 'quizlists',
    loadComponent: () =>
      import('./quizlists/quizlists.component').then(
        (m) => m.QuizlistsComponent
      ),canActivate: [userGuard],
      
  },
  {
    path: 'questionlist',
    loadComponent: () =>
      import('./questionlists/questionlists.component').then(
        (m) => m.QuestionlistsComponent
      ),
      canActivate: [userGuard],
      canActivateChild: [userChildGuard],
    children: [
      {
        path: ':id',
        loadComponent: () =>
          import('./questionlists/questionlists.component').then(
            (m) => m.QuestionlistsComponent
          ),
      },
    ],
  },
  {
    path: 'addquiz',
    loadComponent: () =>
      import('./add-quiz/add-quiz.component').then((m) => m.AddQuizComponent),
    canActivate: [userGuard],
    
  },
  {
    path: 'addquestion',
    loadComponent: () =>
      import('./addquestion/addquestion.component').then(
        (m) => m.AddquestionComponent
      ),
      canActivate: [userGuard],
      canActivateChild: [userChildGuard],
    children: [
      {
        path: ':id',
        loadComponent: () =>
          import('./addquestion/addquestion.component').then(
            (m) => m.AddquestionComponent
          ),
      },
    ],
  },
  {
    path: 'startgame',
    loadComponent: () =>
      import('./start-game/start-game.component').then(
        (m) => m.StartGameComponent
      ),
      canActivate: [userGuard],
      canActivateChild: [userChildGuard],
    children: [
      {
        path: ':quizId',
        loadComponent: () =>
          import('./start-game/start-game.component').then(
            (m) => m.StartGameComponent
          ),
      },
    ],
  },
  {
    path: 'inviteplayers',
    loadComponent: () =>
      import('./invite-players/invite-players.component').then(
        (m) => m.InvitePlayersComponent
      ),
      canActivate: [userGuard],
  },
  {
    path: 'waitingroom',
    loadComponent: () =>
      import('./waiting-room/waiting-room.component').then(
        (m) => m.WaitingRoomComponent
      ),
      canActivate: [userGuard],
  },
  {
    path: 'entergame',
    loadComponent: () =>
      import('./enter-game/enter-game.component').then(
        (m) => m.EnterGameComponent
      ),
      canActivate: [userGuard],
  },
  {
    path: 'team',
    loadComponent: () =>
      import('./team/team.component').then((m) => m.TeamComponent),
    canActivate: [userGuard],
  },
  {
    path: 'game',
    loadComponent: () =>
      import('./game/game.component').then((m) => m.GameComponent),
    canActivate: [userGuard],
    
  },
  {
    path: 'score',
    loadComponent: () =>
      import('./score/score.component').then((m) => m.ScoreComponent),
    canActivate: [userGuard],
  },
  {
    path: 'rank',
    loadComponent: () =>
      import('./ranking/ranking.component').then((m) => m.RankingComponent),
    canActivate: [userGuard],
  },
  {
    path: 'statistics',
    loadComponent: () =>
      import('./statistics/statistics.component').then(
        (m) => m.StatisticsComponent
      ),
    canActivate: [userGuard],
  },
  {
    path: 'setting',
    loadComponent: () =>
      import('./setting/setting.component').then((m) => m.SettingComponent),
    canActivate: [userGuard],
  },
  {
    path: 'userinfos',
    loadComponent: () =>
      import('./user-informations/user-informations.component').then(
        (m) => m.UserInformationsComponent
      ),
    canActivate: [userGuard],
  },
  {
    path: 'changepassword',
    loadComponent: () =>
      import('./change-password/change-password.component').then(
        (m) => m.ChangePasswordComponent
      ),
    canActivate: [userGuard],
  },
  {
    path: 'createorganization',
    loadComponent: () =>
      import('./create-organization/create-organization.component').then(
        (m) => m.CreateOrganizationComponent
      ),
    canActivate: [userGuard],
  },
  {
    path: 'stafflist',
    loadComponent: () =>
      import('./stafflist/stafflist.component').then(
        (m) => m.StafflistComponent
      ),
    canActivate: [userGuard],
  },
  {
    path: 'staff',
    loadComponent: () =>
      import('./addstaff/addstaff.component').then((m) => m.AddstaffComponent),
    canActivate: [userGuard],
  },
  {
    path: 'logout',
    loadComponent: () =>
      import('./logout/logout.component').then((m) => m.LogoutComponent),
    canActivate: [userGuard],
  },
  
  { path: '**', redirectTo: 'login' },
];
