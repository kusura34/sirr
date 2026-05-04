import { Component, Input } from "@angular/core";
import { Message } from "../../../../shared/models/message/message.interface";
import { CommonModule, DatePipe } from "@angular/common";

@Component({
  selector: "app-chat-message",
  imports: [DatePipe, CommonModule],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss'
})
export class ChatMessageComponent {
  @Input() message!: Message;
  @Input() isMine: boolean = false;
}
