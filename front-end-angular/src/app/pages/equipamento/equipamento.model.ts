export interface EquipamentDto {
  id?: number; //number gerado pelo sistema
  number: string; //string(100)
  ownership: string; //string(20)
  qrCode?: string; //string(1000) gerado automaticamente
}