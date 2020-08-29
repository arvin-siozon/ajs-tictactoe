import { Component, OnInit } from '@angular/core';
import { ScoreBoardService } from '../services/scoreboard.service';
@Component({
  selector: 'score-board',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.scss'],
})
export class ScoreboardComponent implements OnInit {
  playerScores$ = this.scoreService.playerScores$;

  constructor(private scoreService: ScoreBoardService) {}

  ngOnInit() {
    console.log(this.playerScores$);
  }
}
