import { Component, Input } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-chat-header',
  standalone: true,
  templateUrl: './chat-header.component.html',
  styleUrl: './chat-header.component.scss',
  imports: [RouterLink],
})
export class ChatHeaderComponent {
  @Input() chatName: string | null = '';
}