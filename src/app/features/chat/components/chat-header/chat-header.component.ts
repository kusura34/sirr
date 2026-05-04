import { Component, Input } from "@angular/core";

@Component({
  selector: 'app-chat-header',
  standalone: true,
  template: `
    <header class="header">
      <div class="user-info">
        <h3>Чат: {{ chatId }}</h3>
        <span class="status">В сети</span>
      </div>
    </header>
  `
})
export class ChatHeaderComponent {
  @Input() chatId: string | null = '';
}