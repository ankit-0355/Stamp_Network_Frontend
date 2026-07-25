import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Helper } from '../../Services/helper';
import { AuthService } from '../../Services/auth-service';

@Component({
  selector: 'app-update-password',
  standalone: true,
  imports: [MatIcon, FormsModule],
  templateUrl: './update-password.html',
  styleUrl: './update-password.css',
})
export class UpdatePassword implements OnInit {
  helperService = inject(Helper);
  authService = inject(AuthService);
  router = inject(Router);

  // ── State signals ──────────────────────────────────────────────────────────
  accessToken = signal('');
  loading = signal(false);
  success = signal(false);
  errorMsg = signal('');
  tokenError = signal(false);

  // ── Show/hide for each password field ─────────────────────────────────────
  showNew = signal(false);
  showConfirm = signal(false);

  // ── Form values ───────────────────────────────────────────────────────────
  newPassword = '';
  confirmPassword = '';

  ngOnInit() {
    // Supabase appends the recovery token in the URL hash:
    // /update-password#access_token=xxx&type=recovery&...
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get('access_token');
    const type = params.get('type');

    if (token && type === 'recovery') {
      this.accessToken.set(token);
    } else {
      this.tokenError.set(true);
    }
  }

  onSubmit(event: Event) {
    event.preventDefault();

    if (this.newPassword !== this.confirmPassword) {
      this.errorMsg.set('Passwords do not match.');
      return;
    }
    if (this.newPassword.length < 6) {
      this.errorMsg.set('Password must be at least 6 characters.');
      return;
    }

    this.loading.set(true);
    this.errorMsg.set('');

    this.authService.updatePassword(this.accessToken(), this.newPassword).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set(true);
        // Redirect to login after 2.5 seconds
        setTimeout(() => this.router.navigate(['/login']), 2500);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMsg.set(err?.error?.detail ?? 'Something went wrong. Please try again.');
      }
    });
  }
}
