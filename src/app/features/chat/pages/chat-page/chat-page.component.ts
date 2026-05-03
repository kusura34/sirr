import { Component } from "@angular/core";
import { ChatHeaderComponent } from "../../components/chat-header/chat-header.component";
import { ChatMessageComponent } from "../../components/chat-message/chat-message.component";
import { ChatInputComponent } from "../../components/chat-input/chat-input.component";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-chat-page",
  imports: [
    ChatHeaderComponent,
    ChatMessageComponent,
    ChatInputComponent,
    CommonModule,
  ],
  templateUrl: "./chat-page.component.html",
  styleUrl: "./chat-page.component.scss",
})
export class ChatPageComponent {
handleSendMessage($event: string) {
throw new Error('Method not implemented.');
}
  messages = [
  { text: 'Ассаляму аляйкум! Как продвигается разработка Sirr?', isMine: false, timestamp: new Date(), isRead: true },
  { text: 'Уа аляйкум ассалям! Верстаю компоненты на Angular', isMine: true, timestamp: new Date(), isRead: true },
  { text: 'Понятно, пусть Аллаh поможет', isMine: false, timestamp: new Date(), isRead: false }
];
}
