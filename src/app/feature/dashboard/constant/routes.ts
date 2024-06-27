import { RouteLink } from '../models/route';

export const adminRoutes: RouteLink[] = [
  {
    text: 'Employees',
    path: '/dashboard/employees',
  },
  {
    text: 'Leaves',
    path: '/dashboard/leaves',
  },
  {
    text: 'Leave Types',
    path: '/dashboard/leave-types',
  },
  {
    text: 'Events',
    path: '/dashboard/events',
  },
];

export const userRoutes: RouteLink[] = [
  {
    text: 'Employees',
    path: '/dashboard/employees',
  },
  {
    text: 'Leaves',
    path: '/dashboard/leaves',
  },
  {
    text: 'Events',
    path: '/dashboard/events',
  },
];
