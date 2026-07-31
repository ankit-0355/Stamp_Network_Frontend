import { Component, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { Helper } from '../../Services/helper';
import { loginData } from '../../models/model';
import { email, form, FormField, required } from '@angular/forms/signals';
import { AuthService } from '../../Services/auth-service';

@Component({
  selector: 'app-login',
  // standalone: true,
  imports: [MatIcon, FormField, RouterLink, FormsModule,
    MatFormFieldModule, MatInputModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  helperService = inject(Helper);
  authService = inject(AuthService);
  router = inject(Router);

  // ── Login form ──────────────────────────────────────────────────────────────
  loginModel = signal<loginData>({
    email: '',
    password: ''
  });

  loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Enter a valid email' });
    required(schemaPath.password, { message: 'Password is required' });
  });

  onSubmit(event: Event) {
    event.preventDefault();
    this.loginForm.email().markAsTouched();
    this.loginForm.password().markAsTouched();

    if (this.loginForm().invalid()) {
      return;
    }

    this.authService.storeLogin(this.loginModel()).subscribe({
      next: (res) => {
        this.router.navigate(['/dashboard', res.store_id]);
      },
      error: (err) => {
        if (err.status == 401 || err.status == 404) {
          this.authService.showInvalidLogin.set(true);
        }
      }
    });
  }

  // ── Forgot Password modal ────────────────────────────────────────────────────
  showForgotModal = signal(false);
  forgotLoading = signal(false);
  forgotSuccess = signal(false);
  forgotError = signal('');
  forgotEmailValue = '';

  openForgotModal() {
    this.forgotSuccess.set(false);
    this.forgotError.set('');
    this.forgotEmailValue = '';
    this.showForgotModal.set(true);
  }

  closeForgotModal() {
    this.showForgotModal.set(false);
  }

  /** Close when clicking the dark backdrop (not the card itself) */
  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).id === 'forgot-password-modal') {
      this.closeForgotModal();
    }
  }

  onForgotSubmit(event: Event) {
    event.preventDefault();
    if (!this.forgotEmailValue.trim()) return;

    this.forgotLoading.set(true);
    this.forgotError.set('');

    this.authService.requestPasswordReset(this.forgotEmailValue.trim()).subscribe({
      next: () => {
        this.forgotLoading.set(false);
        this.forgotSuccess.set(true);
      },
      error: (err) => {
        this.forgotLoading.set(false);
        this.forgotError.set(err?.error?.detail ?? 'Something went wrong. Please try again.');
      }
    });
  }
}
