import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { AuthService } from '../../services/auth.service';
import { AuthenticationDto } from './login.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    ToastModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService],
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private messageService: MessageService,
    private authService: AuthService
  ) { }

  onSubmit() {
    const authenticationDto: AuthenticationDto = {
      login: this.email,
      password: this.password,
    };

    this.authService.login(authenticationDto).subscribe({
      next: (response) => {
        const { accessToken, refreshToken } = response;

        localStorage.setItem('userName', response.userName);
        localStorage.setItem('userLogin', response.userLogin);
        localStorage.setItem('userRole', response.userRole);
        localStorage.setItem(
          'permissions',
          JSON.stringify(response.permissions)
        );
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Login realizado com sucesso!',
        });
        this.router.navigate(['/inicio']);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Login falhou. Verifique suas credenciais.',
        });
        console.error(error);
      },
    });
  }
}
