import { Routes } from '@angular/router';
import { ChatPageComponent } from './features/chat/pages/chat-page/chat-page.component';
import { ChatPlaceholderComponent } from './features/chat/components/chat-placeholder/chat-placeholder.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'chat',
    pathMatch: 'full'
  },
  {
    path: 'chat',
    component: ChatPageComponent,
    children: [
      {
        path: ':id', // Параметр для ID чата
        loadComponent: () => import('./features/chat/components/chat-window/chat-window.component')
          .then(m => m.ChatWindowComponent)
      },
      {
        path: '', // Дефолтный путь внутри чата (когда никто не выбран)
        component: ChatPlaceholderComponent // Например, заглушка "Выберите чат"
      }
    ]
  },
  {
    path: '**', // Редирект на случай 404
    redirectTo: 'chat'
  }
];