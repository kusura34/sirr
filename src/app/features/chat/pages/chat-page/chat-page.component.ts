import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { filter, map, startWith } from "rxjs";
import { ChatListComponent } from "../../../chat-list/chat-list.component";

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
  private router = inject(Router);
  isChatOpened$ = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    startWith(null),
    map(() => /^\/chat\/[^/]+$/.test(this.router.url))
  );
}
