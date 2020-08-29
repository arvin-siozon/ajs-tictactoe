import { Injectable } from '@angular/core';
import { ScoreBoard } from '../scoreboard/scoreboard';
import { Observable, BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ScoreBoardService {
  playerScores$: BehaviorSubject<ScoreBoard> = new BehaviorSubject(
    new ScoreBoard(0, 0)
  );

  publish(score: ScoreBoard) {
    this.playerScores$.next(score);
    console.log(
      'ScoreBoardService: O:' + score.oPlayer + ':  X:' + score.xPlayer
    );
  }
}
