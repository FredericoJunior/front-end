import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";

import { TableModule } from "primeng/table";
import { CardModule } from "primeng/card";
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from "primeng/inputtext";
import { ConfirmationService, MessageService } from "primeng/api";
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ToastModule } from "primeng/toast";
import { DropdownModule } from 'primeng/dropdown';

import { MenuComponent } from "../menu/menu.component";
import { OrdemServicoService } from "../../services/ordem-servico.service";
import { EquipamentoService } from '../../services/equipamento.service';
import { UserService } from "../../services/user.service";
import { WorkOrderDto } from './ordem-servico.model';
import { EquipamentDto } from '../equipamento/equipamento.model';
import { UserDto } from '../usuario/usuario.model';

@Component({
  selector: 'app-ordem-servico',
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
    DropdownModule,
    CalendarModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './ordem-servico.component.html',
  styleUrl: './ordem-servico.component.scss'
})
export class OrdemServicoComponent implements OnInit {
  dados: WorkOrderDto[] = [];
  dadosOriginais: WorkOrderDto[] = [];
  filters: { [key: string]: string } = {};
  ordemServicoForm: FormGroup;
  workOrderForm: FormGroup;
  closingForm: FormGroup;
  displayDialog: boolean = false;
  dialogTitle: string = '';
  hasPermission: boolean;
  equipamento: EquipamentDto[] = [];
  equipamentoSelecionado: EquipamentDto | null = null;
  user: UserDto[] = [];
  userSelecionado: UserDto | null = null;

  constructor(
    private fb: FormBuilder,
    private ordemServicoService: OrdemServicoService,
    private equipamentoService: EquipamentoService,
    private messageService: MessageService,
    private router: Router,
    private usuarioService: UserService,
  ) {
    this.ordemServicoForm = this.fb.group({
      id: [null],
      equipament: ['', Validators.required],
      orderStatus: ['', Validators.required],
      requestedServicesDescription: ['', Validators.required],
      requesterName: ['', Validators.required],
      issueDate: ['', Validators.required],
      equipamentId: [null],
      hourMeter: ['', Validators.required],
    });

    this.workOrderForm = this.fb.group({
      equipamentNumber: [{ value: '', disabled: true }, Validators.required],
      orderStatus: ['', Validators.required],
      maintenanceLocation: [''],
      hourMeter: [''],
      requestedServicesDescription: ['', Validators.required],
      completedServicesDescription: [''],
      pendingServicesDescription: [''],
      responsibleMechanics: ['', Validators.required],
      requester: [{ value: '', disabled: true }, Validators.required],
      issueDate: [{ value: '', disabled: true }, Validators.required]
    });

    this.closingForm = this.fb.group({
      quantity15w40: [0.00, Validators.min(0)],
      quantityAw68: [0.00, Validators.min(0)],
      quantity428: [0.00, Validators.min(0)],
      quantity80W: [0.00, Validators.min(0)],
      quantity85w90: [0.00, Validators.min(0)],
      closingLaborValue: [0.00, Validators.min(0)],
      closingTransportation: [0.00, Validators.min(0)],
      closingThirdParties: [0.00, Validators.min(0)],
      closingOils: [0.00, Validators.min(0)],
      closingTotal: [{ value: 0.00, disabled: true }, Validators.min(0)]
    });

    const userPermissions = JSON.parse(
      localStorage.getItem('permissions') || '[]'
    );
    this.hasPermission = userPermissions.includes('workorder:read');
  }

  ngOnInit() {
    this.getOrdemServico();
    this.getEquipament();
    this.getUser();
  }
  
  onEquipamentChange(event: any) {
    this.equipamentoSelecionado = this.equipamento.find((e) => e.id === event.value) || null;
  }

  onRequesterChange(event: any) {
    this.userSelecionado = event.value;
  }

  getOrdemServico() {
    if (!this.hasPermission) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Você não tem permissão para acessar esta página.',
      });
      this.router.navigate(['/inicio']);
    }

    this.ordemServicoService.getAllOrdemServico().subscribe({
      next: (data) => {
        this.dados = data;
        this.dadosOriginais = [...data];
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar dados' });
      }
    });
  }

  getEquipament() {
    this.equipamentoService.getAllEquipamento().subscribe({
      next: (response) => {
        this.equipamento = response;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  getUser() {
    this.usuarioService.getAllUsuarios().subscribe({
      next: (response) => {
        this.user = response;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  openAddDialog() {
    this.dialogTitle = 'Adicionar Ordem de Serviço';
    this.ordemServicoForm.reset();
    this.displayDialog = true;
  }

  openEditDialog(item: WorkOrderDto) {
    this.dialogTitle = 'Editar Ordem de Serviço';
    const ordem = {
      id: item.id,
      equipament: item.equipament.id,
      orderStatus: item.orderStatus,
      requestedServicesDescription: item.requestedServicesDescription,
      requesterName: item.requester.id,
      hourMeter: item.hourMeter,
      issueDate: new Date(item.issueDate)
    }
    this.ordemServicoForm.patchValue(ordem);
    this.displayDialog = true;
  }

  onSubmit() {
    // if (this.ordemServicoForm.valid) {
    //   const formValue = this.ordemServicoForm.value;
    //   const ordemServico: WorkOrderCreateDto = {
    //     equipamentId: this.equipamentoSelecionado?.id.toString(),
    //     hourMeter: formValue.hourMeter,
    //     requestedServicesDescription: formValue.requestedServicesDescription,
    //   };

    //   if (formValue.id) {
    //     const workOrderDto: WorkOrderDto = {
    //       ...ordemServico,
    //       id: formValue.id,
    //       equipament: this.equipamentoSelecionado!,
    //       orderStatus: formValue.orderStatus,
    //       maintenanceLocation: '',
    //       issueDate: formValue.issueDate,
    //       lastModificationDate: '',
    //       completedServicesDescription: '',
    //       pendingServicesDescription: '',
    //       responsibleMechanics: [] as UserDto[],
    //       requester: this.userSelecionado!,
    //     };

    //     this.ordemServicoService.update(workOrderDto).subscribe(
    //       () => {
    //         this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Ordem de Serviço atualizada' });
    //         this.getOrdemServico();
    //         this.displayDialog = false;
    //       },
    //       (error) => {
    //         this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar Ordem de Serviço' });
    //       }
    //     );
    //   } else {
    //     this.ordemServicoService.create(ordemServico).subscribe(
    //       () => {
    //         this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Ordem de Serviço adicionada' });
    //         this.getOrdemServico();
    //         this.displayDialog = false;
    //       },
    //       (error) => {
    //         this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao adicionar Ordem de Serviço' });
    //       }
    //     );
    //   }
    // }
  }

  applyFilter(event: Event, field: string) {
    const input = event.target as HTMLInputElement;
    this.filters[field] = input.value.toLowerCase();
    this.dados = this.dadosOriginais.filter((item: any) => {
      return Object.keys(this.filters).every((key) => {
        const keys = key.split('.');
        let value = item;
        for (const k of keys) {
          value = value?.[k];
        }
        return value?.toString().toLowerCase().includes(this.filters[key]);
      });
    });
  }
}