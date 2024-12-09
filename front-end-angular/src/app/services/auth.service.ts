import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationDto } from './../pages/login/login.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://devterrasa.com/java/v1/public/auth';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const accessToken = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });
  }

  private handleError = (error: HttpErrorResponse) => {
    let errorMessage = 'Ocorreu um erro desconhecido.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      errorMessage = `Erro ${error.status}: ${error.message}`;
    }
    console.error('An error occurred:', errorMessage);
    return throwError(() => new Error(errorMessage));
  };

  login(authenticationDto: AuthenticationDto): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/login`, authenticationDto)
      .pipe(catchError(this.handleError));
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http
      .post(
        `${this.apiUrl}/refresh-token`,
        {},
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${refreshToken}`,
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  logout(): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/logout`, {}, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }
}
