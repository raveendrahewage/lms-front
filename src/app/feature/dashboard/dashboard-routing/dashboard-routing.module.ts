import { Routes } from '@angular/router';
import { adminAuthGuard } from '../auth/adminAuth.guard';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('../dashboard-main/dashboard-main.component').then(
            (m) => m.DashboardMainComponent
          ),
      },
      {
        path: 'employees',
        loadComponent: () =>
          import(
            '../employee-contents/employee-main/employee-main.component'
          ).then((m) => m.EmployeeMainComponent),
        children: [
          { path: '', redirectTo: 'details', pathMatch: 'full' },
          {
            path: 'details',
            loadComponent: () =>
              import(
                '../employee-contents/employee-list/employee-list.component'
              ).then((m) => m.EmployeeListComponent),
          },
          {
            path: 'details/:id',
            loadComponent: () =>
              import(
                '../employee-contents/employee-details/employee-details.component'
              ).then((m) => m.EmployeeDetailsComponent),
          },
          {
            path: 'new',
            loadComponent: () =>
              import(
                '../employee-contents/employee-manage/employee-manage.component'
              ).then((m) => m.EmployeeManageComponent),
            canActivate: [adminAuthGuard],
          },
        ],
      },
      {
        path: 'leaves',
        loadComponent: () =>
          import('../leave-contents/leave-main/leave-main.component').then(
            (m) => m.LeaveMainComponent
          ),
        children: [
          { path: '', redirectTo: 'details', pathMatch: 'full' },
          {
            path: 'details',
            loadComponent: () =>
              import(
                '../leave-contents/leave-list/leave-list.component'
              ).then((m) => m.LeaveListComponent),
          },
          {
            path: 'details/:mode/:id',
            loadComponent: () =>
              import(
                '../leave-contents/leave-details/leave-details.component'
              ).then((m) => m.LeaveDetailsComponent),
          },
          {
            path: 'new',
            loadComponent: () =>
              import(
                '../leave-contents/leave-manage/leave-manage.component'
              ).then((m) => m.LeaveManageComponent),
          },
          {
            path: 'new/:date',
            loadComponent: () =>
              import(
                '../leave-contents/leave-manage/leave-manage.component'
              ).then((m) => m.LeaveManageComponent),
          },
        ],
      },
      {
        path: 'leave-types',
        loadComponent: () =>
          import(
            '../leave-type-contents/leave-type-main/leave-type-main.component'
          ).then((m) => m.LeaveTypeMainComponent),
        canActivateChild: [adminAuthGuard],
        children: [
          { path: '', redirectTo: 'details', pathMatch: 'full' },
          {
            path: 'details',
            loadComponent: () =>
              import(
                '../leave-type-contents/leave-type-list/leave-type-list.component'
              ).then((m) => m.LeaveTypeListComponent),
          },
          {
            path: 'details/:id',
            loadComponent: () =>
              import(
                '../leave-type-contents/leave-type-details/leave-type-details.component'
              ).then((m) => m.LeaveTypeDetailsComponent),
          },
          {
            path: 'new',
            loadComponent: () =>
              import(
                '../leave-type-contents/leave-type-manage/leave-type-manage.component'
              ).then((m) => m.LeaveTypeManageComponent),
          },
        ],
      },
      {
        path: 'events',
        loadComponent: () =>
          import('../event-contents/event-main/event-main.component').then(
            (m) => m.EventMainComponent
          ),
        children: [
          { path: '', redirectTo: 'details', pathMatch: 'full' },
          {
            path: 'details',
            loadComponent: () =>
              import(
                '../event-contents/event-list/event-list.component'
              ).then((m) => m.EventListComponent),
          },
          {
            path: 'details/:id',
            loadComponent: () =>
              import(
                '../event-contents/event-details/event-details.component'
              ).then((m) => m.EventDetailsComponent),
          },
          {
            path: 'new',
            loadComponent: () =>
              import(
                '../event-contents/event-manage/event-manage.component'
              ).then((m) => m.EventManageComponent),
          },
          {
            path: 'new/:date',
            loadComponent: () =>
              import(
                '../event-contents/event-manage/event-manage.component'
              ).then((m) => m.EventManageComponent),
          },
        ],
      },
      {
        path: 'file-upload',
        loadComponent: () =>
          import(
            '../file-upload-contents/file-upload-main/file-upload-main.component'
          ).then((m) => m.FileUploadMainComponent),
        children: [
          {
            path: '',
            loadComponent: () =>
              import(
                '../file-upload-contents/file-upload-page/file-upload-page.component'
              ).then((m) => m.FileUploadPageComponent),
          },
        ],
      },
      {
        path: 'profile',
        loadComponent: () =>
          import(
            '../profile-contents/my-profile/my-profile.component'
          ).then((m) => m.MyProfileComponent),
      },
    ],
  },
];

