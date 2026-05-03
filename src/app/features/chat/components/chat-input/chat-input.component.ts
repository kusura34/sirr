import { Component, EventEmitter, Output } from "@angular/core";
import { FormsModule } from '@angular/forms';

@Component({
  selector: "app-chat-input",
  imports: [FormsModule],
  templateUrl: "./chat-input.component.html",
  styleUrl: "./chat-input.component.scss",
})
export class ChatInputComponent {
  messageText: string = "";

  @Output() onSend = new EventEmitter<string>();

  public sendMessage() {
    if (this.messageText.trim()) {
      this.onSend.emit(this.messageText);
      this.messageText = "";
    }
  }
}
