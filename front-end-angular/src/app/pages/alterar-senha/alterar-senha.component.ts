import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuComponent } from '../menu/menu.component';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-alterar-senha',
  standalone: true,
  imports: [
    MenuComponent,
    PasswordModule,
    ToastModule,
    CardModule,
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
  ],
  templateUrl: './alterar-senha.component.html',
  styleUrls: ['./alterar-senha.component.scss'],
  providers: [MessageService],
})
export class AlterarSenhaComponent implements OnInit {
  alterarSenhaForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.alterarSenhaForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
    }, { validator: this.passwordMatchValidator });
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }

    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);

    const errors: ValidationErrors = {};
    if (!hasNumber) {
      errors['number'] = true;
    }
    if (!hasSpecialChar) {
      errors['specialChar'] = true;
    }
    if (!hasUpperCase) {
      errors['upperCase'] = true;
    }
    if (!hasLowerCase) {
      errors['lowerCase'] = true;
    }

    return Object.keys(errors).length ? errors : null;
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { 'mismatch': true };
    }
    return null;
  }

  onSubmit() {
    if (this.alterarSenhaForm.valid) {
      const senha = this.alterarSenhaForm.get('password')?.value;
      this.userService.changePassword(senha).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Senha alterada com sucesso.',
          });
          this.router.navigate(['/inicio']);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao alterar a senha.',
          });
          console.error(error);
        },
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Por favor, preencha todos os campos obrigatórios.',
      });
    }
  }
}