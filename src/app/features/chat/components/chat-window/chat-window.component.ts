import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { map, switchMap } from 'rxjs';
import { ChatHeaderComponent } from '../chat-header/chat-header.component';
import { ChatInputComponent } from '../chat-input/chat-input.component';
import { ChatMessageComponent } from '../chat-message/chat-message.component';
import { ChatService } from '../../../../shared/services/chat-service/chat.service';

@Component({
  selector: "app-chat-window",
  imports: [
    ChatHeaderComponent,
    ChatMessageComponent,
    ChatInputComponent,
    CommonModule,
  ],
  templateUrl: "./chat-window.component.html",
  styleUrl: "./chat-window.component.scss",
})
export class ChatWindowComponent {
  handleSendMessage($event: string) {
    throw new Error("Method not implemented.");
  }
  messages = [
    {
      text: "Ассаляму аляйкум! Как продвигается разработка Sirr?",
      isMine: false,
      timestamp: new Date(),
      isRead: true,
    },
    {
      text: "Уа аляйкум ассалям! Верстаю компоненты на Angular",
      isMine: true,
      timestamp: new Date(),
      isRead: true,
    },
    {
      text: "Понятно, пусть Аллаh поможет",
      isMine: false,
      timestamp: new Date(),
      isRead: false,
    },
  ];
}
