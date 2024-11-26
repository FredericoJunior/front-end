import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';

import { AuthService } from './../../services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [MenubarModule, CommonModule],
})
export class MenuComponent implements OnInit {
  items: MenuItem[] | undefined;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const userPermissions = JSON.parse(localStorage.getItem('permissions') || '[]');

    this.items = [
      {
        label: 'Ordem de Serviço',
        icon: 'pi pi-briefcase', // Ícone de pasta de trabalho
        route: '/ordem-servico',
        permission: 'workorder:read',
      },
      {
        label: 'Equipamentos',
        icon: 'pi pi-cog', // Ícone de engrenagem
        route: '/equipamento',
        permission: 'equipment:read',
      },
      {
        label: 'Usuários',
        icon: 'pi pi-users', // Ícone de usuários
        route: '/usuario',
        permission: 'user:read',
      },
      {
        label: 'Relatórios',
        icon: 'pi pi-chart-line', // Ícone de gráfico de linha
        route: '/relatorio',
        permission: 'report:read',
      },
      // {
      //   label: 'Status Ordem de Serviço',
      //   icon: 'pi pi-info-circle',
      //   route: '/status-ordem-servico',
      // },
      {
        label: 'Notificações',
        icon: 'pi pi-bell', // Ícone de sino
        route: '/notificacao',
      },
      {
        label: 'Logout',
        icon: 'pi pi-user', // Ícone de usuário
        command: () => this.logout(),
      },
    ].filter(item => !item.permission || userPermissions.includes(item.permission));
  }

  logout() {
    this.router.navigate(['/login']);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.authService.logout().subscribe();
  }
}