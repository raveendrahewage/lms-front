import { Routes } from '@angular/router';
import { SignInComponent } from './feature/sign-in/sign-in.component';
import { authGuard } from './feature/dashboard/auth/auth.guard';
import { PageNotfoundComponent } from './core/page-notfound/page-notfound.component';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import(
        './feature/dashboard/dashboard-routing/dashboard-routing.module'
      ).then((m) => m.DASHBOARD_ROUTES),
    canActivate: [authGuard],
  },
  { path: '', component: SignInComponent },
  { path: '**', component: PageNotfoundComponent },
];
