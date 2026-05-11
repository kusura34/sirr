import { Component, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { catchError, concat, combineLatest, map, of, switchMap, take, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChatHeaderComponent } from '../chat-header/chat-header.component';
import { ChatInputComponent } from '../chat-input/chat-input.component';
import { ChatMessageComponent } from '../chat-message/chat-message.component';
import { ChatService } from '../../../../shared/services/chat-service/chat.service';
import { AuthService } from '../../../../shared/services/auth-service/auth.service';
import { Message } from '../../../../shared/models/message/message.interface';

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
    switchMap(id => {
      if (!id) {
        return of([] as Message[]);
      }

      const cached = this.loadCachedMessages(id);
      const backend$ = this.chatService.getMessages(id).pipe(
        tap(messages => this.saveCachedMessages(id, messages)),
        catchError(() => of(cached))
      );

      return cached.length ? concat(of(cached), backend$) : backend$;
    })
  );

  private getCacheKey(chatId: string) {
    return `sirr-chat-cache-${chatId}`;
  }

  private serializeTimestamp(timestamp: any): any {
    if (!timestamp) {
      return null;
    }

    if (typeof timestamp.toDate === 'function') {
      return {
        seconds: timestamp.seconds,
        nanoseconds: timestamp.nanoseconds,
      };
    }

    if (timestamp instanceof Date) {
      return { time: timestamp.getTime() };
    }

    if (typeof timestamp === 'number') {
      return { time: timestamp };
    }

    if (timestamp.seconds != null && timestamp.nanoseconds != null) {
      return {
        seconds: timestamp.seconds,
        nanoseconds: timestamp.nanoseconds,
      };
    }

    return null;
  }

  private deserializeTimestamp(value: any): any {
    if (!value) {
      return null;
    }

    if (value.time != null) {
      const time = value.time;
      return {
        toDate: () => new Date(time),
      };
    }

    if (value.seconds != null && value.nanoseconds != null) {
      const ms = value.seconds * 1000 + Math.floor(value.nanoseconds / 1e6);
      return {
        toDate: () => new Date(ms),
      };
    }

    return value;
  }

  private serializeMessages(messages: Message[]): any[] {
    return messages.map(message => ({
      ...message,
      timestamp: this.serializeTimestamp(message.timestamp)
    }));
  }

  private deserializeMessages(raw: any[]): Message[] {
    return raw.map(item => ({
      ...item,
      timestamp: this.deserializeTimestamp(item.timestamp)
    }));
  }

  private loadCachedMessages(chatId: string): Message[] {
    if (typeof window === 'undefined' || !window.localStorage) {
      return [];
    }

    try {
      const raw = window.localStorage.getItem(this.getCacheKey(chatId));
      return raw ? this.deserializeMessages(JSON.parse(raw)) : [];
    } catch {
      return [];
    }
  }

  private saveCachedMessages(chatId: string, messages: Message[]) {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }

    try {
      window.localStorage.setItem(this.getCacheKey(chatId), JSON.stringify(this.serializeMessages(messages)));
    } catch {
      // ignore localStorage errors
    }
  }

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