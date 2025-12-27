import { Routes } from '@angular/router';
import { IdeasPage } from './features/ideas/pages/ideas-page/ideas-page';
export const routes: Routes = [
  { path: '', redirectTo: 'ideas', pathMatch: 'full' },
  { path: 'ideas', component: IdeasPage },
  { path: '**', redirectTo: 'ideas' }
];
