import { Component, inject, signal } from '@angular/core';
import { Helper } from '../../Services/helper';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { email, form, FormField, required } from '@angular/forms/signals';
import { storeData } from '../../models/model';
import { AuthService } from '../../Services/auth-service'

@Component({
  selector: 'app-store-signup',
  imports: [MatIcon, RouterLink, FormField],
  templateUrl: './store-signup.html',
  styleUrl: './store-signup.css',
})
export class StoreSignup {
  helperService = inject(Helper);
  authService = inject(AuthService)

  storeModel = signal<storeData>({
    storeName: '',
    email: '',
    password: ''
  })

  isSuccess = signal(false);
  isLoading = signal(false);

  storeForm = form(this.storeModel, (schemaPath) => {
    required(schemaPath.storeName, { message: 'Store Name is required' });
    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Enter a valid email' });
    required(schemaPath.password, { message: 'Password is required' });
  });

  onSubmit(event: Event) {
    event.preventDefault();

    this.storeForm.storeName().markAsTouched()
    this.storeForm.email().markAsTouched()
    this.storeForm.password().markAsTouched()

    console.log('Form Data', this.storeModel());

    if (this.storeForm().invalid()) {
      return;
    }

    this.isLoading.set(true);
    this.authService.storeSignup(this.storeModel()).subscribe({
      next: (res) => {
        console.log(res)
        this.isLoading.set(false);
        this.isSuccess.set(true);
      },
      error: (err) => {
        console.log(err)
        this.isLoading.set(false);
      }
    })
  }

}
