// lib/navigation-config.ts

import type { LucideIcon } from 'lucide-react';
import { Home, FileText, Settings, Users, ShoppingCart, ClipboardList, PieChart } from 'lucide-react';

export enum UserRole {
  Admin = 1,
  Producer = 3,
  Customer = 2
}

export interface MenuItem {
  icon: React.ReactElement<LucideIcon>;
  label: string;
  href: string;
  roles: UserRole[]; // Which roles can see this item
}

export const navigationItems: MenuItem[] = [
  {
    icon: <Home size={20} />,
    label: 'Dashboard',
    href: '/dashboard',
    roles: [UserRole.Customer]
  },
  {
    icon: <Home size={20} />,
    label: 'Dashboard',
    href: '/dashboard/producer',
    roles: [ UserRole.Producer]
  },
  {
    icon: <Home size={20} />,
    label: 'Dashboard',
    href: '/dashboard/admin',
    roles: [UserRole.Admin]
  },
  {
    icon: <ClipboardList size={20} />,
    label: 'Upcoming Policies',
    href: '/dashboard/producer/upcoming-policies',
    roles: [UserRole.Producer]
  },
  
  
  {
    icon: <Users size={20} />,
    label: 'Direct Users',
    href: '/dashboard/admin/direct-users',
    roles: [UserRole.Admin]
  },
  {
    icon: <Users size={20} />,
    label: 'Producers',
    href: '/dashboard/admin/producers',
    roles: [UserRole.Admin]
  },
  {
    icon: <Settings size={20} />,
    label: 'Settings',
    href: '/dashboard/settings',
    roles: [UserRole.Admin, UserRole.Producer, UserRole.Customer]
  }
];

export const getNavigationItems = (userRole: UserRole): MenuItem[] => {
  return navigationItems.filter(item => item.roles.includes(userRole));
};