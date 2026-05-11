import { Component, inject } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../../../shared/services/auth-service/auth.service";
import { CommonModule } from "@angular/common";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSnackBarModule } from "@angular/material/snack-bar";

@Component({
  selector: "app-auth-page",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatSnackBarModule],
  templateUrl: "./auth-page.component.html",
  styleUrl: "./auth-page.component.scss",
})
export class AuthPageComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  readonly snackBar = inject(MatSnackBar);

  // Режим: true — вход, false — регистрация
  isLoginMode = true;
  isClicked = false;
  showPassword = false;

  authForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [
      Validators.required,
      Validators.minLength(6),
    ]),
    // Имя нужно только для регистрации
    displayName: new FormControl(""),
  });

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    // Очищаем форму при переключении режима
    this.authForm.reset();

    // Если перешли в режим регистрации, добавляем валидатор на имя
    if (!this.isLoginMode) {
      this.authForm.get("displayName")?.setValidators([Validators.required]);
    } else {
      this.authForm.get("displayName")?.clearValidators();
    }
    this.authForm.get("displayName")?.updateValueAndValidity();
    this.authForm.updateValueAndValidity();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async loginGoogle() {
    try {
      await this.authService.loginWithGoogle();
      this.router.navigate(["/chat"]);
    } catch (e: any) {
      console.error("Ошибка входа через Google", e);
      this.showAuthError(e);
    }
  }

  async onSubmit() {
    if (this.authForm.invalid) return;
    const { email, password, displayName } = this.authForm.value;

    try {
      if (this.isLoginMode) {
        await this.authService.signIn(email!, password!);
        this.router.navigate(["/chat"]);
      } else {

        await this.authService.signUp(email!, password!, displayName || "User");


        this.snackBar.open(
          "Аккаунт создан! Пожалуйста, проверьте почту и подтвердите e-mail перед входом. ПРОВЕРЬТЕ РАЗДЕЛ СПАМА",
          "ок",
        );
        this.isLoginMode = true;
        this.authForm.reset();
        this.authForm.get("displayName")?.clearValidators();
        this.authForm.get("displayName")?.updateValueAndValidity();
        this.authForm.updateValueAndValidity();
      }
    } catch (e: any) {
      if (e.code === "auth/email-already-in-use") {
        this.snackBar.open("Этот email уже занят.", "Ок", { duration: 3500 });
      } else {
        this.showAuthError(e);
      }
    }
  }

  private showAuthError(error: any) {
    const code = error?.code || '';
    const messageByCode: Record<string, string> = {
      'auth/invalid-credential': 'Неверный логин или пароль.',
      'auth/user-not-found': 'Пользователь не найден.',
      'auth/wrong-password': 'Неверный пароль.',
      'auth/invalid-email': 'Неверный формат email.',
      'auth/too-many-requests': 'Слишком много попыток входа. Попробуйте позже.',
      'auth/network-request-failed': 'Проблема с сетью. Проверьте интернет и повторите попытку.',
    };

    const fallback = this.isLoginMode
      ? 'Не удалось войти. Проверьте логин и пароль.'
      : 'Не удалось выполнить регистрацию. Проверьте введенные данные.';

    this.snackBar.open(messageByCode[code] || fallback, 'Ок', {
      duration: 4000,
    });
  }
}
