import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Helper } from '../../Services/helper';
import { AuthService } from '../../Services/auth-service';
import { ActivatedRoute } from '@angular/router';


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
  activatedRoute = inject(ActivatedRoute);

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
    const token = this.activatedRoute.snapshot.queryParamMap.get('token');
    console.log("token", token);
    if (token) {
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
        setTimeout(() => this.router.navigate(['/login']), 3500);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMsg.set(err?.error?.detail ?? 'Something went wrong. Please try again.');
      }
    });
  }
}
