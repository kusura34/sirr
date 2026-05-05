import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth-service/auth.service';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.scss'
})
export class ChatListComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Заглушка данных для тестов (потом заменим на данные из Firestore)
  chats = [
    { id: '1', name: 'Support', lastMessage: 'Как вам наш ягодный дизайн?', timestamp: new Date(), avatar: 'assets/img/logo.png', online: true },
    { id: '2', name: 'Dev Team', lastMessage: 'Кэш почистили?', timestamp: new Date(), avatar: 'assets/img/avatar.png', online: false }
  ];

  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/auth']);
    } catch (e) {
      console.error('Ошибка при выходе:', e);
    }
  }
}