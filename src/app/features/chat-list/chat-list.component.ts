import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div *ngFor="let chat of chats" 
         [routerLink]="['/chat', chat.id]" 
         routerLinkActive="active" 
         class="chat-item">
      <img [src]="chat.avatar" class="avatar">
      <div class="info">
        <div class="name">{{ chat.name }}</div>
        <div class="last-msg">{{ chat.lastMessage }}</div>
      </div>
    </div>
  `
})
export class ChatListComponent {
  chats = [
    { id: '1', name: 'Александр Иванов', lastMessage: 'Привет!', avatar: 'images/avatar-placeholder.jpg' },
    { id: '2', name: 'Kusura IT', lastMessage: 'Новый пост!', avatar: 'images/avatar-placeholder.jpg' }
  ];
}