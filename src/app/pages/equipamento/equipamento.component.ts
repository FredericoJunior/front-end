import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

import { MenuComponent } from '../menu/menu.component';
import { EquipamentoService } from '../../services/equipamento.service';
import { EquipamentDto } from './equipamento.model';

@Component({
  selector: 'app-equipamento',
  standalone: true,
  imports: [
    TableModule,
    CardModule,
    CommonModule,
    MenuComponent,
    DialogModule,
    ReactiveFormsModule,
    InputTextModule,
    ToastModule,
    ConfirmDialogModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './equipamento.component.html',
  styleUrl: './equipamento.component.scss',
})
export class EquipamentoComponent {
  dados: EquipamentDto[] = [];
  dadosOriginais: EquipamentDto[] = [];
  displayDialog: boolean = false;
  selectedItem: EquipamentDto = {} as EquipamentDto;
  isEditMode: boolean = false;
  dialogTitle: string = '';
  equipamentoForm: FormGroup;
  globalFilterFields: string[] = ['id', 'number', 'ownership', 'qrCode'];
  filters: { [key: string]: string } = {};

  hasPermission: boolean;

  constructor(
    private fb: FormBuilder,
    private equipamentoService: EquipamentoService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
  ) {
    this.equipamentoForm = this.fb.group({
      id: [null],
      number: ['', Validators.required],
      ownership: ['', Validators.required],
      qrCode: ['', Validators.required],
    });

    const userPermissions = JSON.parse(
      localStorage.getItem('permissions') || '[]'
    );
    this.hasPermission = userPermissions.includes('equipment:read');

    if (!this.hasPermission) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Você não tem permissão para acessar esta página.',
      });
      this.router.navigate(['/inicio']);
    }
  }

  ngOnInit() {
    this.getEquipamento();
  }

  getEquipamento() {
    this.equipamentoService.getAllEquipamento().subscribe({
      next: (response) => {
        this.dados = response;
        this.dadosOriginais = [...response];
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  openAddDialog() {
    this.dialogTitle = 'Adicionar Equipamento';
    this.selectedItem = {} as EquipamentDto;
    this.isEditMode = false;
    this.displayDialog = true;
    this.equipamentoForm.reset();
  }

  openEditDialog(item: EquipamentDto) {
    this.dialogTitle = 'Editar Equipamento';
    this.selectedItem = { ...item };
    this.isEditMode = true;
    this.displayDialog = true;
    this.equipamentoForm.patchValue(this.selectedItem);
  }

  onSubmit() {
    if (this.equipamentoForm.valid) {
      this.selectedItem = this.equipamentoForm.value;
      this.saveItem();
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Por favor, preencha todos os campos obrigatórios.',
      });
    }
  }

  saveItem() {
    if (this.isEditMode) {
      this.equipamentoService.updateEquipamento(this.selectedItem).subscribe({
        next: (response) => {
          const index = this.dados.findIndex(
            (d) => d.id === this.selectedItem.id
          );
          if (index !== -1) {
            this.dados[index] = response;
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Equipamento atualizado com sucesso',
            });
          }
          this.displayDialog = false;
        },
        error: (error) => {
          console.error(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao atualizar equipamento',
          });
        }
      });
    } else {
      this.equipamentoService.createEquipamento(this.selectedItem).subscribe({
        next: (response) => {
          this.dados.push(response);
          this.dadosOriginais.push(response);
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Equipamento adicionado com sucesso',
          });
          this.displayDialog = false;
        },
        error: (error) => {
          console.error(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao adicionar equipamento',
          });
        }
      });
    }
  }

  confirm2(event: Event, item: EquipamentDto) {
    this.selectedItem = item;
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Você deseja deletar esse equipamento?',
      header: 'Confirmar exclusão',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      accept: () => {
        this.deleteItem(item);
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Recusado',
          detail: 'Equipamento não deletado',
        });
      },
    });
  }

  deleteItem(item: EquipamentDto) {
    if (typeof item.id === 'number' && item.id !== null && item.id !== undefined) {
      this.equipamentoService.deleteEquipamento(item.id).subscribe(
        () => {
          this.dados = this.dados.filter((d) => d.id !== item.id);
          this.dadosOriginais = this.dadosOriginais.filter(
            (d) => d.id !== item.id
          );
          this.messageService.add({
            severity: 'info',
            summary: 'Confirmado',
            detail: 'Equipamento deletado',
          });
        },
        (error) => {
          console.error(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao deletar equipamento',
          });
        }
      );
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'ID do equipamento é inválido',
      });
    }
  }

  applyFilter(event: Event, field: string) {
    const input = event.target as HTMLInputElement;
    this.filters[field] = input.value.toLowerCase();
    this.dados = this.dadosOriginais.filter((item: any) => {
      return Object.keys(this.filters).every((key) => {
        return item[key].toString().toLowerCase().includes(this.filters[key]);
      });
    });
  }

  refreshData() {
    this.equipamentoService.getAllEquipamento().subscribe({
      next: (response) => {
        this.dados = response;
        this.dadosOriginais = [...response];
        this.filters = {};
        const filterInputs = document.querySelectorAll('.header-table input');
        filterInputs.forEach(
          (input) => ((input as HTMLInputElement).value = '')
        );
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Página atualizada com sucesso',
        });
      },
      error: (error) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao atualizar página',
        });
      }
    });
  }
}