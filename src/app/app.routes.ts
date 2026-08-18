import { Routes } from '@angular/router';
import { authGuard } from './feature/dashboard/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import(
        './feature/dashboard/dashboard-routing/dashboard-routing.module'
      ).then((m) => m.DASHBOARD_ROUTES),
    canActivate: [authGuard],
  },
  {
    path: '',
    loadComponent: () =>
      import('./feature/sign-in/sign-in.component').then(
        (m) => m.SignInComponent
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./core/page-notfound/page-notfound.component').then(
        (m) => m.PageNotfoundComponent
      ),
  },
];

