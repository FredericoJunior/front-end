import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';

import { RegistroService } from '../../services/registro.service';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-relatorio',
  standalone: true,
  imports: [
    CardModule,
    MenuComponent,
    ReactiveFormsModule,
    ToastModule,
    ConfirmDialogModule,
    CalendarModule,
    CheckboxModule,
  ],
  templateUrl: './relatorio.component.html',
  styleUrls: ['./relatorio.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class RelatorioComponent {
  relatorioForm: FormGroup;
  hasPermission: boolean = false;

  constructor(
    private fb: FormBuilder,
    private registroService: RegistroService,
    private messageService: MessageService,
    private router: Router,
  ) {
    this.relatorioForm = this.fb.group({
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      historico: [true],
      custos: [true],
      status: [true],
    });
  }

  ngOnInit() {
    const userPermissions = JSON.parse(
      localStorage.getItem('permissions') || '[]'
    );
    this.hasPermission = userPermissions.includes('report:read');

    if (!this.hasPermission) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Você não tem permissão para acessar esta página.',
      });
      this.router.navigate(['/inicio']);
    }
  }

  onSubmit() {
    if (this.relatorioForm.valid) {
      const formData = this.relatorioForm.value;
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Relatório gerado com sucesso',
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Por favor, preencha todos os campos obrigatórios.',
      });
    }
  }

  onCancel() {
    this.relatorioForm.reset();
  }

  downloadExcelReport() {
    this.registroService.getRelatorioExcel().subscribe({
      next: (response) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'equipament_report.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Relatório Excel baixado com sucesso',
        });
      },
      error: (error) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao baixar relatório Excel',
        });
      }
    });
  }

  downloadPdfReport() {
    this.registroService.getRelatorioPdf().subscribe({
      next: (response) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'equipament_report.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Relatório PDF baixado com sucesso',
        });
      },
      error: (error) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao baixar relatório PDF',
        });
      }
    });
  }
}
