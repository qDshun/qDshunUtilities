import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { WorldSelectComponent } from './components/loot-tables/world-select/world-select.component';
import { authGuard } from './guards';

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
    path: 'worlds',
    component: WorldSelectComponent,
    title: 'Worlds',
    canActivate: [authGuard]
  },
];
