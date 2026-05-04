import { Component, ElementRef, EventEmitter, Output, ViewChild } from "@angular/core";
import { FormsModule } from '@angular/forms';

@Component({
  selector: "app-chat-input",
  imports: [FormsModule],
  templateUrl: "./chat-input.component.html",
  styleUrl: "./chat-input.component.scss",
})
export class ChatInputComponent {
  @ViewChild('messageInput') private messageInput?: ElementRef<HTMLInputElement>;
  messageText: string = "";

  @Output() onSend = new EventEmitter<string>();

  public sendMessage() {
    if (this.messageText.trim()) {
      this.onSend.emit(this.messageText);
      this.messageText = "";
      this.focusInput();
    }
  }

  keepKeyboardOpen(event: Event) {
    event.preventDefault();
  }

  private focusInput() {
    setTimeout(() => this.messageInput?.nativeElement.focus(), 0);
  }
}
