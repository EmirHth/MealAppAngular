import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./dashboard.component').then(m => m.DashboardComponent) },
  { path: 'meals', loadComponent: () => import('./meals.component').then(m => m.MealsComponent) },
  { path: 'meals/:id', loadComponent: () => import('./meal-detail.component').then(m => m.MealDetailComponent) },
  // Diğer route'lar ileride eklenecek (analytics, report vs.)
];
