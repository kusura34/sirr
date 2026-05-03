import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatPageComponent } from "./features/chat/pages/chat-page/chat-page.component";

@Component({
  selector: 'app-root',
  imports: [ChatPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  
}
