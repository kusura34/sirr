import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

interface ChatItem {
  id: string;
  name: string;
  lastMessage: string;
  avatar: string;
  online: boolean;
  timestamp: Date;
  unreadCount: number;
}

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.scss'
})
export class ChatListComponent {
  chats: ChatItem[] = [
    {
      id: '1',
      name: 'Александр Иванов',
      lastMessage: 'Привет!',
      avatar: 'images/avatar-placeholder.jpg',
      online: true,
      timestamp: new Date(),
      unreadCount: 2
    },
    {
      id: '2',
      name: 'Kusura IT',
      lastMessage: 'Новый пост!',
      avatar: 'images/avatar-placeholder.jpg',
      online: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      unreadCount: 0
    }
  ];
}
