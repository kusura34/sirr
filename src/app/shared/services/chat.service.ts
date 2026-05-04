import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, query, orderBy, collectionData, Timestamp } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Message } from '../models/message/message.interface';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private firestore = inject(Firestore);

  getMessages(chatId: string): Observable<Message[]> {
    const ref = collection(this.firestore, `chats/${chatId}/messages`);
    const q = query(ref, orderBy('timestamp', 'asc'));
    return collectionData(q, { idField: 'id' }) as Observable<Message[]>;
  }

  async sendMessage(chatId: string, text: string, senderId: string) {
    const ref = collection(this.firestore, `chats/${chatId}/messages`);
    return addDoc(ref, {
      text,
      senderId,
      isRead: false,
      timestamp: Timestamp.now()
    });
  }
}