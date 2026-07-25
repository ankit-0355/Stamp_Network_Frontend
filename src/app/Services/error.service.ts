import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  errorMessage = signal<string | null>(null);
  onDismissCallback: (() => void) | null = null;

  showError(message: string, onDismiss?: () => void) {
    this.errorMessage.set(message);
    this.onDismissCallback = onDismiss || null;
  }

  clearError() {
    this.errorMessage.set(null);
    if (this.onDismissCallback) {
      this.onDismissCallback();
      this.onDismissCallback = null;
    }
  }
}
