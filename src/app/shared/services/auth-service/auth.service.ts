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

@Injectable({ providedIn: "root" })
export class AuthService {
  private auth = inject(Auth);

  // Стрим пользователя для всего приложения
  user$ = user(this.auth);

  // --- Google ---
  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  }

  // --- Email & Password ---
  async signUp(email: string, pass: string, name: string) {
    try {
      // 1. Создаем пользователя
      const credential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        pass,
      );

      // 2. Обновляем профиль (добавляем имя)
      if (credential.user) {
        await updateProfile(credential.user, {
          displayName: name,
        });

        // 3. Отправляем письмо с подтверждением
        await sendEmailVerification(credential.user);
      }

      return credential;
    } catch (error) {
      console.error("Ошибка при регистрации:", error);
      throw error; // Пробрасываем ошибку дальше в компонент для обработки
    }
  }

  async signIn(email: string, pass: string) {
    return signInWithEmailAndPassword(this.auth, email, pass);
  }

  // --- Выход ---
  async logout() {
    return signOut(this.auth);
  }
}
