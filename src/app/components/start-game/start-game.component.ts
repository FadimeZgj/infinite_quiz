import { Component, inject } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-start-game',
  standalone: true,
  imports: [NavbarComponent, RouterLink],
  templateUrl: './start-game.component.html',
  styleUrl: './start-game.component.scss',
})
export class StartGameComponent {
  start_game_title = 'Nom du quiz';

  http: HttpClient = inject(HttpClient);
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  quizId = this.route.snapshot.firstChild?.paramMap.get('quizId');

  ngOnInit() {
    this.getQuizTitle();
  }

  getQuizTitle() {
    const jwt = localStorage.getItem('jwt');
    this.http
      .get(`http://127.0.0.1:8000/api/quizzes/${this.quizId}`, {
        headers: { Authorization: 'Bearer ' + jwt },
      })
      .subscribe((response: any) => {
        this.start_game_title = response.title;
      });
  }

  onBeginGameSolo() {
    const jwt: any = localStorage.getItem('jwt');
    if (!jwt) {
      console.error('JWT token is missing');
      return;
    }

    // Decode JWT to get username
    const decodedToken: any = jwtDecode(jwt);
    const username = decodedToken?.username;
    if (!username) {
      console.error('Username is missing from decoded token');
      return;
    }

    const quizId = this.route.snapshot.firstChild?.paramMap.get('quizId');
    if (!quizId) {
      console.error('Quiz ID is missing');
      return;
    }

    // Step 1: Verify quiz exists
    this.http
      .get(`http://127.0.0.1:8000/api/quizzes/${quizId}`, {
        headers: { Authorization: 'Bearer ' + jwt },
      })
      .subscribe(
        (quizResponse: any) => {
          if (!quizResponse) {
            console.error('Quiz not found');
            return;
          }
          console.log('Quiz exists:', quizResponse);

          // Step 2: Fetch user
          this.http
            .get(`http://127.0.0.1:8000/api/users?username=${username}`, {
              headers: { Authorization: 'Bearer ' + jwt },
            })
            .subscribe(
              (userResponse: any) => {
                const userId = userResponse['hydra:member'][0]?.id;
                if (!userId) {
                  console.error('User ID is missing in the response');
                  return;
                }
                console.log('User found:', userResponse);

                // Step 3: Create a new player for the user
                const playerData = {
                  pseudo: username,
                  user: `http://127.0.0.1:8000/api/users/${userId}`,
                };

                this.http
                  .post(`http://127.0.0.1:8000/api/players`, playerData, {
                    headers: { Authorization: 'Bearer ' + jwt },
                  })
                  .subscribe(
                    (playerResponse: any) => {
                      const playerId = playerResponse.id;
                      if (!playerId) {
                        console.error('Player ID is missing in the response');
                        return;
                      }
                      console.log('Player created:', playerResponse);

                      // Step 4: Prepare game data
                      const gameData = {
                        quizId: Number(quizId),
                        teamId: 1, // Ensure this team ID exists
                        playerId: playerId,
                        secretCode: this.generateSecretCode(),
                        teamScore: 0,
                        playerScore: 0,
                      };

                      // Send POST request to create a new game
                      this.http
                        .post(`http://127.0.0.1:8000/api/games`, gameData, {
                          headers: { Authorization: 'Bearer ' + jwt },
                        })
                        .subscribe(
                          (createResponse: any) => {
                            console.log(
                              'Game created successfully',
                              createResponse
                            );
                            // Navigate to the game page with the necessary data
                            this.router.navigate(['/game'], {
                              queryParams: {
                                quizId: gameData.quizId,
                                teamId: gameData.teamId,
                                playerId: gameData.playerId,
                                uuid: createResponse.uuid,
                              },
                            });
                          },
                          (error) => {
                            console.error('Error creating game', error);
                          }
                        );
                    },
                    (error) => {
                      console.error('Error creating player', error);
                    }
                  );
              },
              (error) => {
                console.error('Error fetching user data', error);
              }
            );
        },
        (error) => {
          console.error('Error fetching quiz data', error);
        }
      );
  }

  // Utility function to generate a secret code
  generateSecretCode() {
    return Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit code
  }
}