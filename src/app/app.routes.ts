import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./components/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'meals', loadComponent: () => import('./components/meals.component').then(m => m.MealsComponent) },
  { path: 'meals/:id', loadComponent: () => import('./components/meal-detail.component').then(m => m.MealDetailComponent) },
  { path: 'analytics', loadComponent: () => import('./components/analytics.component').then(m => m.AnalyticsComponent) },
  { path: 'report-wizard', loadComponent: () => import('./components/report-wizard.component').then(m => m.ReportWizardComponent) },
  { path: 'favorites', loadComponent: () => import('./components/favorites.component').then(m => m.FavoritesComponent) },
  { path: 'hakkimizda', loadComponent: () => import('./components/settings.component').then(m => m.SettingsComponent) },
  { path: '**', redirectTo: '' }
];
