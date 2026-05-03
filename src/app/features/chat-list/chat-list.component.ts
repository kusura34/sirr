import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chat-list',
  imports: [DatePipe, CommonModule],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.scss'
})
export class ChatListComponent {

  selectChatId = 1;

  @Input() chat: any;

  chats = [
    { id: 1, name: 'Chat 1', lastMessage: 'Hello!', timestamp: new Date(), avatar: 'images/avatar-placeholder.jpg', online: true, unreadCount: 2 },
    { id: 2, name: 'Chat 2', lastMessage: 'How are you?', timestamp: new Date(), avatar: 'images/avatar-placeholder.jpg', online: false, unreadCount: 0 },
    { id: 3, name: 'Chat 3', lastMessage: 'Goodbye!', timestamp: new Date(), avatar: 'images/avatar-placeholder.jpg', online: true, unreadCount: 5 }
  ];
  selectedChatId = false;
  
  selectChat(id: number) {

  }
}
