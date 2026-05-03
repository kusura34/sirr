import { CommonModule, NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Message } from '../../../../shared/models/message/message.interface';

@Component({
  selector: 'app-chat-message',
  imports: [CommonModule, NgClass],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss'
})
export class ChatMessageComponent {
@Input() message!: Message;
}
