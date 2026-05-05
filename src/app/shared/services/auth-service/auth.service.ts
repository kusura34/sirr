import { Injectable, inject } from "@angular/core";
import {
  Auth,
  user,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "@angular/fire/auth";
import { doc, Firestore, setDoc, updateDoc } from "@angular/fire/firestore";

@Injectable({ providedIn: "root" })
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore)

  // Стрим пользователя для всего приложения
  user$ = user(this.auth);

  // Сохраняем пользователя в Firestore
  private async saveUserToDatabase(firebaseUser: any) {
    if (!firebaseUser) return;

    try {
      const userDoc = doc(this.firestore, `users/${firebaseUser.uid}`);
      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email?.toLowerCase() || '',
        displayName: firebaseUser.displayName || 'User',
        photoURL: firebaseUser.photoURL || "assets/img/avatar.png",
        isOnline: true,
        lastSeen: new Date(),
        lastUpdated: new Date(),
      };

      console.log('💾 Сохраняю пользователя в Firestore:', userData);
      await setDoc(userDoc, userData, { merge: true });
      console.log('✅ Пользователь успешно сохранен в Firestore');
    } catch (error) {
      console.error('❌ Ошибка при сохранении пользователя:', error);
    }
  }

  private async updatePresence(userId: string, isOnline: boolean) {
    if (!userId) return;

    try {
      const userDoc = doc(this.firestore, `users/${userId}`);
      await updateDoc(userDoc, {
        isOnline,
        lastSeen: new Date(),
      });
    } catch (error) {
      console.error('❌ Ошибка при обновлении статуса:', error);
    }
  }

  // --- Google ---
  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(this.auth, provider);
      
      // Сохраняем пользователя в Firestore
      await this.saveUserToDatabase(credential.user);
      await this.updatePresence(credential.user.uid, true);
      
      return credential;
    } catch (error) {
      console.error("❌ Ошибка при входе через Google:", error);
      throw error;
    }
  }

  // --- Email & Password ---
  async signUp(email: string, pass: string, name: string) {
    try {
      console.log('📝 Начинаю регистрацию:', email);
      
      // 1. Создаем пользователя в Auth
      const credential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        pass,
      );

      console.log('👤 Пользователь создан в Auth');

      // 2. Обновляем профиль (добавляем имя)
      if (credential.user) {
        await updateProfile(credential.user, {
          displayName: name,
        });

        console.log('📛 Имя обновлено в Auth профиле');

        // 3. Отправляем письмо с подтверждением
        await sendEmailVerification(credential.user);
        console.log('📧 Письмо с подтверждением отправлено');

        // 4. Сохраняем в Firestore
        await this.saveUserToDatabase(credential.user);
        await this.updatePresence(credential.user.uid, true);
      }

      return credential;
    } catch (error) {
      console.error("❌ Ошибка при регистрации:", error);
      throw error;
    }
  }

  async signIn(email: string, pass: string) {
    try {
      console.log('🔐 Начинаю вход:', email);
      const credential = await signInWithEmailAndPassword(this.auth, email, pass);
      
      // Сохраняем пользователя в Firestore (на случай, если его там еще нет)
      await this.saveUserToDatabase(credential.user);
      await this.updatePresence(credential.user.uid, true);
      
      console.log('✅ Вход выполнен для:', email);
      return credential;
    } catch (error) {
      console.error("❌ Ошибка при входе:", error);
      throw error;
    }
  }

  // --- Выход ---
  async logout() {
    const currentUser = this.auth.currentUser;
    if (currentUser?.uid) {
      await this.updatePresence(currentUser.uid, false);
    }
    return signOut(this.auth);
  }
}
