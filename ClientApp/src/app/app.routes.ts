import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { authGuard } from './guards';
import { WorldSelectComponent } from './components/world-select/world-select.component';
import { WorldComponent } from './components/world/world.component';

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
    component: WorldSelectComponent,
    title: 'WorldSelect',
    canActivate: [authGuard]
  },
  {
    path: 'WorldSelect',
    component: WorldSelectComponent,
    title: 'WorldSelect',
    canActivate: [authGuard]
  },
  {
    path: 'World/:worldId',
    component: WorldComponent,
    title: 'WorldUI',
    canActivate: [authGuard]
  },
];
