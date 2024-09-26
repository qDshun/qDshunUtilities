import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { authGuard } from './guards';
import { WorldSelectComponent } from './components/portal/world-select/world-select.component';
import { WorldComponent } from './components/portal/world/world.component';
import { PortalLayoutComponent } from './components/portal/portal-layout/portal-layout.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Register',
  },
  {
    path: '',
    component: PortalLayoutComponent,
    title: 'Portal',
    canActivate: [authGuard],
    children: [
      {
        path: 'worlds',
        component: WorldSelectComponent,
        title: 'Choose a World',
      },
      {
        path: 'world/:worldId',
        component: WorldComponent,
        title: 'World UI',
      },
      {
        path: '',
        redirectTo: 'worlds',
        pathMatch: 'full'
      },
    ]
  },
];
