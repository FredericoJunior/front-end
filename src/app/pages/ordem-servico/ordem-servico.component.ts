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
import { TooltipModule } from 'primeng/tooltip';
import { InputTextareaModule } from 'primeng/inputtextarea';

import { MenuComponent } from "../menu/menu.component";
import { OrdemServicoService } from "../../services/ordem-servico.service";
import { EquipamentoService } from '../../services/equipamento.service';
import { UserService } from "../../services/user.service";
import { WorkOrderCreateDto, WorkOrderDto } from './ordem-servico.model';
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
    TooltipModule,
    InputTextareaModule,
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
  displayDialog: boolean = false;
  displayCompleteDialog: boolean = false;
  dialogTitle: string = '';
  hasPermission: boolean;
  equipamento: EquipamentDto[] = [];
  equipamentoSelecionado: EquipamentDto | null = null;
  user: UserDto[] = [];
  userSelecionado: UserDto | null = null;
  mecanicos: any | any[] = [];
  orderStatusOptions: any[] = [
    { label: 'ABERTO', value: 'ABERTO' },
    { label: 'EMANDAMENTO', value: 'EMANDAMENTO' },
    { label: 'FECHADA', value: 'FECHADA' },
  ]

  selectedWorkOrderId: number | null = null;
  selectedStatus: string = '';

  constructor(
    private fb: FormBuilder,
    private ordemServicoService: OrdemServicoService,
    private equipamentoService: EquipamentoService,
    private messageService: MessageService,
    private router: Router,
    private usuarioService: UserService,
  ) {
    this.ordemServicoForm = this.fb.group({
      equipament: [null, Validators.required],
      requester: [null, Validators.required],
      orderStatus: ['', Validators.required],
      maintenanceLocation: ['', Validators.required],
      hourMeter: ['', Validators.required],
      requestedServicesDescription: ['', Validators.required],
      completedServicesDescription: ['', Validators.required],
      pendingServicesDescription: ['', Validators.required],
      responsibleMechanics: [[], Validators.required],
      closing: this.fb.group({
        responsible: [null, Validators.required],
        quantity15w40: [0.00, Validators.min(0)],
        quantityAw68: [0.00, Validators.min(0)],
        quantity428: [0.00, Validators.min(0)],
        quantity80W: [0.00, Validators.min(0)],
        quantity85w90: [0.00, Validators.min(0)],
        laborValue: [0.00, Validators.min(0)],
        transportation: [0.00, Validators.min(0)],
        thirdParties: [0.00, Validators.min(0)],
        oils: [0.00, Validators.min(0)],
        total: [{ value: 0.00, disabled: true }, Validators.min(0)]
      })
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
    this.getMecanicos();
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
        console.log("🚀 ~ file: ordem-servico.component.ts:139 ~ OrdemServicoComponent ~ this.ordemServicoService.getAllOrdemServico ~ this.dados:", this.dados);
        this.dadosOriginais = [...data];

        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Todos os dados foram carregados com sucesso.',
        });
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

  getMecanicos() {
    this.usuarioService.getAllMecanicos().subscribe({
      next: (response) => {
        this.mecanicos = response.map((m) => m.name);
        console.log("🚀 ~ file: ordem-servico.component.ts:169 ~ OrdemServicoComponent ~ this.usuarioService.getAllMecanicos ~ this.mecanicos:", this.mecanicos);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  openDialog(item?: WorkOrderDto) {
    if (item) {
      this.dialogTitle = 'Editar Ordem de Serviço';
      this.ordemServicoForm.patchValue(item);
    } else {
      this.dialogTitle = 'Adicionar Ordem de Serviço';
      this.ordemServicoForm.reset();
    }
    this.displayDialog = true;
  }

  onSubmit() {
    // if (this.ordemServicoForm.valid) {
    //   if (this.ordemServicoForm.value.id) {
    //     this.updateOrdemServico();
    //   } else {
    //     this.createOrdemServico();
    //   }
    // }
  }

  onCompleteSubmit() {
    // if (this.closingForm.valid) {
    //   this.updateOrdemServico();
    // }
  }

  createOrdemServico() {
    const newOrdemServico: WorkOrderCreateDto = this.ordemServicoForm.value;
    this.ordemServicoService.createOrdemServico(newOrdemServico).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Ordem de Serviço criada com sucesso.',
        });
        this.displayDialog = false;
        this.getOrdemServico();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao criar Ordem de Serviço.',
        });
      }
    });
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