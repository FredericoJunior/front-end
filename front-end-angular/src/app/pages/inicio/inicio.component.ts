import { Component } from '@angular/core';

import { CardModule } from 'primeng/card';

import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [MenuComponent, CardModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss',
})
export class InicioComponent {
  usuarioLogado: string;

  constructor() {
    const userName = localStorage.getItem('userName');
    this.usuarioLogado = userName ? userName : 'Usuário';
  }
}
