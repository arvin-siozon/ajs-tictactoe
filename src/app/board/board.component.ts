import { Component, HostListener, OnInit } from '@angular/core';
import { Square } from '../square/square';
import { Player } from '../player/player';
import { PlayerPosition } from '../player/PlayerPosition';
import { TictactoeService } from '../services/tictactoe.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ScoreBoard } from '../scoreboard/scoreboard';
import { ScoreBoardService } from '../services/scoreboard.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  squares: Square[];
  playerTurn: boolean;
  winner: string;
  isDraw: boolean;
  disable: boolean;
  xPlayerWins: number;
  oPlayerWins: number;
  keyValue: number;
  players: Array<Player>;
  playerResult: Player;
  positionOfPlayers: Array<PlayerPosition>;
  restApi: TictactoeService;
  window: Window;

  possibleWins = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  // Injecting Services

  constructor(
    private tictactoeService: TictactoeService,
    private scoreBoardService: ScoreBoardService,
    public actRoute: ActivatedRoute,
    public router: Router
  ) {
    this.restApi = tictactoeService;
  }

  ngOnInit() {
    // Intializing the Game
    this.startNewGame();
    this.resetScoreBoard();
  }
  resetScoreBoard() {
    this.xPlayerWins = 0;
    this.oPlayerWins = 0;
    this.scoreBoardService.publish(
      new ScoreBoard(this.xPlayerWins, this.oPlayerWins)
    );
    console.log('reset score');
  }
  resetGameBoard() {
    this.positionOfPlayers = [
      { Player: '0' },
      { Player: '1' },
      { Player: '2' },
      { Player: '3' },
      { Player: '4' },
      { Player: '5' },
      { Player: '6' },
      { Player: '7' },
      { Player: '8' },
    ];
  }
  public startNewGame() {
    // reset/start the game

    this.squares = Array(9).fill(null);
    this.resetGameBoard();
    this.playerTurn = true;
    this.winner = null;
    this.isDraw = false;
    this.disable = false;
  }
  get boardMarker() {
    return this.playerTurn ? 'X' : 'O';
  }

  //Listed to keyboard input
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    this.getValidKey(event.key);
  }
  getValidKey(key: string) {
    let charArray: Array<string> = [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
    ];
    if (charArray.includes(key)) {
      this.keyValue = Number(key);
      //console.log('key:' + key);
      this.playerMakesMove(this.keyValue);
    }
  }
  playerMakesMove(index: number) {
    // check if square is empty

    if (this.squares[index] === null) {
      // update/mark the board with player's symbol X/O
      this.squares.splice(index, 1, { player: this.boardMarker, win: false });
      this.positionOfPlayers.splice(index, 1, { Player: this.boardMarker });
      // switch player
      this.playerTurn = !this.playerTurn;
      //get game result from API
      this.getWinnerApi(this.positionOfPlayers);
    }
  }

  getWinnerApi(input: PlayerPosition[]) {
    this.restApi.gameResults(input).subscribe((data: Player) => {
      this.playerResult = data;
      this.manageBoardGameResult(data);
    });
  }
  manageBoardGameResult(player: Player) {
    if (player.playerName === 'draw') {
      this.alertMessage("Cats's game!", 'info');
    } else if (player.winner) {
      if (player.playerName === 'X') {
        this.xPlayerWins += 1;
      } else if (player.playerName === 'O') {
        this.oPlayerWins += 1;
      }

      this.scoreBoardService.publish(
        new ScoreBoard(this.xPlayerWins, this.oPlayerWins)
      );
      this.alertMessage('Player ' + player.playerName + ' won!', 'success');

      console.log('game result: ' + player.playerName + '' + player.winner);
    }
  }
  alertMessage(message: string, icon: string) {
    Swal.fire({
      title: 'Game Result',
      text: message,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Play again',
      cancelButtonText: 'Quit',
      allowEscapeKey: false,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.value) {
        this.startNewGame();
        //retain the score
      } else {
        this.startNewGame();
        this.resetScoreBoard();
      }
    });
  }
}
