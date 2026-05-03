import { Component } from "@angular/core";
import { ChatHeaderComponent } from "../../components/chat-header/chat-header.component";
import { ChatMessageComponent } from "../../components/chat-message/chat-message.component";
import { ChatInputComponent } from "../../components/chat-input/chat-input.component";
import { CommonModule } from "@angular/common";
import { ChatListComponent } from "../../../chat-list/chat-list.component";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "app-chat-page",
  imports: [
    CommonModule,
    ChatListComponent,
    RouterOutlet
],
  templateUrl: "./chat-page.component.html",
  styleUrl: "./chat-page.component.scss",
})
export class ChatPageComponent {

}
