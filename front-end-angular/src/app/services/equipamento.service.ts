import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { EquipamentDto } from './../pages/equipamento/equipamento.model';

@Injectable({
  providedIn: 'root',
})
export class EquipamentoService {
  private apiUrl = 'https://devterrasa.com/java/v1/private/equipament/';

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

  getEquipamentoId(id: number): Observable<EquipamentDto> {
    return this.http
      .get<EquipamentDto>(`${this.apiUrl}${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            return this.handle403Error(() => this.getEquipamentoId(id));
          } else {
            return this.handleError(error);
          }
        })
      );
  }

  getAllEquipamento(): Observable<EquipamentDto[]> {
    return this.http
      .get<EquipamentDto[]>(`${this.apiUrl}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            return this.handle403Error(() => this.getAllEquipamento());
          } else {
            return this.handleError(error);
          }
        })
      );
  }

  createEquipamento(dto: EquipamentDto): Observable<EquipamentDto> {
    return this.http
      .post<EquipamentDto>(`${this.apiUrl}`, dto, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            return this.handle403Error(() => this.createEquipamento(dto));
          } else {
            return this.handleError(error);
          }
        })
      );
  }

  updateEquipamento(dto: EquipamentDto): Observable<EquipamentDto> {
    return this.http
      .put<EquipamentDto>(`${this.apiUrl}`, dto, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            return this.handle403Error(() => this.updateEquipamento(dto));
          } else {
            return this.handleError(error);
          }
        })
      );
  }

  deleteEquipamento(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            return this.handle403Error(() => this.deleteEquipamento(id));
          } else {
            return this.handleError(error);
          }
        })
      );
  }

  getEquipamentoQrCode(qrCode: string): Observable<EquipamentDto> {
    return this.http
      .get<EquipamentDto>(`${this.apiUrl}qr-code/${qrCode}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            return this.handle403Error(() =>
              this.getEquipamentoQrCode(qrCode)
            );
          } else {
            return this.handleError(error);
          }
        })
      );
  }
}