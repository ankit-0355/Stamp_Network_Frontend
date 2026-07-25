import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { Helper } from '../../Services/helper';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-terminal',
  imports: [RouterLink, MatIcon],
  templateUrl: './terminal.html',
  styleUrl: './terminal.css',
})
export class Terminal implements OnInit {
  private helper = inject(Helper);
  cookieService = inject(CookieService);

  phoneNumber = signal<string>('');
  showRewardModal = signal<boolean>(false);
  stampCount = signal<number>(0);
  showSuccessToast = signal<boolean>(false);
  toastMessage = signal<string>('');
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');

  /** Stored after a successful /validate so confirmReward can reuse it */
  private pendingPhone = '';

  private toastTimeout: any;

  ngOnInit(): void { }

  onKeyPress(digit: string): void {
    if (this.phoneNumber().length < 10) {
      this.phoneNumber.update((val) => val + digit);
    }
  }

  onBackspace(): void {
    if (this.phoneNumber().length > 0) {
      this.phoneNumber.update((val) => val.slice(0, -1));
    }
  }

  onClear(): void {
    this.phoneNumber.set('');
    this.errorMessage.set('');
  }

  getDigit(index: number): string {
    return this.phoneNumber()[index] || '—';
  }

  validateAndAddStamp(): void {
    const phone = this.phoneNumber();
    this.errorMessage.set('');

    if (phone.length !== 10) {
      this.errorMessage.set('Please enter a valid 10-digit phone number.');
      return;
    }

    const storeId = this.cookieService.get('store_id');
    this.isLoading.set(true);

    this.helper.validateStamp(phone, storeId).subscribe({
      next: (res) => {
        this.isLoading.set(false);

        if (!res.isValid) {
          this.errorMessage.set(res.message ?? 'Customer not found for this store.');
          return;
        }

        this.stampCount.set(res.total_stamps);
        this.pendingPhone = phone;

        if (res.rewardPending) {
          // Show the reward modal — do NOT clear phone yet
          this.showRewardModal.set(true);
        } else {
          const account = res.account?.[0];
          const name = account ? `${account.first_name} ${account.last_name}` : 'Customer';
          this.triggerToast(`Stamp added for ${name}! Total: ${res.total_stamps}/10 stamps.`);
          this.phoneNumber.set('');
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err?.error?.detail ?? 'Something went wrong. Please try again.');
      },
    });
  }

  triggerToast(message: string): void {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    this.toastMessage.set(message);
    this.showSuccessToast.set(true);

    this.toastTimeout = setTimeout(() => {
      this.showSuccessToast.set(false);
    }, 10000);
  }

  closeModal(): void {
    // Dismiss without applying — stamps stay at 10 until next visit
    this.showRewardModal.set(false);
    this.phoneNumber.set('');
    this.pendingPhone = '';
  }

  applyReward(): void {
    const phone = this.pendingPhone || this.phoneNumber();
    const storeId = this.cookieService.get('store_id');
    this.isLoading.set(true);

    this.helper.confirmReward(phone, storeId).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.success) {
          this.showRewardModal.set(false);
          this.stampCount.set(0);
          this.phoneNumber.set('');
          this.pendingPhone = '';
          this.triggerToast('Reward applied! Stamp cycle reset to 0.');
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err?.error?.detail ?? 'Failed to apply reward. Please try again.');
        this.showRewardModal.set(false);
      },
    });
  }
}
