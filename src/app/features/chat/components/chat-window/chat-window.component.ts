import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { map, switchMap } from 'rxjs';
import { ChatHeaderComponent } from '../chat-header/chat-header.component';
import { ChatInputComponent } from '../chat-input/chat-input.component';
import { ChatMessageComponent } from '../chat-message/chat-message.component';
import { ChatService } from '../../../../shared/services/chat.service';

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [AsyncPipe, CommonModule, ChatMessageComponent, ChatHeaderComponent, ChatInputComponent],
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.scss'
})
export class ChatWindowComponent {
  private route = inject(ActivatedRoute);
  private chatService = inject(ChatService);
  
  myId = 'current-user-id'; // Временно, пока нет Auth
  chatId$ = this.route.params.pipe(map(p => p['id']));
  
  messages$ = this.chatId$.pipe(
    switchMap(id => this.chatService.getMessages(id))
  );

  send(text: string) {
    const id = this.route.snapshot.params['id'];
    if (text.trim()) {
      this.chatService.sendMessage(id, text, this.myId);
    }
  }
}