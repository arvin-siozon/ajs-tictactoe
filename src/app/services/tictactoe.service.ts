import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { PlayerPosition } from '../player/PlayerPosition';
import { Player } from '../player/Player';

@Injectable({
  providedIn: 'root',
})
export class TictactoeService {
  /// Define API
  apiURL = 'https://localhost:44379/api/TicTacToeGame';

  constructor(private http: HttpClient) {}

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  gameResults(playersPosition: Array<PlayerPosition>): Observable<Player> {
    return this.http
      .post<Player>(this.apiURL, playersPosition, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
  // Error handling
  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}
