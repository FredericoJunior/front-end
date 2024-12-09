import { Component, OnInit } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { NotificaoService } from './../../services/notificacao.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-notificacao',
  standalone: true,
  imports: [MenuComponent, CardModule, ButtonModule],
  templateUrl: './notificacao.component.html',
  styleUrls: ['./notificacao.component.scss'],
  providers: [MessageService],
})
export class NotificacaoComponent implements OnInit {
  notificacao: any;

  constructor(
    private notificacaoService: NotificaoService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.notificacaoService.listNotificationsByUser().subscribe(
      (data) => {
        this.notificacao = data;
        console.log("🚀 ~ file: notificacao.component.ts:28 ~ NotificacaoComponent ~ ngOnInit ~ this.notificacao:", this.notificacao);
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao carregar notificações',
        });
      }
    );
  }

  readNotification(id: number) {
    this.notificacaoService.readNotification(id).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Notificação lida com sucesso',
        });
      },
      () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao ler notificação',
        });
      }
    );
  }
}