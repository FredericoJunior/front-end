export interface ReportsFilterDto {
  startDate: string;
  endDate: string;
  completedServices: boolean;
  closure: boolean;
  pendingServices: boolean;
}
