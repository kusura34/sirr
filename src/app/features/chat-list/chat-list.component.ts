import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CHATS, ChatItem } from '../../shared/data/chats.data';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.scss'
})
export class ChatListComponent {
  chats: ChatItem[] = CHATS;
  search = '';

  get filteredChats(): ChatItem[] {
    const query = this.search.trim().toLowerCase();
    if (!query) {
      return this.chats;
    }

    return this.chats.filter(chat =>
      chat.name.toLowerCase().includes(query) ||
      chat.lastMessage.toLowerCase().includes(query)
    );
  }
}
