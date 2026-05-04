import { Component, Input } from "@angular/core";
import { Message } from "../../../../shared/models/message/message.interface";
import { CommonModule, DatePipe } from "@angular/common";

@Component({
  selector: "app-chat-message",
  imports: [DatePipe, CommonModule],
  template: `
    <div class="message-bubble" [class.mine]="isMine">
      <p>{{ message.text }}</p>
      <span class="time">{{
        message.timestamp | date: "HH:mm"
      }}</span>
    </div>
  `,
})
export class ChatMessageComponent {
  @Input() message!: Message;
  @Input() isMine: boolean = false;
}
