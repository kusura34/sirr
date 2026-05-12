import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, query, orderBy, collectionData, Timestamp, getDocs, doc, setDoc, getDoc, docData, increment } from '@angular/fire/firestore';
import { Observable, combineLatest, of, switchMap, catchError } from 'rxjs';
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

  async getChatInfo(chatId: string): Promise<{participants: string[]} | null> {
    try {
      const chatDocRef = doc(this.firestore, `chats/${chatId}`);
      const snapshot = await getDoc(chatDocRef);
      if (!snapshot.exists()) {
        return null;
      }
      return snapshot.data() as {participants: string[]};
    } catch (error) {
      console.error('Ошибка при получении информации о чате:', error);
      return null;
    }
  }

  getChatInfoStream(chatId: string): Observable<{participants: string[]} | null> {
    const chatDocRef = doc(this.firestore, `chats/${chatId}`);
    return docData(chatDocRef).pipe(
      map(data => data ? (data as {participants: string[]}) : null),
      catchError(() => of(null))
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

    // Получаем участников из документа чата
    const chatInfo = await this.getChatInfo(chatId);
    const participantIds = chatInfo?.participants || [];
    const timestamp = Timestamp.now();

    await Promise.all(
      participantIds.map(async (userId) => {
        const chatDocRef = doc(this.firestore, `users/${userId}/chats/${chatId}`);
        await setDoc(chatDocRef, {
          lastMessage: text,
          timestamp,
          unreadCount: userId === senderId ? 0 : increment(1)
        }, { merge: true });
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

        chats.push({
          id: chatId,
          name: chatData['name'] || 'Unknown',
          lastMessage: chatData['lastMessage'] || '',
          avatar: chatData['avatar'] || '/images/avatar-placeholder.jpg',
          online: !!chatData['online'],
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

  // Создает новый чат в главной коллекции и возвращает ID
  async createNewChat(userId1: string, userId2: string, user1Data: any, user2Data: any): Promise<string> {
    try {
      const chatsRef = collection(this.firestore, 'chats');
      const docRef = await addDoc(chatsRef, {
        participants: [userId1, userId2],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      const chatId = docRef.id;

      // Теперь добавляем ссылку в профили обоих пользователей
      const chatDocRef1 = doc(this.firestore, `users/${userId1}/chats/${chatId}`);
      const chatDocRef2 = doc(this.firestore, `users/${userId2}/chats/${chatId}`);

      await Promise.all([
        setDoc(chatDocRef1, {
          name: user2Data.displayName || user2Data.email,
          avatar: user2Data.photoURL || '/images/avatar-placeholder.jpg',
          lastMessage: '',
          timestamp: Timestamp.now(),
          unreadCount: 0
        }),
        setDoc(chatDocRef2, {
          name: user1Data.displayName || user1Data.email || 'Unknown',
          avatar: user1Data.photoURL || '/images/avatar-placeholder.jpg',
          lastMessage: '',
          timestamp: Timestamp.now(),
          unreadCount: 0
        })
      ]);

      return chatId;
    } catch (error) {
      console.error('Ошибка при создании чата:', error);
      throw error;
    }
  }

  // Создает новый чат для пользователя (используется для обратной совместимости)
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
    // Данные уже обогащены в users/{userId}/chats/{chatId}, просто возвращаем поток
    return this.getUserChatsStream(userId);
  }

  async markChatAsRead(userId: string, chatId: string): Promise<void> {
    if (!userId || !chatId) {
      return;
    }

    const chatDocRef = doc(this.firestore, `users/${userId}/chats/${chatId}`);
    await setDoc(chatDocRef, {
      unreadCount: 0
    }, { merge: true });
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