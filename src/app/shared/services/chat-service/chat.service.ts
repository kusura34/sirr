import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, query, orderBy, collectionData, Timestamp, getDocs, doc, setDoc, getDoc, docData, updateDoc, increment } from '@angular/fire/firestore';
import { Observable, combineLatest, of, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { Message } from '../../models/message/message.interface';
import { ChatItem } from '../../data/chats.data';


@Injectable({ providedIn: 'root' })
export class ChatService {
  private firestore = inject(Firestore);

  getMessages(chatId: string): Observable<Message[]> {
    const ref = collection(this.firestore, `chats/${chatId}/messages`);
    const q = query(ref, orderBy('timestamp', 'asc'));
    return collectionData(q, { idField: 'id' }) as Observable<Message[]>;
  }

  getUserChat(userId: string, chatId: string): Observable<ChatItem | null> {
    const chatDocRef = doc(this.firestore, `users/${userId}/chats/${chatId}`);
    return docData(chatDocRef).pipe(
      map((chatData: any) => {
        if (!chatData) {
          return null;
        }

        return {
          id: chatId,
          name: chatData['name'] || 'Unknown',
          lastMessage: chatData['lastMessage'] || '',
          avatar: chatData['avatar'] || 'images/avatar-placeholder.jpg',
          online: !!chatData['online'],
          timestamp: chatData['timestamp']?.toDate?.() || new Date(),
          unreadCount: chatData['unreadCount'] || 0
        } as ChatItem;
      })
    );
  }

  async sendMessage(chatId: string, text: string, senderId: string) {
    const ref = collection(this.firestore, `chats/${chatId}/messages`);
    await addDoc(ref, {
      text,
      senderId,
      isRead: false,
      timestamp: Timestamp.now()
    });

    const participantIds = chatId.split('_').filter(Boolean);
    const timestamp = Timestamp.now();

    await Promise.all(
      participantIds.map(async (userId) => {
        const chatDocRef = doc(this.firestore, `users/${userId}/chats/${chatId}`);
        await updateDoc(chatDocRef, {
          lastMessage: text,
          timestamp,
          unreadCount: userId === senderId ? 0 : increment(1)
        });
      })
    );
  }

  // Загружает список чатов пользователя из Firestore
  async getUserChats(userId: string): Promise<ChatItem[]> {
    try {
      const userChatsRef = collection(this.firestore, `users/${userId}/chats`);
      const snapshot = await getDocs(userChatsRef);
      
      const chats: ChatItem[] = [];
      for (const chatDoc of snapshot.docs) {
        const chatData = chatDoc.data();
        const chatId = chatDoc.id;
        const participantId = chatId
          .split('_')
          .find((id) => id && id !== userId);

        let resolvedName = chatData['name'] || 'Unknown';
        let resolvedAvatar = chatData['avatar'] || 'images/avatar-placeholder.jpg';
        let resolvedOnline = !!chatData['online'];

        if (participantId) {
          try {
            const participantDocRef = doc(this.firestore, `users/${participantId}`);
            const participantSnap = await getDoc(participantDocRef);
            if (participantSnap.exists()) {
              const participantData = participantSnap.data();
              resolvedName = participantData['displayName'] || participantData['email'] || resolvedName;
              resolvedAvatar = participantData['photoURL'] || resolvedAvatar;
              resolvedOnline = !!participantData['isOnline'];
            }
          } catch (error) {
            console.warn('Не удалось загрузить данные собеседника:', error);
          }
        }

        chats.push({
          id: chatId,
          name: resolvedName,
          lastMessage: chatData['lastMessage'] || '',
          avatar: resolvedAvatar,
          online: resolvedOnline,
          timestamp: chatData['timestamp']?.toDate?.() || new Date(),
          unreadCount: chatData['unreadCount'] || 0
        });
      }
      return chats;
    } catch (error) {
      console.error('Ошибка при загрузке чатов:', error);
      return [];
    }
  }

  // Создает новый чат для пользователя
  async createChat(userId: string, chatId: string, chatData: ChatItem): Promise<void> {
    try {
      const chatDocRef = doc(this.firestore, `users/${userId}/chats/${chatId}`);
      await setDoc(chatDocRef, {
        name: chatData.name,
        lastMessage: chatData.lastMessage,
        avatar: chatData.avatar,
        online: chatData.online,
        timestamp: Timestamp.now(),
        unreadCount: 0,
        createdAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Ошибка при создании чата:', error);
      throw error;
    }
  }

  getUserChatsStream(userId: string): Observable<ChatItem[]> {
    const userChatsRef = collection(this.firestore, `users/${userId}/chats`);
    const q = query(userChatsRef, orderBy('timestamp', 'desc'));

    return collectionData(q, { idField: 'id' }).pipe(
      map((chats: any[]) =>
        chats.map((chat) => ({
          id: chat['id'],
          name: chat['name'] || 'Unknown',
          lastMessage: chat['lastMessage'] || '',
          avatar: chat['avatar'] || 'images/avatar-placeholder.jpg',
          online: !!chat['online'],
          timestamp: chat['timestamp']?.toDate?.() || new Date(),
          unreadCount: chat['unreadCount'] || 0
        } as ChatItem))
      )
    );
  }

  getEnrichedUserChatsStream(userId: string): Observable<ChatItem[]> {
    return this.getUserChatsStream(userId).pipe(
      map((chats) =>
        chats.map((chat) => {
          const participantId = chat.id.split('_').find((id) => id && id !== userId) || '';
          return { chat, participantId };
        })
      ),
      // keep stream stable for empty state
      switchMap((pairs) => {
        if (!pairs.length) {
          return of([] as ChatItem[]);
        }

        return combineLatest(
          pairs.map(({ chat, participantId }) =>
            this.getUserProfile(participantId).pipe(
              map((profile) => ({
                ...chat,
                name: profile?.displayName || profile?.email || chat.name,
                avatar: profile?.photoURL || chat.avatar
              }))
            )
          )
        );
      })
    );
  }

  async markChatAsRead(userId: string, chatId: string): Promise<void> {
    if (!userId || !chatId) {
      return;
    }

    const chatDocRef = doc(this.firestore, `users/${userId}/chats/${chatId}`);
    await updateDoc(chatDocRef, {
      unreadCount: 0
    });
  }

  getUserStatus(userId: string): Observable<boolean> {
    if (!userId) {
      return of(false);
    }

    const userDocRef = doc(this.firestore, `users/${userId}`);
    return docData(userDocRef).pipe(map((data: any) => !!data?.['isOnline']));
  }

  getUserProfile(userId: string): Observable<{ displayName?: string; email?: string; photoURL?: string } | null> {
    if (!userId) {
      return of(null);
    }

    const userDocRef = doc(this.firestore, `users/${userId}`);
    return docData(userDocRef).pipe(
      map((data: any) => {
        if (!data) {
          return null;
        }
        return {
          displayName: data['displayName'],
          email: data['email'],
          photoURL: data['photoURL']
        };
      })
    );
  }
}