import { EquipamentDto } from '../equipamento/equipamento.model';
import { UserDto } from '../usuario/usuario.model';

export interface WorkOrderDto {
  id: number;
  equipament: EquipamentDto;
  orderStatus: string; //string(15)
  maintenanceLocation: string; //string(50)
  hourMeter: number;
  closing: ClosureDto;
  inputData: InputDataDto[];
  outputData: OutputDto[];
  issueDate: string;
  lastModificationDate: string;
  requestedServicesDescription: string;
  completedServicesDescription: string;
  pendingServicesDescription: string;
  responsibleMechanics: UserDto[];
  requester: UserDto;
}

export interface ClosureDto {
  id: number;
  quantity15w40: number;
  quantityAw68: number;
  quantity428: number;
  quantity80W: number;
  quantity85w90: number;
  responsible: UserDto;
  laborValue: number;
  transportation: number;
  thirdParties: number;
  oils: number;
  total: number;
}

export interface InputDataDto {
  id?: number;
  registrationDate: any;
  km: number;
  local: string;
}

export interface OutputDto {
  id?: number;
  registrationDate?: any;
  km: number;
  local: string;
}

export interface WorkOrderCreateDto {
  equipamentId?: string;
  hourMeter?: string;
  requestedServicesDescription?: string;
}

export interface WorkOrderLogDto {
  id: number;
  workOrder: WorkOrderDto;
  description: string; // tamanho 1000
  log_type: string; // tamanho 30
  logDate: string;
  actionUser: UserDto;
}
