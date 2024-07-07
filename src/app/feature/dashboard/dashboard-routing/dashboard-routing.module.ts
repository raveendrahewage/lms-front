import { MyProfileComponent } from './../profile-contents/my-profile/my-profile.component';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { MainLayoutComponent } from '../main-layout/main-layout.component';
import { EmployeeMainComponent } from '../employee-contents/employee-main/employee-main.component';
import { EmployeeDetailsComponent } from '../employee-contents/employee-details/employee-details.component';
import { EmployeeListComponent } from '../employee-contents/employee-list/employee-list.component';
import { EmployeeManageComponent } from '../employee-contents/employee-manage/employee-manage.component';
import { adminAuthGuard } from '../auth/adminAuth.guard';
import { LeaveMainComponent } from '../leave-contents/leave-main/leave-main.component';
import { LeaveManageComponent } from '../leave-contents/leave-manage/leave-manage.component';
import { LeaveListComponent } from '../leave-contents/leave-list/leave-list.component';
import { LeaveDetailsComponent } from '../leave-contents/leave-details/leave-details.component';
import { LeaveTypeMainComponent } from '../leave-type-contents/leave-type-main/leave-type-main.component';
import { LeaveTypeListComponent } from '../leave-type-contents/leave-type-list/leave-type-list.component';
import { LeaveTypeDetailsComponent } from '../leave-type-contents/leave-type-details/leave-type-details.component';
import { LeaveTypeManageComponent } from '../leave-type-contents/leave-type-manage/leave-type-manage.component';
import { EventMainComponent } from '../event-contents/event-main/event-main.component';
import { EventListComponent } from '../event-contents/event-list/event-list.component';
import { EventManageComponent } from '../event-contents/event-manage/event-manage.component';
import { EventDetailsComponent } from '../event-contents/event-details/event-details.component';
import { DashboardMainComponent } from '../dashboard-main/dashboard-main.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: DashboardMainComponent },
      {
        path: 'employees',
        component: EmployeeMainComponent,
        children: [
          { path: '', redirectTo: 'details', pathMatch: 'full' },
          { path: 'details', component: EmployeeListComponent },
          { path: 'details/:id', component: EmployeeDetailsComponent },
          {
            path: 'new',
            component: EmployeeManageComponent,
            canActivate: [adminAuthGuard],
          },
        ],
      },
      {
        path: 'leaves',
        component: LeaveMainComponent,
        children: [
          { path: '', redirectTo: 'details', pathMatch: 'full' },
          { path: 'details', component: LeaveListComponent },
          { path: 'details/:id', component: LeaveDetailsComponent },
          { path: 'new', component: LeaveManageComponent },
          { path: 'new/:date', component: LeaveManageComponent },
        ],
      },
      {
        path: 'leave-types',
        component: LeaveTypeMainComponent,
        canActivateChild: [adminAuthGuard],
        children: [
          { path: '', redirectTo: 'details', pathMatch: 'full' },
          { path: 'details', component: LeaveTypeListComponent },
          { path: 'details/:id', component: LeaveTypeDetailsComponent },
          {
            path: 'new',
            component: LeaveTypeManageComponent,
          },
        ],
      },
      {
        path: 'events',
        component: EventMainComponent,
        canActivateChild: [adminAuthGuard],
        children: [
          { path: '', redirectTo: 'details', pathMatch: 'full' },
          { path: 'details', component: EventListComponent },
          { path: 'details/:id', component: EventDetailsComponent },
          {
            path: 'new',
            component: EventManageComponent,
          },
          {
            path: 'new/:date',
            component: EventManageComponent,
          },
        ],
      },
      { path: 'profile', component: MyProfileComponent },
    ],
  },
];
