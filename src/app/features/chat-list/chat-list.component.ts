import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../shared/services/auth-service/auth.service';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.scss'
})
export class ChatListComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  search: string = '';

  // Заглушка данных для тестов (потом заменим на данные из Firestore)
  chats = [
    { id: '1', name: 'Support', lastMessage: 'Как вам наш ягодный дизайн?', timestamp: new Date(), avatar: 'assets/img/logo.png', online: true },
    { id: '2', name: 'Dev Team', lastMessage: 'Кэш почистили?', timestamp: new Date(), avatar: 'assets/img/avatar.png', online: false }
  ];

  get filteredChats() {
    if (!this.search) {
      return this.chats;
    }
    return this.chats.filter(chat => 
      chat.name.toLowerCase().includes(this.search.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(this.search.toLowerCase())
    );
  }

  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/auth']);
    } catch (e) {
      console.error('Ошибка при выходе:', e);
    }
  }
}