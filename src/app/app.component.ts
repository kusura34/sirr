import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatPageComponent } from "./features/chat/pages/chat-page/chat-page.component";
import { ChatListComponent } from "./features/chat-list/chat-list.component";

@Component({
  selector: 'app-root',
  imports: [ ChatListComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  
}
