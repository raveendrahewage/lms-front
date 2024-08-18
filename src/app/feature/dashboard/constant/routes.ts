import { RouteLink } from '../models/route';

export const sidebarRoutes: RouteLink[] = [
  {
    text: 'Home',
    path: '/dashboard',
    isAdminOnly: false,
  },
  {
    text: 'Employees',
    path: '/dashboard/employees',
    isAdminOnly: false,
  },
  {
    text: 'Leaves',
    path: '/dashboard/leaves',
    isAdminOnly: false,
  },
  {
    text: 'Leave Types',
    path: '/dashboard/leave-types',
    isAdminOnly: true,
  },
  {
    text: 'Events',
    path: '/dashboard/events',
    isAdminOnly: false,
  },
];
