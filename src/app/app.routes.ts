import { Routes } from '@angular/router';
import { EquipamentoComponent } from './pages/equipamento/equipamento.component';
import { LoginComponent } from './pages/login/login.component';
import { MenuComponent } from './pages/menu/menu.component';
import { RelatorioComponent } from './pages/relatorio/relatorio.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { OrdemServicoComponent } from './pages/ordem-servico/ordem-servico.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { NotificacaoComponent } from './pages/notificacao/notificacao.component'
import { AuthGuard } from './guards/auth.guard';
import { PermissionGuard } from './guards/permission.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'equipamento', component: EquipamentoComponent, canActivate: [AuthGuard, PermissionGuard], data: { permissions: ['equipment:read'] } },
  { path: 'inicio', component: InicioComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'menu', component: MenuComponent, canActivate: [AuthGuard] },
  { path: 'ordem-servico', component: OrdemServicoComponent, canActivate: [AuthGuard, PermissionGuard], data: { permissions: ['workorder:read'] } },
  { path: 'relatorio', component: RelatorioComponent, canActivate: [AuthGuard, PermissionGuard], data: { permissions: ['report:read'] } },
  { path: 'usuario', component: UsuarioComponent, canActivate: [AuthGuard, PermissionGuard], data: { permissions: ['user:read'] } },
  { path: 'notificacao', component: NotificacaoComponent, canActivate: [AuthGuard]},
  { path: '**', redirectTo: '/login' }
];
