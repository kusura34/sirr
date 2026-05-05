import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../../../shared/services/auth-service/auth.service";
import { CommonModule } from "@angular/common";
import { MatSnackBar } from "@angular/material/snack-bar"

@Component({
  selector: "app-auth-page",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: "./auth-page.component.html",
  styleUrl: "./auth-page.component.scss",
})
export class AuthPageComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  readonly snackBar = inject(MatSnackBar)

  // Режим: true — вход, false — регистрация
  isLoginMode = true;
  isClicked = false

  authForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required, Validators.minLength(6)]),
    // Имя нужно только для регистрации
    displayName: new FormControl(""),
  });

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    // Очищаем форму при переключении режима
    this.authForm.reset();
    
    // Если перешли в режим регистрации, добавляем валидатор на имя
    if (!this.isLoginMode) {
      this.authForm.get('displayName')?.setValidators([Validators.required]);
    } else {
      this.authForm.get('displayName')?.clearValidators();
    }
    this.authForm.get('displayName')?.updateValueAndValidity();
    this.authForm.updateValueAndValidity();
  }

  async loginGoogle() {
    try {
      await this.authService.loginWithGoogle();
      this.router.navigate(['/chat']);
    } catch (e) {
      console.error("Ошибка входа через Google", e);
    }
  }

  async onSubmit() {
    if (this.authForm.invalid) return;
    const { email, password, displayName } = this.authForm.value;

    try {
      if (this.isLoginMode) {
        await this.authService.signIn(email!, password!);
        this.router.navigate(['/chat']);
      } else {
        // Регистрация
        await this.authService.signUp(email!, password!, displayName || 'User');
        
        // Показываем сообщение вместо мгновенного редиректа
        this.snackBar.open('Аккаунт создан! Пожалуйста, проверьте почту и подтвердите e-mail перед входом. ПРОВЕРЬТЕ РАЗДЕЛ СПАМА', 'ок', {
          duration: 5000
        });
        this.isLoginMode = true; // Переключаем на вход
        this.authForm.reset();
        this.authForm.get('displayName')?.clearValidators();
        this.authForm.get('displayName')?.updateValueAndValidity();
        this.authForm.updateValueAndValidity();
      }
    } catch (e: any) {
      // Обработка ошибок Firebase (например, если почта уже занята)
      if (e.code === 'auth/email-already-in-use') {
        alert('Этот email уже занят.');
      } else {
        console.error("Ошибка:", e);
      }
    }
  }
}