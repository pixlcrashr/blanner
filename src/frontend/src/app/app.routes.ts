import { Routes } from '@angular/router';



export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/layout.component').then(m => m.LayoutComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./overview/overview.component').then(m => m.OverviewComponent)
      },
      {
        path: 'journal',
        loadComponent: () => import('./journal/journal.component').then(m => m.JournalComponent)
      },
      {
        path: 'import',
        loadComponent: () => import('./import/import.component').then(m => m.ImportComponent)
      }
    ]
  },
  {
    path: 'report',
    loadComponent: () => import('./report/report.component').then(m => m.ReportComponent)
  }
];
