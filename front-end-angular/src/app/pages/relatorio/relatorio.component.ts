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
import { ReportsFilterDto } from './relatorio.models';

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
  canRead: boolean;

  constructor(
    private fb: FormBuilder,
    private registroService: RegistroService,
    private messageService: MessageService,
    private router: Router,
  ) {
    const currentDate = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(currentDate.getMonth() - 1);
    this.relatorioForm = this.fb.group({
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      completedServices: [true],
      closure: [true],
      pendingServices: [true],
    });

    const userPermissions = JSON.parse(
      localStorage.getItem('permissions') || '[]'
    );
    this.canRead = userPermissions.includes('report:read');
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

  getFormData(): ReportsFilterDto {
    const formValue = this.relatorioForm.value;
    return {
      startDate: formValue.startDate.toISOString().split('T')[0] + ' 00:00:00',
      endDate: formValue.endDate.toISOString().split('T')[0] + ' 23:59:59',
      completedServices: formValue.completedServices,
      closure: formValue.closure,
      pendingServices: formValue.pendingServices,
    };
  }

  downloadExcelReport() {
    if (!this.canRead) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Você não tem permissão para executar essa ação.',
      });
      this.router.navigate(['/inicio']);
    }

    if (this.relatorioForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Por favor, preencha os campos de data corretamente.',
      });
      return;
    }

    const formData: ReportsFilterDto = this.getFormData();

    this.registroService.getRelatorioExcel(formData).subscribe({
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
    if (!this.canRead) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Você não tem permissão para executar essa ação.',
      });
      this.router.navigate(['/inicio']);
    }

    if (this.relatorioForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Por favor, preencha os campos de data corretamente.',
      });
      return;
    }

    const formData: ReportsFilterDto = this.getFormData();

    this.registroService.getRelatorioPdf(formData).subscribe({
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
