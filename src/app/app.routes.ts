import { Routes } from '@angular/router';

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
      ),
  },
  {
    path: 'questionlist',
    loadComponent: () =>
      import('./questionlists/questionlists.component').then(
        (m) => m.QuestionlistsComponent
      ),
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
  },
  {
    path: 'addquestion',
    loadComponent: () =>
      import('./addquestion/addquestion.component').then(
        (m) => m.AddquestionComponent
      ),
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
  },
  {
    path: 'waitingroom',
    loadComponent: () =>
      import('./waiting-room/waiting-room.component').then(
        (m) => m.WaitingRoomComponent
      ),
  },
  {
    path: 'entergame',
    loadComponent: () =>
      import('./enter-game/enter-game.component').then(
        (m) => m.EnterGameComponent
      ),
  },
  {
    path: 'team',
    loadComponent: () =>
      import('./team/team.component').then((m) => m.TeamComponent),
  },
  {
    path: 'game',
    loadComponent: () =>
      import('./game/game.component').then((m) => m.GameComponent),
  },
  {
    path: 'score',
    loadComponent: () =>
      import('./score/score.component').then((m) => m.ScoreComponent),
  },
  {
    path: 'rank',
    loadComponent: () =>
      import('./ranking/ranking.component').then((m) => m.RankingComponent),
  },
  {
    path: 'statistics',
    loadComponent: () =>
      import('./statistics/statistics.component').then(
        (m) => m.StatisticsComponent
      ),
  },
  {
    path: 'setting',
    loadComponent: () =>
      import('./setting/setting.component').then((m) => m.SettingComponent),
  },
  {
    path: 'userinfos',
    loadComponent: () =>
      import('./user-informations/user-informations.component').then(
        (m) => m.UserInformationsComponent
      ),
  },
  {
    path: 'changepassword',
    loadComponent: () =>
      import('./change-password/change-password.component').then(
        (m) => m.ChangePasswordComponent
      ),
  },
  {
    path: 'createorganization',
    loadComponent: () =>
      import('./create-organization/create-organization.component').then(
        (m) => m.CreateOrganizationComponent
      ),
  },
  {
    path: 'stafflist',
    loadComponent: () =>
      import('./stafflist/stafflist.component').then(
        (m) => m.StafflistComponent
      ),
  },
  {
    path: 'staff',
    loadComponent: () =>
      import('./addstaff/addstaff.component').then((m) => m.AddstaffComponent),
  },
  {
    path: 'logout',
    loadComponent: () =>
      import('./logout/logout.component').then((m) => m.LogoutComponent),
  },
  {
    path: 'nav',
    loadComponent: () =>
      import('./navbar/navbar.component').then((m) => m.NavbarComponent),
  },
  { path: '**', redirectTo: 'login' },
];
