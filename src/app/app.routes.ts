import { Routes } from '@angular/router';
import { ChatPageComponent } from './features/chat/pages/chat-page/chat-page.component';
import { authGuard } from './shared/guards/auth.guard';
import { ChatPlaceholderComponent } from './features/chat/components/chat-placeholder/chat-placeholder.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./features/chat/pages/auth-page/auth-page.component')
      .then(m => m.AuthPageComponent)
  },
  {
    path: 'chat',
    component: ChatPageComponent,
    canActivate: [authGuard], // ЗАЩИТА ТУТ
    children: [
      {
        path: ':id',
        loadComponent: () => import('./features/chat/components/chat-window/chat-window.component')
          .then(m => m.ChatWindowComponent)
      },
      {
        path: '',
        component: ChatPlaceholderComponent
      }
    ]
  },
  { path: '', redirectTo: 'chat', pathMatch: 'full' },
  { path: '**', redirectTo: 'chat' }
];