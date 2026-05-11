import { Component, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { combineLatest, map, of, switchMap, take } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChatHeaderComponent } from '../chat-header/chat-header.component';
import { ChatInputComponent } from '../chat-input/chat-input.component';
import { ChatMessageComponent } from '../chat-message/chat-message.component';
import { ChatService } from '../../../../shared/services/chat-service/chat.service';
import { AuthService } from '../../../../shared/services/auth-service/auth.service';

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [AsyncPipe, CommonModule, ChatMessageComponent, ChatHeaderComponent, ChatInputComponent],
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.scss'
})
export class ChatWindowComponent {
  private destroyRef = inject(DestroyRef);
  private route = inject(ActivatedRoute);
  private chatService = inject(ChatService);
  private authService = inject(AuthService);
  
  myId$ = this.authService.user$.pipe(map(user => user?.uid || 'unknown'));
  chatId$ = this.route.params.pipe(map(p => p['id']));
  participantId$ = combineLatest([this.myId$, this.chatId$]).pipe(
    map(([myId, chatId]) => chatId?.split('_').find((id: string) => id && id !== myId) ?? '')
  );
  chatInfo$ = combineLatest([this.myId$, this.chatId$]).pipe(
    switchMap(([myId, chatId]) => {
      if (!myId || myId === 'unknown' || !chatId) {
        return of(null);
      }
      return this.chatService.getUserChat(myId, chatId);
    })
  );
  participantProfile$ = this.participantId$.pipe(
    switchMap((participantId) => this.chatService.getUserProfile(participantId))
  );
  chatName$ = combineLatest([this.chatInfo$, this.chatId$, this.participantProfile$]).pipe(
    map(([chatInfo, chatId, profile]) => {
      const nameFromChat = chatInfo?.name?.trim();
      if (nameFromChat && nameFromChat !== chatId) {
        return nameFromChat;
      }

      return profile?.displayName || profile?.email || 'Неизвестный чат';
    })
  );
  isOnline$ = this.participantId$.pipe(
    switchMap((participantId) => this.chatService.getUserStatus(participantId))
  );
  
  messages$ = this.chatId$.pipe(
    switchMap(id => this.chatService.getMessages(id))
  );

  constructor() {
    combineLatest([this.myId$, this.chatId$])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([myId, chatId]) => {
        if (!myId || myId === 'unknown' || !chatId) {
          return;
        }
        this.chatService.markChatAsRead(myId, chatId).catch((error) => {
          console.error('Не удалось сбросить unreadCount:', error);
        });
      });
  }

  send(text: string) {
    const id = this.route.snapshot.params['id'];
    if (text.trim()) {
      // Получаем текущего пользователя и отправляем сообщение
      this.authService.user$.pipe(take(1)).subscribe(user => {
        if (user) {
          this.chatService.sendMessage(id, text, user.uid);
        }
      });
    }
  }
}