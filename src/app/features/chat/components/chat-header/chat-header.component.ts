import { Component, Input } from "@angular/core";

@Component({
  selector: 'app-chat-header',
  standalone: true,
  templateUrl: './chat-header.component.html',
  styleUrl: './chat-header.component.scss',
})
export class ChatHeaderComponent {
  @Input() chatId: string | null = '';
}