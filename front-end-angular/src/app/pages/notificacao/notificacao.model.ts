export interface NotificationDto {
    id: number;
    creationDate: string;
    userId: number;
    workOrderId: number;
    title: string;
    message: string; //tamanho 1000
    read: boolean;
    readAt: string;
  }