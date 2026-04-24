import { Routes } from '@angular/router';
import { TaskListComponent } from './components/task-list/task-list.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'tarefas'
  },
  {
    path: 'tarefas',
    component: TaskListComponent
  },
  {
    path: '**',
    redirectTo: 'tarefas'
  }
];
