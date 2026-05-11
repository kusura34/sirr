import { inject, Injectable } from '@angular/core';
import { Firestore, collection, query, getDocs, limit } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private firestore = inject(Firestore);

  async searchUsers(searchText: string) {
    if (!searchText.trim()) return [];

    const searchLower = searchText.toLowerCase().trim();
    console.log('🔍 Ищу пользователей:', searchLower);
    
    const usersRef = collection(this.firestore, 'users');

    try {
      // Получаем всех пользователей для фильтрации на клиенте
      const allUsersQuery = query(usersRef, limit(500)); // Увеличил лимит
      const allUsers = await getDocs(allUsersQuery);
      
      console.log('📊 Всего пользователей в Firestore:', allUsers.docs.length);
      
      const results: any[] = [];
      const seenIds = new Set();

      // Проходим по всем пользователям и ищем совпадение
      allUsers.docs.forEach(doc => {
        const data = doc.data();
        const userId = doc.id;
        
        // Пропускаем, если уже добавили
        if (seenIds.has(userId)) return;

        const email = data['email']?.toLowerCase() || '';
        const displayName = data['displayName']?.toLowerCase() || '';

        console.log(`  👤 ${email} | ${displayName}`);

        // Ищем по email (начинается с текста)
        if (email.includes(searchLower)) {
          console.log(`  ✅ Найден по email: ${email}`);
          results.push(data);
          seenIds.add(userId);
          return;
        }
        
        // Или ищем по displayName (содержит текст)
        if (displayName.includes(searchLower)) {
          console.log(`  ✅ Найден по имени: ${displayName}`);
          results.push(data);
          seenIds.add(userId);
        }
      });

      console.log(`🎯 Итого найдено: ${results.length} пользователей`);
      return results;
    } catch (error) {
      console.error('❌ Ошибка при поиске пользователей:', error);
      return [];
    }
  }
}