import { Component, inject } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-score',
  standalone: true,
  imports: [NavbarComponent,RouterLink],
  templateUrl: './score.component.html',
  styleUrl: './score.component.scss'
})
export class ScoreComponent {
  constructor(
    private meta: Meta,
    private title: Title,
  ) {}

  score_title="Votre score"
  background="background-color : #FBF0D1;" // ou dans le cas du perdant #E9E9EC
  msg_for_player="le rang ou s'il est gagnant ou perdant"
  team_player="nom de l'équipe"
  score="50%"
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);

  player_name:string | null = sessionStorage.getItem('player_name')
  player_score:string | undefined | null = null
  user_avatar:string =`https://api.dicebear.com/9.x/fun-emoji/svg?seed=${Math.floor(Math.random() * 100)}&size=120&scale=90&radius=15&backgroundColor=059ff2,71cf62,d84be5,fcbc34&mouth=cute,kissHeart,lilSmile,smileLol,smileTeeth,tongueOut,wideSmile`


  private setMetaData() {
    this.title.setTitle('Score - Infinite Quiz');
    this.meta.addTags([
      { name: 'description', content: 'Fin de la partie, affichage du score' },
      { name: 'robots', content: 'noindex, nofollow' } // Empêche l'indexation de cette page
    ]);
  }

  ngOnInit(){
    this.setMetaData();

    this.route.queryParams.subscribe(params => {
      this.player_score = params['score'];
    });
    console.log(this.player_name)
    console.log(this.player_score)
  }

  //  Dans le cas où l'api ne fourni pas d'image j'applique image par defaut
  onError(){
    this.user_avatar="/assets/images/logo.png"
  }


}
