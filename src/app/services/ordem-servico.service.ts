import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { WorkOrderDto, ClosureDto, InputDataDto, OutputDto, WorkOrderCreateDto } from './../pages/ordem-servico/ordem-servico.model'

@Injectable({
  providedIn: 'root',
})
export class OrdemServicoService {
  private apiUrl = 'https://devterrasa.com/java/v1/private/work-order/';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const accessToken = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro desconhecido.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      errorMessage = `Erro ${error.status}: ${error.message}`;
    }
    console.error('An error occurred:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  handle403Error(request: () => Observable<any>): Observable<any> {
    return this.authService.refreshToken().pipe(
      switchMap((tokens: any) => {
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        return request();
      }),
      catchError(this.handleError)
    );
  }

  getOrdemServicoId(id: number): Observable<WorkOrderDto> {
    return this.http.get<WorkOrderDto>(`${this.apiUrl}${id}`, {
      headers: this.getHeaders(),
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          return this.handle403Error(() => this.getOrdemServicoId(id));
        } else {
          return this.handleError(error);
        }
      })
    );
  }

  getAllOrdemServico(): Observable<WorkOrderDto[]> {
    return this.http.get<WorkOrderDto[]>(`${this.apiUrl}`, {
      headers: this.getHeaders(),
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          return this.handle403Error(() => this.getAllOrdemServico());
        } else {
          return this.handleError(error);
        }
      })
    );
  }

  createOrdemServico(dto: WorkOrderCreateDto): Observable<WorkOrderCreateDto> {
    return this.http.post<WorkOrderCreateDto>(`${this.apiUrl}`, dto, {
      headers: this.getHeaders(),
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          return this.handle403Error(() => this.createOrdemServico(dto));
        } else {
          return this.handleError(error);
        }
      })
    );
  }

  createCompleteOrdemServico(dto: WorkOrderDto): Observable<WorkOrderDto> {
    console.log("🚀 ~ file: ordem-servico.service.ts:93 ~ OrdemServicoService ~ createCompleteOrdemServico ~ dto:", dto);
    return this.http.post<WorkOrderDto>(`${this.apiUrl}create`, dto, {
      headers: this.getHeaders(),
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          return this.handle403Error(() => this.createCompleteOrdemServico(dto));
        } else {
          return this.handleError(error);
        }
      })
    );
  }

  updateOrdemServico(dto: WorkOrderDto): Observable<WorkOrderDto> {
    return this.http.put<WorkOrderDto>(`${this.apiUrl}`, dto, {
      headers: this.getHeaders(),
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          return this.handle403Error(() => this.updateOrdemServico(dto));
        } else {
          return this.handleError(error);
        }
      })
    );
  }
}