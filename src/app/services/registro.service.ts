import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { ReportsFilterDto } from '../pages/relatorio/relatorio.models';

@Injectable({
  providedIn: 'root',
})
export class RegistroService {
  private apiUrl = 'https://devterrasa.com/java/v1/private/reports/';

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

  getRelatorioExcel(filterDto: ReportsFilterDto): Observable<Blob> {
    return this.http
      .post(`${this.apiUrl}excel`, filterDto, {
        headers: this.getHeaders(),
        responseType: 'blob',
      })
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            return this.handle403Error(() => this.getRelatorioExcel(filterDto));
          } else {
            return this.handleError(error);
          }
        })
      );
  }

  getRelatorioPdf(filterDto: ReportsFilterDto): Observable<Blob> {
    return this.http
      .post(`${this.apiUrl}pdf`, filterDto, {
        headers: this.getHeaders(),
        responseType: 'blob',
      })
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            return this.handle403Error(() => this.getRelatorioPdf(filterDto));
          } else {
            return this.handleError(error);
          }
        })
      );
  }
}
