import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class NotificaoService {
  private apiUrl = 'v1/private/notification/send-notification';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const accessToken = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro desconhecido.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      errorMessage = `Erro ${error.status}: ${error.message}`;
    }
    console.error('An error occurred:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  private handle403Error(request: () => Observable<any>): Observable<any> {
    return this.authService.refreshToken().pipe(
      switchMap((tokens: any) => {
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        return request();
      }),
      catchError(this.handleError)
    );
  }

  listNotificationsByUser(): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.log("🚀 ~ file: notificacao.service.ts:56 ~ NotificaoService ~ catchError ~ error:", error);
          if (error.status === 403) {
            return this.handle403Error(() => this.listNotificationsByUser());
          } else {
            return this.handleError(error);
          }
        })
      );
  }

  readNotification(id: number): Observable<void> {
    return this.http
      .get<void>(`${this.apiUrl}${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.log("🚀 ~ file: notificacao.service.ts:72 ~ NotificaoService ~ catchError ~ error:", error);
          if (error.status === 403) {
            return this.handle403Error(() => this.readNotification(id));
          } else {
            return this.handleError(error);
          }
        })
      );
  }
}
