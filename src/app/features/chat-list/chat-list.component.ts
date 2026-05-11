import { Component, DestroyRef, ElementRef, ViewChild, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../shared/services/auth-service/auth.service';
import { ChatService } from '../../shared/services/chat-service/chat.service';
import { UsersService } from '../../shared/services/user-service/user.service';
import { ChatItem } from '../../shared/data/chats.data';
import { take } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.scss'
})
export class ChatListComponent implements OnInit {
  @ViewChild('searchInput') private searchInput?: ElementRef<HTMLInputElement>;

  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private chatService = inject(ChatService);
  private usersService = inject(UsersService);
  
  search: string = '';
  chats: ChatItem[] = [];
  searchResults: any[] = [];
  loading = true;
  isSearching = false;

  ngOnInit() {
    // Загружаем чаты текущего пользователя
    this.authService.user$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(user => {
      if (user) {
        this.chatService
          .getEnrichedUserChatsStream(user.uid)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((chats) => {
            this.chats = chats;
            this.loading = false;

            // Если есть хотя бы один чат и открыт placeholder - сразу открываем первый
            if (chats.length > 0 && this.router.url === '/chat') {
              this.router.navigate(['/chat', chats[0].id], { replaceUrl: true });
            }
          });
      } else {
        this.chats = [];
        this.loading = false;
      }
    });

    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      if (params.get('focusSearch') === '1') {
        setTimeout(() => this.searchInput?.nativeElement.focus(), 0);
      }
    });
  }

  get filteredChats() {
    if (!this.search) {
      return this.chats;
    }
    return this.chats.filter(chat => 
      chat.name.toLowerCase().includes(this.search.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(this.search.toLowerCase())
    );
  }

  // Поиск пользователей при вводе в поле поиска
  async onSearchChange(event: Event) {
    const searchText = (event.target as HTMLInputElement).value;
    
    if (!searchText.trim()) {
      this.searchResults = [];
      this.search = '';
      return;
    }

    // Ищем по пользователям
    if (searchText.length > 0) {
      this.isSearching = true;
      try {
        this.searchResults = await this.usersService.searchUsers(searchText);
      } catch (error) {
        console.error('❌ Ошибка при поиске:', error);
        this.searchResults = [];
      } finally {
        this.isSearching = false;
      }
    } else {
      this.search = searchText;
      this.searchResults = [];
    }
  }

  // Создание чата с выбранным пользователем
  async startChat(user: any) {
    try {
      this.authService.user$.pipe(take(1)).subscribe(async currentUser => {
        if (!currentUser) return;

        // Генерируем ID чата на основе обоих пользователей
        const chatId = [currentUser.uid, user.uid].sort().join('_');

        // Добавляем чат в список чатов текущего пользователя
        const chatDataForCurrentUser: ChatItem = {
          id: chatId,
          name: user.displayName || user.email,
          lastMessage: '',
          avatar: user.photoURL || 'images/avatar-placeholder.jpg',
          online: false,
          timestamp: new Date(),
          unreadCount: 0
        };

        // И зеркальный чат у собеседника, чтобы он тоже видел диалог
        const chatDataForRecipient: ChatItem = {
          id: chatId,
          name: currentUser.displayName || currentUser.email || 'Unknown',
          lastMessage: '',
          avatar: currentUser.photoURL || 'images/avatar-placeholder.jpg',
          online: true,
          timestamp: new Date(),
          unreadCount: 0
        };

        // Сохраняем чат в Firestore для обоих пользователей
        await Promise.all([
          this.chatService.createChat(currentUser.uid, chatId, chatDataForCurrentUser),
          this.chatService.createChat(user.uid, chatId, chatDataForRecipient),
        ]);

        // Очищаем результаты поиска
        this.searchResults = [];
        this.search = '';

        // Переходим к чату
        this.router.navigate(['/chat', chatId]);
      });
    } catch (error) {
      console.error('Ошибка при создании чата:', error);
    }
  }

  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/auth']);
    } catch (e) {
      console.error('Ошибка при выходе:', e);
    }
  }
}