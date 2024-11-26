import { Component } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { NotificaoService } from './../../services/notificacao.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-notificacao',
  standalone: true,
  imports: [ MenuComponent, CardModule, ButtonModule ],
  templateUrl: './notificacao.component.html',
  styleUrl: './notificacao.component.scss',
  providers: [MessageService],
})
export class NotificacaoComponent {
  notificacao: any;

  constructor(
    private notificacaoService: NotificaoService,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    // this.notificacaoService.getAllNotificacao().subscribe(
    //   (response) => {
    //     console.log(response);
    //     this.notificacao = response;
    //     console.log("🚀 ~ file: notificacao.component.ts:28 ~ NotificacaoComponent ~ ngOnInit ~ this.notificacao:", this.notificacao);
    //   },
    //   (error) => {
    //     this.messageService.add({
    //       severity: 'error',
    //       summary: 'Erro',
    //       detail: error.message,
    //     });
    //   }
    // );
  }
}